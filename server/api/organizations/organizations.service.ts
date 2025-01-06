import { Prisma } from '@prisma/client';
import { DBService } from '../../services/db.service';

export class OrganizationService extends DBService {
  async createOrganization(data: Prisma.OrganizationCreateInput) {
    return this.db.organization.create({ data });
  }

  async getOrganizations(params?: {
    skip?: number;
    take?: number;
    cursor?: Prisma.OrganizationWhereUniqueInput;
    where?: Prisma.OrganizationWhereInput;
    orderBy?: Prisma.OrganizationOrderByWithRelationInput;
  }) {
    return this.db.organization.findMany(params);
  }

  async getOrganizationById(id: string) {
    return this.db.organization.findUnique({
      where: { id },
      include: {
        stores: true,
        users: true
      }
    });
  }

  async getOrganizationsByUser(userId: string) {
    try {
      // Get user with their role and organization
      const user = await this.db.user.findUnique({
        where: { id: userId },
        include: {
          organization: true
        }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // For SUPER_ADMIN, return all organizations
      if (user.role === 'SUPER_ADMIN') {
        return this.db.organization.findMany();
      }

      // For all other roles, return only their organization
      if (user.organizationId) {
        return [user.organization];
      }

      // If user has no organization assigned
      return [];
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch organizations';
      throw new Error(errorMessage);
    }
  }

  async updateOrganization(id: string, data: Prisma.OrganizationUpdateInput) {
    return this.db.organization.update({
      where: { id },
      data
    });
  }

  async deleteOrganization(id: string) {
    return this.db.organization.delete({ where: { id } });
  }
}
