/*
  Warnings:

  - You are about to drop the `Devices` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Devices" DROP CONSTRAINT "Devices_screen_specs_id_fkey";

-- DropForeignKey
ALTER TABLE "Devices" DROP CONSTRAINT "Devices_store_module_id_fkey";

-- DropTable
DROP TABLE "Devices";

-- CreateTable
CREATE TABLE "devices" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "store_module_id" UUID NOT NULL,
    "screen_specs_id" UUID,
    "hexCode" TEXT,
    "status" "DeviceStatus" NOT NULL DEFAULT 'OFFLINE',
    "lastSeen" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_store_module_id_fkey" FOREIGN KEY ("store_module_id") REFERENCES "store_modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_screen_specs_id_fkey" FOREIGN KEY ("screen_specs_id") REFERENCES "ScreenSpecs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
