import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AuthService } from '../api/auth/auth.service';
import { prisma } from '../db';
import { UserService } from '../api/users/users.service';
import { StoreService } from '../api/stores/stores.service';
import { OrganizationService } from '../api/organizations/organizations.service';
import { User } from '@prisma/client';

interface AuthRequest extends Request {
  user?: User;
}

const authService = new AuthService(prisma);

export const ensureValidToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const payload = jwt.verify(token, config.jwt.accessTokenSecret) as {
      userId: string;
      role: User['role'];
      exp?: number;
      rememberMe: boolean;
    };

    // Check if token is close to expiry, if rememberMe is true
    if (payload.rememberMe) {
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp - now < config.jwt.refreshThreshold) {
        // Generate new token
        const newToken = jwt.sign(
          { userId: payload.userId, role: payload.role },
          config.jwt.accessTokenSecret,
          { expiresIn: config.jwt.accessTokenExpiry }
        );

        // Set the new token in response header
        res.setHeader('x-new-access-token', newToken);
      }
    }

    const user = await authService.findUserById(payload.userId);

    if (!user) {
      return res.status(401).json({ message: 'Invalid token.' });
    }

    if (user.status === 'INACTIVE') {
      return res.status(401).json({ message: 'Account is inactive' });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Access Levels:
// Access Level 1 (Super Admin) has access
// Access Level 2 (Super Admin and Admin) has access
// Access Level 3 (Super Admin and Admin and Manager) has access
// Access Level 4 (Super Admin and Admin and Manager and User) has access

export enum ROLES {
  SUPER_ADMIN = 1,
  ADMIN = 2,
  MANAGER = 3,
  USER = 4
}

// Base middleware factory for role-based access
export const checkAccess = (requiredAccessLevel: ROLES) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRoleValue = ROLES[req.user.role];

    if (
      typeof userRoleValue === 'number' &&
      userRoleValue <= requiredAccessLevel
    ) {
      return next();
    }

    return res.status(403).json({ error: 'Access denied' });
  };
};

const userService = new UserService(prisma);

const organizationService = new OrganizationService();
const storeService = new StoreService();

type resourceType = 'user' | 'store' | 'organization' | 'module';
interface EntityMiddlewareConfig {
  entityType: 'organization' | 'store';
  resource: resourceType;
  bypassRoles?: ROLES[];
}

export const belongsToEntity = ({
  entityType,
  resource,
  bypassRoles = [ROLES.ADMIN]
}: EntityMiddlewareConfig) => {
  const services = {
    user: userService,
    organization: organizationService,
    store: storeService
  };

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const entityId =
        entityType === 'organization'
          ? req.user.organizationId
          : req.user.storeId;

      const resourceId = req.params.id || req.body[`${entityType}Id`];

      if (!(resource in services)) {
        console.error(`Invalid resource type: ${resource}`);
        return res.status(400).json({ error: 'Invalid resource type' });
      }

      // Check if user role bypasses restrictions
      if (bypassRoles.includes(req.user.role as unknown as ROLES)) {
        return next();
      }

      // Basic validation
      if (!entityId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      // Fetch and validate the resource

      const service = services[resource];
      if (!service) return res.status(403).json({ error: 'Access denied' });

      const resourceData = await service[`get${capitalize(resource)}ById`](
        resourceId
      );

      const hasAccess =
        resourceData && resourceData[`${entityType}Id`] === entityId;

      if (hasAccess) {
        return next();
      }

      return res.status(403).json({ error: 'Access denied' });
    } catch (error) {
      console.error('Access validation error:', error);
      return res.status(500).json({ error: 'Access validation failed' });
    }
  };
};

const capitalize = (str: string) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

export const belongsToOrganization = belongsToEntity({
  entityType: 'organization',
  resource: 'organization',
  bypassRoles: [ROLES.ADMIN]
});

export const belongsToStore = belongsToEntity({
  entityType: 'store',
  resource: 'store',
  bypassRoles: [ROLES.ADMIN, ROLES.ADMIN]
});

export const belongsToOrganizationOfStore = belongsToEntity({
  entityType: 'organization',
  resource: 'store',
  bypassRoles: [ROLES.ADMIN]
});

export const belongsToOrganizationOfUser = belongsToEntity({
  entityType: 'organization',
  resource: 'user',
  bypassRoles: [ROLES.ADMIN]
});

export const belongsToStoreOfOrganization = belongsToEntity({
  entityType: 'store',
  resource: 'organization',
  bypassRoles: [ROLES.ADMIN]
});

export const belongsToStoreOfUser = belongsToEntity({
  entityType: 'store',
  resource: 'user',
  bypassRoles: [ROLES.ADMIN, ROLES.ADMIN]
});

/*

belongsToOrganization
belongsToStore

belongsToOrganizationOf(Store)
belongsToOrganizationOf(User)

belongsToStoreOf(Organization)
belongstoStoreOf(User)
*/
