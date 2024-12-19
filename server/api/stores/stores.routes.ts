import { Router } from 'express';
import * as storeController from './stores.controller';
import {
	belongsToOrganization,
	belongsToOrganizationOfStore,
	belongsToStore,
	checkAccess,
	ROLES,
} from '../../middleware/auth.middleware';

const router = Router();

router.get('/stores', checkAccess(ROLES.USER), storeController.getStoresByUser);

router.post(
	'/stores',
	checkAccess(ROLES.ADMIN),
	belongsToOrganization,
	storeController.createStore
);

router.put(
	'/stores/:id',
	checkAccess(ROLES.MANAGER),
	belongsToStore,
	storeController.updateStore
);

router.delete(
	'/stores/:id',
	checkAccess(ROLES.ADMIN),
	belongsToOrganizationOfStore,
	storeController.deleteStore
);

export default router;
