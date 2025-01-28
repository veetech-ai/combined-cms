import { Request, Response } from 'express';
import { StoreModuleService } from './store-modules.service';
import { prisma } from '../../db';
import { asyncHandler } from '../../util/asyn-handler';
import { ApiError } from '../../util/api.error';
import { ModuleStatus } from '@prisma/client';

const storeModuleService = new StoreModuleService(prisma);

export const getStoreModules = asyncHandler(async (req: Request, res: Response) => {
  const { storeId } = req.params;
  
  if (!storeId) {
    throw new ApiError(400, 'Store ID is required');
  }

  const modules = await storeModuleService.getStoreModules(storeId);
  
  // Transform the response to match the frontend expectations
  const transformedModules = modules.map(({ module, isEnabled, stats, Devices }) => ({
    id: module.id,
    name: module.name,
    key: module.key,
    isEnabled,
    stats: stats || {
      activeDevices: Devices?.length || 0,
      activeUsers: 0,
      lastUpdated: new Date().toISOString()
    }
  }));
  
  res.json(transformedModules);
});

export const updateModuleState = asyncHandler(async (req: Request, res: Response) => {
  const { storeId, moduleId } = req.params;
  const { isEnabled } = req.body;
  console.log(req.body);
  if (!storeId || !moduleId) {
    throw new ApiError(400, 'Store ID and Module ID are required');
  }

  if (typeof isEnabled !== 'boolean') {
    throw new ApiError(400, 'isEnabled must be a boolean value');
  }

  const updatedModule = await storeModuleService.updateModuleState(
    storeId,
    moduleId,
    isEnabled
  );
  // Transform the response
  const { module, stats, Devices } = updatedModule;
  const transformedModule = {
    id: moduleId,
    isEnabled: updatedModule.isEnabled,
    stats: stats || {
      activeDevices: Devices?.length || 0,
      activeUsers: 0,
      lastUpdated: new Date().toISOString()
    }
  };
  
  res.json(transformedModule);
});

export const initializeStoreModules = asyncHandler(async (req: Request, res: Response) => {
  const { storeId } = req.params;

  if (!storeId) {
    throw new ApiError(400, 'Store ID is required');
  }

  await storeModuleService.initializeStoreModules(storeId);
  const modules = await storeModuleService.getStoreModules(storeId);
  
  // Transform the response
  const transformedModules = modules.map(({ module, isEnabled, stats, Devices }) => ({
    id: module.id,
    name: module.name,
    key: module.key,
    isEnabled,
    stats: stats || {
      activeDevices: Devices?.length || 0,
      activeUsers: 0,
      lastUpdated: new Date().toISOString()
    }
  }));
  
  res.json(transformedModules);
});

export const getModuleWithDevices = asyncHandler(async (req: Request, res: Response) => {
  const { storeId, moduleId } = req.params;

  if (!storeId || !moduleId) {
    throw new ApiError(400, 'Store ID and Module ID are required');
  }

  const storeModule = await storeModuleService.getModuleWithDevices(storeId, moduleId);
  
  if (!storeModule) {
    throw new ApiError(404, 'Store module not found');
  }

  res.json(storeModule);
}); 