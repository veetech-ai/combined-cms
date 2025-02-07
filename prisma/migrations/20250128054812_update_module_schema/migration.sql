/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `modules` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[store_id,module_id]` on the table `store_modules` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `key` to the `modules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `modules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `store_modules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "modules" ADD COLUMN     "key" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "store_modules" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "stats" JSONB,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "modules_key_key" ON "modules"("key");

-- CreateIndex
CREATE UNIQUE INDEX "store_modules_store_id_module_id_key" ON "store_modules"("store_id", "module_id");
