import { Prisma, PrismaClient, Display } from '@prisma/client';
import { DBService } from '../../services/db.service';
import { ApiError } from '../../util/api.error';

type DisplayWithRelations = Display & {
  store: {
    id: string;
    name: string;
  };
  module: {
    id: string;
    name: string;
  };
};

export class DisplayService extends DBService {
  async getDisplays(params?: {
    where?: Prisma.DisplayWhereInput;
    orderBy?: Prisma.DisplayOrderByWithRelationInput;
  }): Promise<DisplayWithRelations[]> {
    const displays = await this.db.display.findMany({
      ...params,
      include: {
        store: {
          select: {
            id: true,
            name: true
          }
        },
        module: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    return displays;
  }

  async createDisplay(data: {
    name: string;
    hexCode: string;
    store: { connect: { id: string } };
    module: { connect: { id: string } };
  }): Promise<DisplayWithRelations> {
    if (!/^[0-9A-F]{8}$/i.test(data.hexCode)) {
      throw new ApiError(400, 'Invalid hex code format');
    }

    try {
      return await this.db.display.create({
        data: {
          name: data.name,
          hexCode: data.hexCode.toUpperCase(),
          store: data.store,
          module: data.module
        },
        include: {
          store: true,
          module: true
        }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ApiError(400, 'Hex code already exists');
      }
      throw error;
    }
  }

  async updateDisplay(id: string, data: {
    name?: string;
    hexCode?: string;
    status?: string;
  }) {
    if (data.hexCode && !/^[0-9A-F]{8}$/i.test(data.hexCode)) {
      throw new ApiError(400, 'Invalid hex code format');
    }

    try {
      return await this.db.display.update({
        where: { id },
        data,
        include: {
          store: true,
          module: true
        }
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new ApiError(404, 'Display not found');
      }
      throw error;
    }
  }

  async deleteDisplay(id: string) {
    try {
      return await this.db.display.delete({
        where: { id }
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new ApiError(404, 'Display not found');
      }
      throw error;
    }
  }
} 