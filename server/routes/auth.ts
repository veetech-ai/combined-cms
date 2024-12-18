import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { AuthService } from "../services/auth.service";
import { User } from "../../src/types";
import pool from "../db";
import { config } from "../config";

const router = Router();

interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface TokenPayload {
  userId: string;
  role: User["role"];
  rememberMe?: boolean;
}

// Token configuration
const ACCESS_TOKEN_EXPIRY = config.jwt.accessTokenExpiry;
const REFRESH_TOKEN_EXPIRY = config.jwt.refreshTokenExpiry;
const JWT_SECRET = config.jwt.accessTokenSecret;
const REFRESH_TOKEN_SECRET = config.jwt.refreshTokenSecret;

const authService = new AuthService(pool);

router.post("/login", async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body as LoginRequest;

    // Find user in database
    const user = await authService.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create token payload
    const payload: TokenPayload = {
      userId: user.id,
      role: user.role,
      rememberMe,
    };

    // Generate tokens
    const accessToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });
    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
      expiresIn: rememberMe ? REFRESH_TOKEN_EXPIRY : "1d",
    });

    // Store refresh token in database
    await authService.createRefreshToken(
      refreshToken,
      user.id,
      rememberMe
        ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        : new Date(Date.now() + 24 * 60 * 60 * 1000)
    );

    // Set refresh token as HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organizationId: user.organizationId,
        storeId: user.storeId,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/refresh-token", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token required" });
  }

  try {
    const storedToken = await authService.findRefreshToken(refreshToken);
    if (!storedToken || storedToken.expiresAt < new Date()) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const payload = jwt.verify(
      refreshToken,
      REFRESH_TOKEN_SECRET
    ) as TokenPayload;
    const newAccessToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
});

router.post("/logout", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    await authService.deleteRefreshToken(refreshToken);
  }

  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
});

export default router;
