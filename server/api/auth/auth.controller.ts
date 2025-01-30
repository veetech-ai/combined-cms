import jwt from 'jsonwebtoken';
import { AuthService } from './auth.service';
import { config } from '../../config';
import { prisma } from '../../db';
import { checkPassword } from '../../util/password';
import crypto from 'crypto';
import { User } from '@prisma/client';

interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface TokenPayload {
  userId: string;
  role: User['role'];
  organizationId?: string;
  storeId?: string;
  rememberMe?: boolean;
}

// Token configuration
const ACCESS_TOKEN_EXPIRY = config.jwt.accessTokenExpiry;
const JWT_SECRET = config.jwt.accessTokenSecret;
const REFRESH_TOKEN_SECRET = config.jwt.refreshTokenSecret;

const REFRESH_TOKEN_EXPIRY_MS_REMEMBER_ME = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
const REFRESH_TOKEN_EXPIRY_MS_DEFAULT = 24 * 60 * 60 * 1000; // 1 day in milliseconds

const authService = new AuthService(prisma);

const encryptToken = (token: string): string => {
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    crypto.createHash('sha256').update(REFRESH_TOKEN_SECRET).digest(),
    Buffer.alloc(16, 0) // Initialization vector (IV) set to zero
  );
  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

export const login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body as LoginRequest;

    if (
      !email ||
      !email.trim().length ||
      !password ||
      !password.trim().length
    ) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Find user in database
    const user = await authService.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await checkPassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create token payload
    const payload: TokenPayload = {
      userId: user.id,
      role: user.role,
      organizationId: user.organizationId ?? undefined,
      storeId: user.storeId ?? undefined,
      rememberMe
    };

    // Generate tokens
    const accessToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY
    });
    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
      expiresIn: rememberMe
        ? `${REFRESH_TOKEN_EXPIRY_MS_REMEMBER_ME / 1000}s`
        : `${REFRESH_TOKEN_EXPIRY_MS_DEFAULT / 1000}s`
    });

    // Encrypt refresh token
    const encryptedRefreshToken = encryptToken(refreshToken);

    // Store encrypted refresh token in database
    await authService.createRefreshToken(
      encryptedRefreshToken,
      user.id,
      rememberMe
        ? new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS_REMEMBER_ME)
        : new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS_DEFAULT)
    );

    // Set refresh token as HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: rememberMe
        ? REFRESH_TOKEN_EXPIRY_MS_REMEMBER_ME
        : REFRESH_TOKEN_EXPIRY_MS_DEFAULT
    });

    res.json({
      accessToken,
      expiresIn: ACCESS_TOKEN_EXPIRY,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organizationId: user.organizationId,
        storeId: user.storeId
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken ?? req.body.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token required' });
  }

  try {
    // Encrypt incoming refresh token for lookup
    const encryptedRefreshToken = encryptToken(refreshToken);
    const storedToken = await authService.findRefreshToken(
      encryptedRefreshToken
    );
    if (!storedToken || storedToken.expiresAt < new Date()) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const payload = jwt.verify(
      refreshToken,
      REFRESH_TOKEN_SECRET
    ) as TokenPayload;
    const newAccessToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY
    });

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || 'Invalid refresh token';
    res.status(401).json({ message: errorMessage });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      // Encrypt incoming refresh token for deletion
      const encryptedRefreshToken = encryptToken(refreshToken);
      await authService.deleteRefreshToken(encryptedRefreshToken);
    }

    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out' });
  } catch (error) {
    console.log(error.response?.data?.message || error.message);
    const errorMessage =
      error.response?.data?.message || error.message || 'Invalid refresh token';
    res.status(401).json({ message: errorMessage });
  }
};
