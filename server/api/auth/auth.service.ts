import { PrismaClient } from '@prisma/client';

export class AuthService {
	private prisma: PrismaClient;

	constructor(prisma: PrismaClient) {
		this.prisma = prisma;
	}

	async findUserByEmail(email: string) {
		return this.prisma.user.findUnique({
			where: { email },
			select: {
				id: true,
				email: true,
				password: true,
				name: true,
				role: true,
				organizationId: true,
				storeId: true,
			},
		});
	}

	async findUserById(id: string) {
		return this.prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				email: true,
				password: true,
				name: true,
				role: true,
				organizationId: true,
				storeId: true,
			},
		});
	}

	async createRefreshToken(
		token: string,
		userId: string,
		expiresAt: Date
	): Promise<void> {
		await this.prisma.refreshToken.create({
			data: {
				token,
				userId,
				expiresAt,
			},
		});
	}

	async findRefreshToken(token: string): Promise<{
		id: string;
		token: string;
		userId: string;
		expiresAt: Date;
	} | null> {
		return this.prisma.refreshToken.findUnique({
			where: { token },
			select: {
				id: true,
				token: true,
				userId: true,
				expiresAt: true,
			},
		});
	}

	async deleteRefreshToken(token: string): Promise<void> {
		await this.prisma.refreshToken.delete({
			where: { token },
		});
	}

	async deleteExpiredRefreshTokens(): Promise<void> {
		await this.prisma.refreshToken.deleteMany({
			where: {
				expiresAt: {
					lt: new Date(),
				},
			},
		});
	}
}
