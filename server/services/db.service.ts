import { PrismaClient } from '@prisma/client';

export class DBService {
	protected db: PrismaClient;

	constructor(prisma: PrismaClient) {
		this.db = prisma;
	}

	testConnection() {
		return this.db.$connect();
	}
}
