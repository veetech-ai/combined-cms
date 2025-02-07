import { Router } from 'express';
import { Swagger } from 'swagger-jsdoc'; // Assuming swagger-jsdoc is used for Swagger documentation

/**
 * @swagger
 * tags:
 *   name: Organizations
 *   description: API for managing organizations
 */

/**
 * @swagger
 * /organizations:
 *   get:
 *     summary: Retrieve organizations by user
 *     tags: [Organizations]
 *     responses:
 *       200:
 *         description: A list of organizations
 */
import * as orgController from './organizations.controller';
import {
  belongsToOrganization,
  checkAccess,
  ensureValidToken,
  ROLES
} from '../../middleware/auth.middleware';

const router = Router();

router.get(
  '/organizations/all',
  checkAccess(ROLES.USER),
  orgController.getOrganizations
);

router.get(
  '/organizations',
  checkAccess(ROLES.USER),
  orgController.getOrganizationsByUser
);

/**
 * @swagger
 * /organizations/{id}:
 *   get:
 *     summary: Retrieve a specific organization by ID
 *     tags: [Organizations]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the organization
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The organization details
 */
router.get(
  '/organizations/:id',
  checkAccess(ROLES.ADMIN),
  // belongsToOrganization,
  orgController.getOrganizationById
);

/**
 * @swagger
 * /api/v1/organizations:
 *   post:
 *     summary: Create a new organization
 *     tags: [Organizations]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - company
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 255
 *                 description: Name of the organization
 *               email:
 *                 type: string
 *                 format: email
 *                 maxLength: 255
 *                 description: Unique email address of the organization
 *               company:
 *                 type: string
 *                 maxLength: 255
 *                 description: Name of the company
 *               phone:
 *                 type: string
 *                 maxLength: 255
 *                 nullable: true
 *                 description: Contact phone number of the organization
 *               logo:
 *                 type: string
 *                 maxLength: 255
 *                 nullable: true
 *                 description: URL of the organization logo
 *               website:
 *                 type: string
 *                 maxLength: 255
 *                 nullable: true
 *                 description: Website URL of the organization
 *               billingStreet:
 *                 type: string
 *                 maxLength: 255
 *                 nullable: true
 *                 description: Billing street address
 *               billingCity:
 *                 type: string
 *                 maxLength: 255
 *                 nullable: true
 *                 description: Billing city
 *               billingState:
 *                 type: string
 *                 maxLength: 255
 *                 nullable: true
 *                 description: Billing state
 *               billingZip:
 *                 type: string
 *                 maxLength: 255
 *                 nullable: true
 *                 description: Billing zip code
 *               billingCountry:
 *                 type: string
 *                 maxLength: 255
 *                 nullable: true
 *                 description: Billing country
 *               contactName:
 *                 type: string
 *                 maxLength: 255
 *                 nullable: true
 *                 description: Name of the primary contact person
 *               contactEmail:
 *                 type: string
 *                 format: email
 *                 maxLength: 255
 *                 nullable: true
 *                 description: Email of the primary contact person
 *               contactPhone:
 *                 type: string
 *                 maxLength: 255
 *                 nullable: true
 *                 description: Phone number of the primary contact person
 *               contactRole:
 *                 type: string
 *                 maxLength: 255
 *                 nullable: true
 *                 description: Role of the primary contact person
 *               subscriptionPlan:
 *                 type: string
 *                 enum: [BASIC, PREMIUM, ENTERPRISE]
 *                 default: BASIC
 *                 description: Subscription plan of the organization
 *               subscriptionStatus:
 *                 type: string
 *                 enum: [PENDING, ACTIVE, SUSPENDED, CANCELLED]
 *                 default: PENDING
 *                 description: Status of the organization's subscription
 *               subscriptionStart:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *                 description: Subscription start date
 *               subscriptionRenewal:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *                 description: Subscription renewal date
 *               posType:
 *                 type: string
 *                 enum: [NONE, BASIC, ADVANCED]
 *                 default: NONE
 *                 description: POS integration type
 *               posProvider:
 *                 type: string
 *                 maxLength: 255
 *                 nullable: true
 *                 description: POS provider name
 *               posConfig:
 *                 type: object
 *                 nullable: true
 *                 description: POS configuration in JSON format
 *     responses:
 *       201:
 *         description: Organization created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   description: Unique ID of the created organization
 *                 name:
 *                   type: string
 *                   description: Name of the organization
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: Email address of the organization
 *                 company:
 *                   type: string
 *                   description: Company name
 *                 phone:
 *                   type: string
 *                   nullable: true
 *                   description: Contact phone number
 *                 logo:
 *                   type: string
 *                   nullable: true
 *                   description: URL of the organization logo
 *                 website:
 *                   type: string
 *                   nullable: true
 *                   description: Website URL
 *                 billingStreet:
 *                   type: string
 *                   nullable: true
 *                   description: Billing street address
 *                 billingCity:
 *                   type: string
 *                   nullable: true
 *                   description: Billing city
 *                 billingState:
 *                   type: string
 *                   nullable: true
 *                   description: Billing state
 *                 billingZip:
 *                   type: string
 *                   nullable: true
 *                   description: Billing zip code
 *                 billingCountry:
 *                   type: string
 *                   nullable: true
 *                   description: Billing country
 *                 contactName:
 *                   type: string
 *                   nullable: true
 *                   description: Primary contact person's name
 *                 contactEmail:
 *                   type: string
 *                   nullable: true
 *                   format: email
 *                   description: Contact person's email
 *                 contactPhone:
 *                   type: string
 *                   nullable: true
 *                   description: Contact person's phone number
 *                 contactRole:
 *                   type: string
 *                   nullable: true
 *                   description: Contact person's role
 *                 subscriptionPlan:
 *                   type: string
 *                   enum: [BASIC, PREMIUM, ENTERPRISE]
 *                   description: Subscription plan
 *                 subscriptionStatus:
 *                   type: string
 *                   enum: [PENDING, ACTIVE, SUSPENDED, CANCELLED]
 *                   description: Subscription status
 *                 subscriptionStart:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                   description: Subscription start date
 *                 subscriptionRenewal:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                   description: Subscription renewal date
 *                 posType:
 *                   type: string
 *                   enum: [NONE, BASIC, ADVANCED]
 *                   description: POS type
 *                 posProvider:
 *                   type: string
 *                   nullable: true
 *                   description: POS provider
 *                 posConfig:
 *                   type: object
 *                   nullable: true
 *                   description: POS configuration
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp of when the organization was created
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp of when the organization was last updated
 *       400:
 *         description: Bad request, missing required fields
 *       401:
 *         description: Unauthorized, user is not an admin
 *       500:
 *         description: Internal server error
 */

router.post(
  '/organizations',
  checkAccess(ROLES.ADMIN), // changed ADMIN to SUPER_ADMIN for test
  orgController.createOrganization
);

/**
 * @swagger
 * /organizations/{id}:
 *   put:
 *     summary: Update an existing organization
 *     tags: [Organizations]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the organization
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated organization
 */
router.put(
  '/organizations/:id',
  checkAccess(ROLES.ADMIN),
  belongsToOrganization,
  orgController.updateOrganization
);

/**
 * @swagger
 * /organizations/{id}:
 *   delete:
 *     summary: Delete an organization
 *     tags: [Organizations]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the organization
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Organization deleted
 */
router.delete(
  '/organizations/:id',
  checkAccess(ROLES.SUPER_ADMIN),
  orgController.deleteOrganization
);

export default router;
