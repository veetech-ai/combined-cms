import { Request, Response } from 'express';
import { encryptPassword } from './../../util/password';
import { prisma } from '../../db';
import { StoreService } from './../stores/stores.service';
import { UserService } from './users.service';
import { OrganizationService } from '../organizations/organizations.service';
import { asyncHandler } from '../../util/asyn-handler';
import { ApiError } from '../../util/api.error';

const userService = new UserService(prisma);
const storeService = new StoreService(prisma);
const organizationService = new OrganizationService(prisma);

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
	const users = await userService.getUsers();
	res.json(users.map(({ refreshTokens, ...user }) => user));
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
	const { name, email, password, role, organizationId, storeId } = req.body;

	if (!name || !email || !password || !role) {
		throw new ApiError(400, 'Name, email, password, and role are required');
	}

	if (password.trim().length < 8) {
		return res.status(400).json({
			message: 'Password must be atleast of 8 characters',
		});
	}

	// Validate role
	if (!['USER', 'MANAGER', 'ADMIN'].includes(role)) {
		throw new ApiError(400, 'Invalid role');
	}

	// Check if email is already in use
	const existingUser = await userService.getUserByEmail(email);
	if (existingUser) {
		throw new ApiError(400, 'Email already in use');
	}

	// Validate organization and store if provided
	if (organizationId) {
		await organizationService.getOrganizationById(organizationId);
	}

	if (storeId) {
		await storeService.getStoreById(storeId);
	}

	const newUser = await userService.createUser({
		name,
		email,
		password: await encryptPassword(password),
		role,
		organization: organizationId
			? { connect: { id: organizationId } }
			: undefined,
		store: storeId ? { connect: { id: storeId } } : undefined,
	});

	// Don't send password in response
	const { password: _, ...userResponse } = newUser;
	res.status(201).json(userResponse);
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;

	const user = await userService.getUserById(id);
	if (!user) {
		throw new ApiError(404, 'User not found');
	}

	if (user.role === 'SUPER_ADMIN') {
		throw new ApiError(403, 'Cannot delete super admin user');
	}

	await userService.deleteUser(id);
	res.status(204).send();
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	if (!id) {
		throw new ApiError(400, 'Missing user id');
	}

	const user = await userService.getUserById(id);
	if (!user) {
		throw new ApiError(404, 'User not found');
	}

	if (user.role === 'SUPER_ADMIN') {
		throw new ApiError(403, 'Cannot change super admin user');
	}

	const { password: _, ...updatedUser } = await userService.updateUser(
		id,
		req.body
	);
	res.status(200).json(updatedUser);
});
