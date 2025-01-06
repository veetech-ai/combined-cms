import { Router } from 'express';
import * as userController from './users.controller';
import {
  belongsToOrganization,
  checkAccess,
  ROLES
} from '../../middleware/auth.middleware';

const router = Router();

router.get('/users', checkAccess(ROLES.ADMIN), userController.getUsers);

router.post(
  '/users',
  checkAccess(ROLES.ADMIN),
  belongsToOrganization,
  userController.createUser
);

router.put(
  '/users/:id',
  checkAccess(ROLES.ADMIN),
  belongsToOrganization,
  userController.updateUser
);

router.delete(
  '/users/:id',
  checkAccess(ROLES.ADMIN),
  userController.deleteUser
);

export default router;
