import { Prisma, Devices } from '@prisma/client';
import { DBService } from '../../services/db.service';
import { ApiError } from '../../util/api.error';

type DeviceWithRelations = Devices & {
  storeModule: {
    id: string;
    name: string;
    store: {
      id: string;
      name: string;
    };
    module: {
      id: string;
      name: string;
    };
  };
  screenSpecs: {
    id: string;
    size: string;
    resolution: string | null;
    aspectRatio: string | null;
  };
};

export class DeviceService extends DBService {
  async getDevices(params?: {
    where?: Prisma.DevicesWhereInput;
    orderBy?: Prisma.DevicesOrderByWithRelationInput;
  }): Promise<DeviceWithRelations[]> {
    const devices = await this.db.devices.findMany({
      ...params,
      include: {
        storeModule: {
          select: {
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
        },
        screenSpecs: {
          select: {
            id: true,
            size: true,
            resolution: true,
            aspectRatio: true
          }
        }
      }
    });

    return devices;
  }

  async createDevice(data: {
    name: string;
    hexCode: string;
    storeModuleId: string;
    screenSpecsId: string;
  }): Promise<DeviceWithRelations> {
    if (!/^[0-9A-F]{8}$/i.test(data.hexCode)) {
      throw new ApiError(400, 'Invalid hex code format');
    }

    try {
      return this.db.devices.create({
        data: {
          name: data.name,
          status: 'OFFLINE',
          location: 'Pending Setup',
          hexCode: data.hexCode,
          storeModule: {
            connect: {
              id: data.storeModuleId
            }
          }
        },
        include: {
          storeModule: {
            include: {
              store: true,
              module: true
            }
          },
          screenSpecs: true
        }
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ApiError(400, 'Hex code already exists');
      }
      throw error;
    }
  }

  async updateDevice(
    id: string,
    data: {
      name?: string;
      status?: string;
      location?: string;
    }
  ) {
    try {
      return await this.db.devices.update({
        where: { id },
        data,
        include: {
          storeModule: {
            include: {
              store: true,
              module: true
            }
          },
          screenSpecs: true
        }
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new ApiError(404, 'Device not found');
      }
      throw error;
    }
  }

  async deleteDevice(id: string) {
    try {
      return await this.db.devices.delete({
        where: { id }
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new ApiError(404, 'Device not found');
      }
      throw error;
    }
  }
}
