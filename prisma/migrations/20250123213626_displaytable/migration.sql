/*
  Warnings:

  - You are about to drop the `Display` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Display" DROP CONSTRAINT "Display_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "Display" DROP CONSTRAINT "Display_storeId_fkey";

-- DropTable
DROP TABLE "Display";
