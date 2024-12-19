import dotenv from 'dotenv';
import { z, ZodError } from 'zod';
import { formatZodError } from '../util/zod.error';

dotenv.config();

const configSchema = z.object({
	port: z.number().default(4000),
	nodeEnv: z
		.enum(['development', 'production', 'test'])
		.default('development'),
	db: z.object({
		host: z.string(),
		port: z.number().default(5432),
		name: z.string().default('plct_core'),
		user: z.string(),
		password: z.string(),
		ssl: z.boolean().default(false),
		url: z.string().url(),
	}),
	cors: z.object({
		origin: z.string().default('*'),
		credentials: z.boolean().default(true),
	}),
	jwt: z.object({
		accessTokenSecret: z.string(),
		refreshTokenSecret: z.string(),
		accessTokenExpiry: z.string().default('15m'),
		refreshTokenExpiry: z.string().default('7d'),
		refreshThreshold: z.number().default(300),
	}),
});


const env = {
	port: process.env.SERVER_PORT
		? parseInt(process.env.SERVER_PORT)
		: undefined,
	nodeEnv: process.env.NODE_ENV,
	db: {
		host: process.env.DB_HOST,
		port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
		name: process.env.DB_NAME,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		ssl: process.env.DB_SSL === 'true',

		// it is required by primsa to be in .env
		// so not constructing from db creds
		url: process.env.DATABASE_URL,
	},
	cors: {
		origin: process.env.CORS_ORIGIN,
		credentials: process.env.CORS_CREDENTIALS === 'true',
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
};

export const config = (() => {
	try {
		return configSchema.parse(env);
	} catch (error) {
		if (error instanceof ZodError) {
			console.error(formatZodError(error));
			process.exit(1);
		}

		// The following is technically unreachable but satisfies TypeScript:
		throw new Error('Configuration initialization failed.');
	}
})();
