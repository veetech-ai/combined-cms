// organizations.controller.ts
import { Request, Response } from 'express';
import { prisma } from '../../db';
import { OrganizationService } from './organizations.service';
import { asyncHandler } from '../../util/asyn-handler';
import { ApiError } from '../../util/api.error';
import { AuthenticationRequest } from '../../types';

const organizationService = new OrganizationService(prisma);

export const getOrganizations = asyncHandler(
  async (req: Request, res: Response) => {
    const organizations = await organizationService.getOrganizations();
    res.json(organizations);
  }
);

export const getOrganizationById = asyncHandler(
  async (req: Request, res: Response) => {
    const orgId = req.params.id;
    if (!orgId) {
      throw new ApiError(400, 'Organization ID is required');
    }

    const organization = await organizationService.getOrganizationById(orgId);
    if (!organization) {
      throw new ApiError(404, 'Organization not found');
    }

    res.json(organization);
  }
);

export const getOrganizationsByUser = asyncHandler(
  async (req: AuthenticationRequest, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApiError(400, 'User ID is required');
    }

    const orgs = await organizationService.getOrganizationsByUser(userId);
    res.json(orgs);
  }
);

export const createOrganization = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, logo } = req.body;

    if (!name) {
      throw new ApiError(400, 'Name is required');
    }

    const newOrg = await organizationService.createOrganization({
      name,
      logo
    });

    res.status(201).json(newOrg);
  }
);

export const updateOrganization = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, logo } = req.body;

    const updateData: Partial<{
      name: string;
      description: string;
      logo: string;
    }> = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (logo !== undefined) updateData.logo = logo;

    const updatedOrg = await organizationService.updateOrganization(
      id,
      updateData
    );
    res.json(updatedOrg);
  }
);

export const deleteOrganization = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    await organizationService.deleteOrganization(id);
    res.status(204).send();
  }
);
