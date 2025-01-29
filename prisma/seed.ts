import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEFAULT_MODULES = [
  { name: 'Venu (Digital Menu)', key: 'venu' },
  { name: 'Kiosk System', key: 'kiosk' },
  { name: 'Kitchen Display', key: 'kitchen' },
  { name: 'Rewards Program', key: 'rewards' }
];

async function main() {
  // Create default modules
  for (const moduleData of DEFAULT_MODULES) {
    await prisma.module.upsert({
      where: { key: moduleData.key },
      update: moduleData,
      create: moduleData
    });
  }

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error('Error in seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 