import { Router } from 'express';
import * as storeModuleController from './store-modules.controller';
import { checkAccess, ROLES } from '../../middleware/auth.middleware';

const router = Router();

router.get(
  '/store-modules/:storeId',
  checkAccess(ROLES.ADMIN),
  storeModuleController.getStoreModules
);

router.get(
  '/store-modules/:storeId/:moduleId',
  checkAccess(ROLES.ADMIN),
  storeModuleController.getModuleWithDevices
);

router.put(
  '/store-modules/:storeId/:moduleId',
  checkAccess(ROLES.ADMIN),
  storeModuleController.updateModuleState
);

router.post(
  '/store-modules/:storeId/initialize',
  checkAccess(ROLES.ADMIN),
  storeModuleController.initializeStoreModules
);

export default router; 