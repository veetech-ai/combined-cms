-- CreateTable
CREATE TABLE "Display" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hexCode" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'offline',
    "lastSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "storeId" UUID NOT NULL,
    "moduleId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Display_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Display_uuid_key" ON "Display"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Display_hexCode_key" ON "Display"("hexCode");

-- CreateIndex
CREATE INDEX "idx_display_storeId" ON "Display"("storeId");

-- CreateIndex
CREATE INDEX "idx_display_moduleId" ON "Display"("moduleId");

-- CreateIndex
CREATE INDEX "idx_display_hexCode" ON "Display"("hexCode");

-- AddForeignKey
ALTER TABLE "Display" ADD CONSTRAINT "Display_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Display" ADD CONSTRAINT "Display_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
