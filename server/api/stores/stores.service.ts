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
        users: true
        // TODO: Include other relations for stores
        // aisles: true,
        // products: true
      }
    });
  }

  async getStoresByUser(userId: string) {
    try {
      // Get user with their role and store
      const user = await this.db.user.findUnique({
        where: { id: userId },
        include: {
          store: true
        }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // For SUPER_ADMIN, return all stores
      if (user.role === 'SUPER_ADMIN') {
        return this.db.store.findMany();
      }
      // For ADMIN, return all stores of his org
      else if (user.role === 'ADMIN') {
        return this.db.store.findMany({
          where: {
            organizationId: user.organizationId
          }
        });
      }

      // For all other roles, return only their store
      if (user.storeId) {
        return [user.store];
      }

      // If user has no store assigned
      return [];
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch stores';
      throw new Error(errorMessage);
    }
  }

  async getStoreById(id: string) {
    return this.db.store.findUnique({
      where: { id },
      include: {
        organization: true,
        users: true
        // TODO: Include other relations for stores
        // aisles: true,
        // products: true,
        // searchEvents: true,
        // catalogs: true
      }
    });
  }

  async updateStore(id: string, data: Prisma.StoreUpdateInput) {
    return this.db.store.update({
      where: { id },
      data
    });
  }

  async deleteStore(id: string) {
    return this.db.store.delete({ where: { id } });
  }
}
