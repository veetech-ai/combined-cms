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
		return this.db.user.findMany({
			...params,
			include: {
				organization: true,
				store: true,
			},
		});
	}

	async getUserById(id: string) {
		return this.db.user.findUnique({
			where: { id },
			include: {
				organization: true,
				store: true,
				refreshTokens: true,
			},
		});
	}

	async getUserByEmail(email: string) {
		return this.db.user.findUnique({
			where: { email },
			include: {
				organization: true,
				store: true,
			},
		});
	}

	async updateUser(id: string, data: Prisma.UserUpdateInput) {
		return this.db.user.update({
			where: { id },
			data,
		});
	}

	async deleteUser(id: string) {
		return this.db.user.delete({ where: { id } });
	}
}
