import { Router } from 'express';

import * as POSController from './pos.controller';
import { checkAccess, ROLES } from '../../middleware/auth.middleware';
const router = Router();

const apiBasePath = '/pos';

/**
 * @swagger
 * tags:
 *   name: POS Routes
 *   description: API for POS Clover services
 */

/**
 * @swagger
 * /pos/charge:
 *   post:
 *     summary: Create a charge
 *     tags: [POS Routes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               currency:
 *                 type: string
 *               source:
 *                 type: string
 *               description:
 *                 type: string
 *             required:
 *               - amount
 *               - currency
 *               - source
 *     responses:
 *       200:
 *         description: Charge created successfully
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Failed to create charge
 */
router.post(
  `${apiBasePath}/charge`,
  checkAccess(ROLES.USER),
  POSController.createCharge
);

export default router;
