import pkg from 'pg';
import { config } from '../config';
import { PrismaClient } from '@prisma/client';
const { Pool } = pkg;

const pool = new Pool({
	host: config.db.host,
	port: config.db.port,
	database: config.db.name,
	user: config.db.user,
	password: config.db.password,
	ssl: config.db.ssl,
});

// Optional: add error handling
pool.on('error', err => {
	console.error('Unexpected error on idle client', err);
	process.exit(-1);
});

class PrismaSingleton {
	private static instance: PrismaClient;

	// Private constructor to prevent direct construction calls with the `new` operator
	private constructor() {}

	// Public static method to get the singleton instance
	public static getInstance(): PrismaClient {
		if (!PrismaSingleton.instance) {
			PrismaSingleton.instance = new PrismaClient({
				// Optional: Add any global Prisma client configurations here
				// For example:
				// log: ['query', 'info', 'warn', 'error'],
			});
		}

		return PrismaSingleton.instance;
	}

	public static async disconnect(): Promise<void> {
		if (PrismaSingleton.instance) {
			await PrismaSingleton.instance.$disconnect();
			PrismaSingleton.instance = undefined;
		}
	}
}

export const prisma = PrismaSingleton.getInstance();

export default pool;
