import { Prisma, ModuleStatus } from '@prisma/client';
import { DBService } from '../../services/db.service';

export class StoreModuleService extends DBService {
  async getStoreModules(storeId: string) {
    return this.db.storeModule.findMany({
      where: { storeId },
      include: {
        module: true,
        Devices: {
          include: {
            screenSpecs: true
          }
        }
      }
    });
  }

  async updateModuleState(storeId: string, moduleId: string, isEnabled: boolean) {
    const status = isEnabled ? ModuleStatus.APPROVED : ModuleStatus.DISABLED;
    
    const defaultStats = {
      activeDevices: 0,
      activeUsers: 0,
      lastUpdated: new Date().toISOString()
    };

    return this.db.storeModule.upsert({
      where: {
        storeId_moduleId: {
          storeId,
          moduleId
        }
      },
      update: {
        isEnabled,
        status,
        stats: isEnabled ? defaultStats : {}
      },
      create: {
        storeId,
        moduleId,
        isEnabled,
        status,
        stats: isEnabled ? defaultStats : {}
      }
    });
  }

  async initializeStoreModules(storeId: string) {
    const modules = await this.db.module.findMany();
    
    const storeModules = modules.map(module => ({
      storeId,
      moduleId: module.id,
      isEnabled: false,
      status: ModuleStatus.DISABLED,
      stats: null
    }));

    return this.db.storeModule.createMany({
      data: storeModules,
      skipDuplicates: true
    });
  }

  async getModuleWithDevices(storeId: string, moduleId: string) {
    return this.db.storeModule.findUnique({
      where: {
        storeId_moduleId: {
          storeId,
          moduleId
        }
      },
      include: {
        module: true,
        Devices: {
          include: {
            screenSpecs: true
          }
        }
      }
    });
  }

  async updateModuleStats(storeId: string, moduleId: string, stats: any) {
    return this.db.storeModule.update({
      where: {
        storeId_moduleId: {
          storeId,
          moduleId
        }
      },
      data: {
        stats
      }
    });
  }
} 