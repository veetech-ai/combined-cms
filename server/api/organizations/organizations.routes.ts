import { Router } from 'express';
import { Swagger } from 'swagger-jsdoc'; // Assuming swagger-jsdoc is used for Swagger documentation

/**
 * @swagger
 * tags:
 *   name: Organizations
 *   description: API for managing organizations
 */

/**
 * @swagger
 * /organizations:
 *   get:
 *     summary: Retrieve organizations by user
 *     tags: [Organizations]
 *     responses:
 *       200:
 *         description: A list of organizations
 */
import * as orgController from './organizations.controller';
import {
  belongsToOrganization,
  checkAccess,
  ROLES
} from '../../middleware/auth.middleware';

const router = Router();

router.get(
  '/organizations',
  checkAccess(ROLES.USER),
  orgController.getOrganizationsByUser
);

/**
 * @swagger
 * /organizations/{id}:
 *   get:
 *     summary: Retrieve a specific organization by ID
 *     tags: [Organizations]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the organization
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The organization details
 */
router.get(
  '/organizations/:id',
  checkAccess(ROLES.USER),
  belongsToOrganization,
  orgController.getOrganizationById
);

/**
 * @swagger
 * /organizations:
 *   post:
 *     summary: Create a new organization
 *     tags: [Organizations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       201:
 *         description: The created organization
 */
router.post(
  '/organizations',
  checkAccess(ROLES.SUPER_ADMIN),
  orgController.createOrganization
);

/**
 * @swagger
 * /organizations/{id}:
 *   put:
 *     summary: Update an existing organization
 *     tags: [Organizations]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the organization
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated organization
 */
router.put(
  '/organizations/:id',
  checkAccess(ROLES.ADMIN),
  belongsToOrganization,
  orgController.updateOrganization
);

/**
 * @swagger
 * /organizations/{id}:
 *   delete:
 *     summary: Delete an organization
 *     tags: [Organizations]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the organization
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Organization deleted
 */
router.delete(
  '/organizations/:id',
  checkAccess(ROLES.SUPER_ADMIN),
  orgController.deleteOrganization
);

export default router;
