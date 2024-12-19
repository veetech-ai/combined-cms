import { Prisma } from '@prisma/client';
import { DBService } from '../../services/db.service';

export class UserService extends DBService {
	async createUser(data: Prisma.UserCreateInput) {
		return this.db.user.create({ data });
	}

	async getUsers(params?: {
		skip?: number;
		take?: number;
		cursor?: Prisma.UserWhereUniqueInput;
		where?: Prisma.UserWhereInput;
		orderBy?: Prisma.UserOrderByWithRelationInput;
	}) {
		const users = await this.db.user.findMany({
			...params,
			include: {
				organization: true,
				store: true,
			},
		});

		return users.map(({ password, ...user }) => user);
	}

	async getUserById(id: string) {
		const { password, ...user } = await this.db.user.findUnique({
			where: { id },
			include: {
				organization: true,
				store: true,
				refreshTokens: true,
			},
		});

		return user;
	}

	async getUserByEmail(email: string) {
		const { password, ...user } = await this.db.user.findUnique({
			where: { email },
			include: {
				organization: true,
				store: true,
			},
		});

		return user;
	}

	async updateUser(id: string, data: Prisma.UserUpdateInput) {
		return this.db.user.update({
			where: { id },
			data,
			select: {
				password: false,
			},
		});
	}

	async deleteUser(id: string) {
		return this.db.user.delete({
			where: { id },
			select: { password: false },
		});
	}
}
