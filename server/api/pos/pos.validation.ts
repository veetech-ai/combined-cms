import { z } from 'zod';

export const createChargeSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().min(1),
  source: z.string().min(1),
  description: z.string().optional()
});
