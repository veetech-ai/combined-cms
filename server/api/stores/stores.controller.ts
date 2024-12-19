import { Request, Response } from 'express';
import { StoreService } from './stores.service';
import { prisma } from '../../db';
import { OrganizationService } from '../organizations/organizations.service';
import { asyncHandler } from '../../util/asyn-handler';
import { ApiError } from '../../util/api.error';

const storeService = new StoreService(prisma);
const organizationService = new OrganizationService(prisma);

export const getStores = asyncHandler(async (req: Request, res: Response) => {
	const stores = await storeService.getStores();
	res.json(stores);
});

export const getStoresByUser = asyncHandler(
	async (req: Request, res: Response) => {
		const userId = req.user?.userId;
		if (!userId) {
			throw new ApiError(400, 'User ID is required');
		}

		const orgs = await storeService.getStoresByUser(userId);
		res.json(orgs);
	}
);

export const createStore = asyncHandler(async (req: Request, res: Response) => {
	const { name, location, description, organizationId } = req.body;

	if (!name || !location || !organizationId) {
		throw new ApiError(
			400,
			'Name, location, and organization ID are required'
		);
	}

	// Validate organization exists
	const org = await organizationService.getOrganizationById(organizationId);

	if (!org) {
		throw new ApiError(400, 'Org not found');
	}

	const newStore = await storeService.createStore({
		name,
		location,
		description,
		organization: { connect: { id: organizationId } },
	});

	res.status(201).json(newStore);
});

export const updateStore = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	const { name, location, description, organizationId } = req.body;

	const updateData: Record<string, any> = {};
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

export const deleteStore = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	await storeService.deleteStore(id);
	res.status(204).send();
});
