import { PrismaClient } from '@prisma/client';
import { prisma } from '../db';

export class DBService {
	protected db: PrismaClient;

	constructor(prismaC: PrismaClient = prisma) {
		this.db = prismaC;
	}

	testConnection() {
		return this.db.$connect();
	}
}
