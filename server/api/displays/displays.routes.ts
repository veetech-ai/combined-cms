import { Router } from 'express';
import * as displayController from './displays.controller';
import {
  ensureValidToken,
  checkAccess,
  ROLES
} from '../../middleware/auth.middleware';

const router = Router();

// Public routes (no auth required)
router.get('/', displayController.getDisplays);
router.get('/:id', displayController.getDisplay);

// Protected routes (require auth and admin access)
router.post(
  '/',
  ensureValidToken,
  checkAccess(ROLES.ADMIN),
  displayController.addDisplay
);

router.put(
  '/:id',
  ensureValidToken,
  checkAccess(ROLES.ADMIN),
  displayController.updateDisplay
);

router.delete(
  '/:id',
  ensureValidToken,
  checkAccess(ROLES.ADMIN),
  displayController.deleteDisplay
);

export default router;
