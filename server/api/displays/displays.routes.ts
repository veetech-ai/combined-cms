import { Router } from 'express';
import * as displayController from './displays.controller';
import { checkAccess, ROLES } from '../../middleware/auth.middleware';

const router = Router();

// Public routes (no auth required)
router.get('/', displayController.getDisplays);
router.get('/:id', displayController.getDisplay);

// Protected routes (require admin access)
router.post('/', checkAccess(ROLES.ADMIN), displayController.addDisplay);

router.put('/:id', checkAccess(ROLES.ADMIN), displayController.updateDisplay);

router.delete(
  '/:id',
  checkAccess(ROLES.ADMIN),
  displayController.deleteDisplay
);

export default router;
