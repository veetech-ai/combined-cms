import { Request, Response } from 'express';
import { DisplayService } from './displays.service';
import { prisma } from '../../db';
import { asyncHandler } from '../../util/asyn-handler';
import { ApiError } from '../../util/api.error';

const displayService = new DisplayService(prisma);

export const getDisplays = asyncHandler(async (req: Request, res: Response) => {
  const { storeId, moduleId } = req.query;
  
  const where: any = {};
  if (storeId) where.storeId = storeId;
  if (moduleId) where.moduleId = moduleId;

  const displays = await displayService.getDisplays({ where });
  res.json(displays);
});

export const createDisplay = asyncHandler(async (req: Request, res: Response) => {
  const { name, hexCode, storeId, moduleId } = req.body;

  if (!name || !hexCode || !storeId || !moduleId) {
    throw new ApiError(400, 'Missing required fields');
  }

  const display = await displayService.createDisplay({
    name,
    hexCode: hexCode.toUpperCase(),
    store: { connect: { id: storeId } },
    module: { connect: { id: moduleId } }
  });

  res.status(201).json(display);
});

export const updateDisplay = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, hexCode, status } = req.body;

  const updateData: any = {};
  if (name) updateData.name = name;
  if (hexCode) updateData.hexCode = hexCode.toUpperCase();
  if (status) updateData.status = status;

  const display = await displayService.updateDisplay(id, updateData);
  res.json(display);
});

export const deleteDisplay = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await displayService.deleteDisplay(id);
  res.status(204).send();
}); 