import { Router } from 'express';
import * as orgController from './organizations.controller';
import {
	belongsToOrganization,
	checkAccess,
	ROLES,
} from '../../middleware/auth.middleware';

const router = Router();

router.get(
	'/organizations',
	checkAccess(ROLES.USER),
	orgController.getOrganizationsByUser
);

router.get(
	'/organizations/:id',
	checkAccess(ROLES.USER),
	belongsToOrganization,
	orgController.getOrganizationById
);

router.post(
	'/organizations',
	checkAccess(ROLES.SUPER_ADMIN),
	orgController.createOrganization
);

router.put(
	'/organizations/:id',
	checkAccess(ROLES.ADMIN),
	belongsToOrganization,
	orgController.updateOrganization
);

router.delete(
	'/organizations/:id',
	checkAccess(ROLES.SUPER_ADMIN),
	orgController.deleteOrganization
);

export default router;
