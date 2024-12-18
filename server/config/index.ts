import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
  port: z.number().default(4000),
  nodeEnv: z.enum(["development", "production", "test"]).default("development"),
  db: z.object({
    host: z.string(),
    port: z.number().default(5432),
    name: z.string(),
    user: z.string(),
    password: z.string(),
    ssl: z.boolean().default(false),
  }),
  cors: z.object({
    origin: z.string().default("*"),
    credentials: z.boolean().default(true),
  }),
  ssl: z.object({
    privateKeyPath: z.string(),
    certificatePath: z.string(),
  }),
  jwt: z.object({
    accessTokenSecret: z.string(),
    refreshTokenSecret: z.string(),
    accessTokenExpiry: z.string().default("15m"),
    refreshTokenExpiry: z.string().default("7d"),
    refreshThreshold: z.number().default(300),
  }),
});

export const config = configSchema.parse({
  port: process.env.PORT ? parseInt(process.env.PORT) : undefined,
  nodeEnv: process.env.NODE_ENV,
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.DB_SSL === "true",
  },
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: process.env.CORS_CREDENTIALS === "true",
  },
  ssl: {
    privateKeyPath: process.env.SSL_PRIVATE_KEY_PATH,
    certificatePath: process.env.SSL_CERTIFICATE_PATH,
  },
  jwt: {
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
    accessTokenExpiry: process.env.JWT_ACCESS_TOKEN_EXPIRY,
    refreshTokenExpiry: process.env.JWT_REFRESH_TOKEN_EXPIRY,
    refreshThreshold: process.env.JWT_REFRESH_THRESHOLD
      ? parseInt(process.env.JWT_REFRESH_THRESHOLD)
      : undefined,
  },
});
