import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../../src/types";
import { config } from "../config";
import { AuthService } from '../api/auth/auth.service';
import { prisma } from '../db';
import { UserService } from '../api/users/users.service';

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
		};

		// Check if token is close to expiry, if rememberMe is true
		if (payload.rememberMe) {
			const now = Math.floor(Date.now() / 1000);
			if (
				payload.exp &&
				payload.exp - now < config.jwt.refreshThreshold
			) {
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
	USER = 4,
}

interface AccessConfig {
	entityType: 'organization' | 'store';
	bypassRoles?: ROLES[];
	requiresDbVerification?: boolean;
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

// Generic entity access middleware factory
export const createEntityAccessMiddleware = (config: AccessConfig) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const {
				entityType,
				bypassRoles = [ROLES.SUPER_ADMIN],
				requiresDbVerification = false,
			} = config;

			// Get the relevant IDs based on entity type
			const accessedId = req.params.id;
			const entityId =
				entityType === 'organization'
					? req.user.organizationId
					: req.user.storeId;

			// Check if user role bypasses restrictions
			if (bypassRoles.includes(req.user.role as unknown as ROLES)) {
				return next();
			}

			// Basic validation
			if (!accessedId || !entityId) {
				return res.status(403).json({ error: 'Access denied' });
			}

			// Optional DB verification (if needed in the future)
			if (requiresDbVerification) {
				const user = await userService.getUserById(req.user.userId);
				if (!user) {
					return res.status(403).json({ error: 'User not found' });
				}

				const hasAccess =
					entityType === 'organization'
						? user.organizationId === accessedId
						: user.storeId === accessedId;

				if (hasAccess) {
					return next();
				} else {
					return res.status(403).json({ error: 'Access denied' });
				}
			}

			// Direct ID comparison
			if (accessedId === entityId) {
				return next();
			}

			return res.status(403).json({ error: 'Access denied' });
		} catch (error) {
			return res.status(500).json({ error: 'Access validation failed' });
		}
	};
};

// Create specific middleware instances
export const belongsToOrganization = createEntityAccessMiddleware({
	entityType: 'organization',
	bypassRoles: [ROLES.SUPER_ADMIN],
});

export const belongsToStore = createEntityAccessMiddleware({
	entityType: 'store',
	bypassRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
});