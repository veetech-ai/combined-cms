import { Router } from 'express';
import * as displayController from './displays.controller';
import { checkAccess, ROLES } from '../../middleware/auth.middleware';

const router = Router();

router.get(
  '/displays',
  checkAccess(ROLES.ADMIN),
  displayController.getDisplays
);

router.post(
  '/displays',
  checkAccess(ROLES.ADMIN),
  displayController.addDisplay
);

router.put(
  '/displays/:id',
  checkAccess(ROLES.ADMIN),
  displayController.updateDisplay
);

router.delete(
  '/displays/:id',
  checkAccess(ROLES.ADMIN),
  displayController.deleteDisplay
);

export default router; 