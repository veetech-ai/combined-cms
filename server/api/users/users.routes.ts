import { Router } from 'express';
import * as userController from './users.controller';
import {
  belongsToOrganization,
  checkAccess,
  ROLES,
  ensureValidToken
} from '../../middleware/auth.middleware';

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users
 */

const router = Router();

router.get('/users', checkAccess(ROLES.ADMIN), userController.getUsers);

/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 maxLength: 255
 *                 description: Unique email address of the user
 *               password:
 *                 type: string
 *                 format: password
 *                 maxLength: 255
 *                 description: Password for user authentication
 *               phone:
 *                 type: string
 *                 maxLength: 255
 *                 nullable: true
 *                 description: Contact phone number of the user
 *               address:
 *                 type: string
 *                 maxLength: 255
 *                 nullable: true
 *                 description: Address of the user
 *               name:
 *                 type: string
 *                 maxLength: 255
 *                 description: Full name of the user
 *               role:
 *                 type: string
 *                 enum: [USER, ADMIN, MANAGER]
 *                 default: USER
 *                 description: Role assigned to the user
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE, SUSPENDED]
 *                 default: ACTIVE
 *                 description: Status of the user account
 *               organizationId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 description: ID of the organization the user belongs to
 *               storeId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 description: ID of the store the user belongs to
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   description: Unique ID of the created user
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: Email address of the user
 *                 phone:
 *                   type: string
 *                   nullable: true
 *                   description: Contact phone number
 *                 address:
 *                   type: string
 *                   nullable: true
 *                   description: User's address
 *                 name:
 *                   type: string
 *                   description: Full name of the user
 *                 role:
 *                   type: string
 *                   enum: [USER, ADMIN, MANAGER]
 *                   description: Role assigned to the user
 *                 status:
 *                   type: string
 *                   enum: [ACTIVE, INACTIVE, SUSPENDED]
 *                   description: Account status
 *                 organizationId:
 *                   type: string
 *                   format: uuid
 *                   nullable: true
 *                   description: Organization ID the user belongs to
 *                 storeId:
 *                   type: string
 *                   format: uuid
 *                   nullable: true
 *                   description: Store ID the user belongs to
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp of when the user was created
 *       400:
 *         description: Bad request, missing required fields
 *       401:
 *         description: Unauthorized, user is not an admin
 *       500:
 *         description: Internal server error
 */


router.post(
  '/users',
  ensureValidToken,  // Add this middleware first
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
