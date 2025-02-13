import { Router } from 'express';
import * as displayController from './displays.controller';
import {
  ensureValidToken,
  checkAccess,
  ROLES
} from '../../middleware/auth.middleware';

const router = Router();

// Public routes for display access
router.get('/public/:id', displayController.getDisplayById);
router.get('/public', displayController.getDevices); // New public route for getting all displays

// Protected admin routes
router.get(
  '/',
  ensureValidToken,
  checkAccess(ROLES.ADMIN),
  displayController.getDevices
);

router.post(
  '/',
  ensureValidToken,
  checkAccess(ROLES.ADMIN),
  displayController.addDevice
);

router.put(
  '/:id',
  ensureValidToken,
  checkAccess(ROLES.ADMIN),
  displayController.updateDevice
);

router.delete(
  '/:id',
  ensureValidToken,
  checkAccess(ROLES.ADMIN),
  displayController.deleteDevice
);

router.get(
  '/store/:storeId',
  checkAccess(ROLES.ADMIN),
  displayController.getStoreDevices
);

export default router;
