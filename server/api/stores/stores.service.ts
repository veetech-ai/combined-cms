import { Prisma } from '@prisma/client';
import { DBService } from '../../services/db.service';

export class StoreService extends DBService {
	async createStore(data: Prisma.StoreCreateInput) {
		return this.db.store.create({ data });
	}

	async getStores(params?: {
		skip?: number;
		take?: number;
		cursor?: Prisma.StoreWhereUniqueInput;
		where?: Prisma.StoreWhereInput;
		orderBy?: Prisma.StoreOrderByWithRelationInput;
	}) {
		return this.db.store.findMany({
			...params,
			include: {
				organization: true,
				users: true,
				aisles: true,
				products: true,
			},
		});
	}

	async getStoreById(id: string) {
		return this.db.store.findUnique({
			where: { id },
			include: {
				organization: true,
				users: true,
				aisles: true,
				products: true,
				searchEvents: true,
				catalogs: true,
			},
		});
	}

	async updateStore(id: string, data: Prisma.StoreUpdateInput) {
		return this.db.store.update({
			where: { id },
			data,
		});
	}

	async deleteStore(id: string) {
		return this.db.store.delete({ where: { id } });
	}
}
