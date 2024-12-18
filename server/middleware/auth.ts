import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../../src/types";
import { config } from "../config";
import { AuthService } from "../services/auth.service";
import pool from "../db";

interface AuthRequest extends Request {
  user?: User;
}

const authService = new AuthService(pool);

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const payload = jwt.verify(token, config.jwt.accessTokenSecret) as {
      userId: string;
      role: User["role"];
      exp?: number;
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
        res.setHeader("x-new-access-token", newToken);
      }
    }

    const user = await authService.findUserById(payload.userId);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Role-based authorization middleware
export const authorize = (...roles: User["role"][]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};
