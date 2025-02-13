import { Request, Response } from 'express';
import { asyncHandler } from '../../util/asyn-handler';
import { ApiError } from '../../util/api.error';
import { DeviceService } from './displays.service';
import { z } from 'zod';
import { StoreService } from '../stores/stores.service';

const deviceService = new DeviceService();
const storeService = new StoreService();

const newDeviceSchema = z.object({
  name: z.string(),
  hexCode: z.string(),
  storeModuleId: z.string()
});

const updateDeviceSchema = z.object({
  name: z.string().optional(),
  hexCode: z.string().optional(),
  status: z.enum(['ONLINE', 'OFFLINE']).optional(),
  location: z.string().optional(),
  storeModuleId: z.string().optional()
});

export const getDevices = asyncHandler(async (req: Request, res: Response) => {
  const devices = await deviceService.getDevices();
  res.json(devices);
});

export const addDevice = asyncHandler(async (req: Request, res: Response) => {
  const newDevice = req.body;

  // validate newDevice
  const validatedDevice = newDeviceSchema.safeParse(newDevice);
  if (!validatedDevice.success) {
    throw new ApiError(400, validatedDevice.error.message);
  }

  // check if device with same hex code already exists
  const existingDevice = await deviceService.getDevices({
    where: { hexCode: validatedDevice.data.hexCode }
  });

  if (existingDevice && existingDevice.length > 0) {
    throw new ApiError(400, 'Device with this hex code already exists');
  }

  const device = await deviceService.createDevice(newDevice);
  res.status(201).json(device);
});

export const updateDevice = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    // validate updateData
    const validatedUpdateData = updateDeviceSchema.safeParse(updateData);
    if (!validatedUpdateData.success) {
      throw new ApiError(400, validatedUpdateData.error.message);
    }

    // check if device exists
    const device = await deviceService.getDevices({ where: { id } });

    if (!device) {
      throw new ApiError(404, 'Device not found');
    }

    const updatedDevice = await deviceService.updateDevice(id, updateData);
    res.json(updatedDevice);
  }
);

export const deleteDevice = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    // check if device exists
    const device = await deviceService.getDevices({ where: { id } });

    if (!device) {
      throw new ApiError(404, 'Device not found');
    }

    await deviceService.deleteDevice(id);
    res.status(204).send();
  }
);

export const getDisplayById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const device = await deviceService.getDevices({ where: { id } });
    res.json(device);
  }
);

export const getStoreDevices = asyncHandler(
  async (req: Request, res: Response) => {
    const { storeId } = req.params;

    // check if store exists
    const store = await storeService.getStores({ where: { id: storeId } });
    if (!store) {
      throw new ApiError(404, 'Store not found');
    }

    // check if devices exist
    const devices = await deviceService.getDevices({
      where: { storeModule: { storeId } }
    });
    if (!devices) {
      throw new ApiError(404, 'No devices found');
    }

    res.json(devices);
  }
);
