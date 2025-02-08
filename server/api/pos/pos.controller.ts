// pos.controller.ts
import { Request, Response } from 'express';
import { prisma } from '../../db';
import { POSCloverService } from './pos.clover.service';
import { asyncHandler } from '../../util/asyn-handler';
import { ApiError } from '../../util/api.error';
import { createChargeSchema } from './pos.validation';

const posCloverService = new POSCloverService(prisma);

export const createCharge = asyncHandler(
  async (req: Request, res: Response) => {
    const parsedBody = createChargeSchema.safeParse(req.body);

    if (!parsedBody.success) {
      throw new ApiError(400, parsedBody.error.message);
    }
    const charge = await posCloverService.createCharge(parsedBody.data);

    res.json(charge);
  }
);
