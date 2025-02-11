import { Router } from 'express';
import * as displayController from './displays.controller';
import {
  ensureValidToken,
  checkAccess,
  ROLES
} from '../../middleware/auth.middleware';

const router = Router();

router.get('/displays', checkAccess(ROLES.ADMIN), displayController.getDevices);

router.post('/displays', checkAccess(ROLES.ADMIN), displayController.addDevice);

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
  '/displays/store/:storeId',
  checkAccess(ROLES.ADMIN),
  displayController.getStoreDevices
);

export default router;
