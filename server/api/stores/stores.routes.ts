import { Router } from 'express';
import * as storeController from './stores.controller';
import {
  belongsToOrganization,
  belongsToOrganizationOfStore,
  belongsToStore,
  checkAccess,
  ROLES
} from '../../middleware/auth.middleware';

const router = Router();

router.get('/stores/all', checkAccess(ROLES.ADMIN), storeController.getStores);

router.get('/stores', checkAccess(ROLES.ADMIN), storeController.getStoresByUser);

/**
 * @swagger
 * /api/v1/stores:
 *   post:
 *     summary: Create a new store
 *     tags: [Stores]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - organizationId
 *               - name
 *               - address
 *               - city
 *               - state
 *               - zipCode
 *               - phone
 *             properties:
 *               organizationId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the organization the store belongs to
 *               name:
 *                 type: string
 *                 maxLength: 255
 *                 description: Name of the store
 *               address:
 *                 type: string
 *                 maxLength: 255
 *                 description: Street address of the store
 *               city:
 *                 type: string
 *                 maxLength: 255
 *                 description: City where the store is located
 *               state:
 *                 type: string
 *                 maxLength: 255
 *                 description: State where the store is located
 *               zipCode:
 *                 type: string
 *                 maxLength: 255
 *                 description: Zip code of the store
 *               phone:
 *                 type: string
 *                 maxLength: 255
 *                 description: Contact phone number of the store
 *               location:
 *                 type: string
 *                 maxLength: 255
 *                 nullable: true
 *                 description: Geographical location of the store
 *               modules:
 *                 type: object
 *                 default: []
 *                 description: JSON object containing store modules
 *               operatingHours:
 *                 type: object
 *                 default: {}
 *                 description: JSON object containing store operating hours
 *     responses:
 *       201:
 *         description: Store created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   description: Unique ID of the created store
 *                 organizationId:
 *                   type: string
 *                   format: uuid
 *                   description: ID of the organization the store belongs to
 *                 name:
 *                   type: string
 *                   description: Name of the store
 *                 address:
 *                   type: string
 *                   description: Address of the store
 *                 city:
 *                   type: string
 *                   description: City where the store is located
 *                 state:
 *                   type: string
 *                   description: State where the store is located
 *                 zipCode:
 *                   type: string
 *                   description: Zip code of the store
 *                 phone:
 *                   type: string
 *                   description: Contact phone number of the store
 *                 location:
 *                   type: string
 *                   nullable: true
 *                   description: Geographical location of the store
 *                 modules:
 *                   type: object
 *                   description: JSON object containing store modules
 *                 operatingHours:
 *                   type: object
 *                   description: JSON object containing store operating hours
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp of when the store was created
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp of when the store was last updated
 *       400:
 *         description: Bad request, missing required fields
 *       401:
 *         description: Unauthorized, user is not an admin
 *       500:
 *         description: Internal server error
 */


router.post(
  '/stores',
  checkAccess(ROLES.ADMIN),
  //belongsToOrganization,
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
