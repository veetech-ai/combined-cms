import { Request, Response } from 'express';

/**
 * @swagger
 * tags:
 *   name: Stores
 *   description: API for managing stores
 */
import { StoreService } from './stores.service';
import { prisma } from '../../db';
import { OrganizationService } from '../organizations/organizations.service';
import { asyncHandler } from '../../util/asyn-handler';
import { ApiError } from '../../util/api.error';
import { AuthenticationRequest } from '../../types';

const storeService = new StoreService(prisma);
const organizationService = new OrganizationService(prisma);

/**
 * @swagger
 * /stores:
 *   get:
 *     summary: Retrieve all stores
 *     tags: [Stores]
 *     responses:
 *       200:
 *         description: A list of stores
 */
export const getStores = asyncHandler(async (req: Request, res: Response) => {
  const stores = await storeService.getStores();
  res.json(stores);
});

/**
 * @swagger
 * /stores/user:
 *   get:
 *     summary: Retrieve stores by user
 *     tags: [Stores]
 *     responses:
 *       200:
 *         description: A list of stores for the authenticated user
 */
export const getStoresByUser = asyncHandler(
  async (req: AuthenticationRequest, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApiError(400, 'User ID is required');
    }

    const orgs = await storeService.getStoresByUser(userId);
    res.json(orgs);
  }
);

/**
 * @swagger
 * /stores:
 *   post:
 *     summary: Create a new store
 *     tags: [Stores]
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
 *               organizationId:
 *                 type: string
 *     responses:
 *       201:
 *         description: The created store
 */
export const createStore = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    location,
    phone,
    address,
    modules,
    operatingHours,
    organizationId
  } = req.body;

  // Validate required fields
  if (!name || !location || !organizationId) {
    throw new ApiError(400, 'Name, location, and organization ID are required');
  }
  
  //Validate organization exists
  // var org = await organizationService.getOrganizationById(
  //   req.body.organizationId
  // );

  // console.log(org);

  // if (!org) {
  //   throw new ApiError(400, 'Organization not found');
  // }
  //Transform the data to match Prisma schema
  const storeData = {
    name,
    location,
    phone,
    address: address.street,
    city: address.city,
    state: address.state,
    zipCode: address.zipCode,
    modules: modules || [],
    operatingHours: operatingHours || {},
    organization: {
      connect: { id: organizationId }
    }
  };

  const newStore = await storeService.createStore(storeData);
  res.status(201).json(newStore);
});

/**
 * @swagger
 * /stores/{id}:
 *   put:
 *     summary: Update an existing store
 *     tags: [Stores]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the store
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
 *               description:
 *                 type: string
 *               organizationId:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated store
 */
export const updateStore = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, location, description, organizationId } = req.body;

  const updateData: Partial<{
    name: string;
    location: string;
    description: string;
    organization: { connect: { id: string } };
  }> = {};
  if (name) updateData.name = name;
  if (location) updateData.location = location;
  if (description !== undefined) updateData.description = description;

  if (organizationId) {
    // This will throw ApiError if org doesn't exist
    await organizationService.getOrganizationById(organizationId);
    updateData.organization = { connect: { id: organizationId } };
  }

  const updatedStore = await storeService.updateStore(id, updateData);
  res.json(updatedStore);
});

/**
 * @swagger
 * /stores/{id}:
 *   delete:
 *     summary: Delete a store
 *     tags: [Stores]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the store
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Store deleted
 */
export const deleteStore = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await storeService.deleteStore(id);
  res.status(204).send();
});
