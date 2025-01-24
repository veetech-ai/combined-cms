-- Create Display Table
CREATE TABLE IF NOT EXISTS "Display" (
    "id" SERIAL PRIMARY KEY,
    "uuid" VARCHAR UNIQUE NOT NULL,
    "name" VARCHAR NOT NULL,
    "hexCode" VARCHAR UNIQUE NOT NULL,
    "status" VARCHAR DEFAULT 'offline',
    "lastSeen" TIMESTAMP DEFAULT now(),
    "storeId" UUID NOT NULL,
    "moduleId" UUID NOT NULL,
    "createdAt" TIMESTAMP DEFAULT now(),
    "updatedAt" TIMESTAMP DEFAULT now(),
    FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE,
    FOREIGN KEY ("moduleId") REFERENCES "modules"("id") ON DELETE CASCADE
);

-- Create Indexes
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_display_storeId') THEN
        CREATE INDEX "idx_display_storeId" ON "Display"("storeId");
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_display_moduleId') THEN
        CREATE INDEX "idx_display_moduleId" ON "Display"("moduleId");
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_display_hexCode') THEN
        CREATE INDEX "idx_display_hexCode" ON "Display"("hexCode");
    END IF;
END $$;
