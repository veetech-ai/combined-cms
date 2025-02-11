/*
  Warnings:

  - Added the required column `updated_at` to the `Devices` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DeviceStatus" AS ENUM ('ONLINE', 'OFFLINE');

-- AlterTable
ALTER TABLE "Devices" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "hexCode" TEXT,
ADD COLUMN     "lastSeen" TIMESTAMP(3),
ADD COLUMN     "status" "DeviceStatus" NOT NULL DEFAULT 'OFFLINE',
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
