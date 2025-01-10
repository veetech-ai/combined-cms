-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('BASIC', 'PREMIUM', 'ENTERPRISE');
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'PENDING', 'CANCELLED');
CREATE TYPE "PosIntegrationType" AS ENUM ('NONE', 'SQUARE', 'CLOVER', 'STRIPE', 'CUSTOM');

-- AlterTable
ALTER TABLE "organizations" 
ADD COLUMN "email" VARCHAR(255) UNIQUE,
ADD COLUMN "company" VARCHAR(255),
ADD COLUMN "phone" VARCHAR(255),
ADD COLUMN "billing_street" VARCHAR(255),
ADD COLUMN "billing_city" VARCHAR(255),
ADD COLUMN "billing_state" VARCHAR(255),
ADD COLUMN "billing_zip" VARCHAR(255),
ADD COLUMN "billing_country" VARCHAR(255),
ADD COLUMN "contact_name" VARCHAR(255),
ADD COLUMN "contact_email" VARCHAR(255),
ADD COLUMN "contact_phone" VARCHAR(255),
ADD COLUMN "contact_role" VARCHAR(255),
ADD COLUMN "subscription_plan" "SubscriptionPlan" NOT NULL DEFAULT 'BASIC',
ADD COLUMN "subscription_status" "SubscriptionStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN "subscription_start" TIMESTAMP(3),
ADD COLUMN "subscription_renewal" TIMESTAMP(3),
ADD COLUMN "pos_type" "PosIntegrationType" NOT NULL DEFAULT 'NONE',
ADD COLUMN "pos_provider" VARCHAR(255),
ADD COLUMN "pos_config" JSONB,
ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP; 