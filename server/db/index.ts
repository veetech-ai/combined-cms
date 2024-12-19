import { PrismaClient } from '@prisma/client';

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
