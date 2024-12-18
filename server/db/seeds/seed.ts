import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import cliProgress from "cli-progress";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function seedOrganizations(count: number) {
  const organizations = Array.from({ length: count }).map(() => ({
    name: faker.company.name(),
    logo: faker.image.urlLoremFlickr(),
    website: faker.internet.url(),
  }));

  const result = await prisma.organization.createMany({ data: organizations });
  return result;
}

async function seedStores(organizationIds: string[], count: number) {
  const stores = Array.from({ length: count }).map(() => ({
    organizationId: faker.helpers.arrayElement(organizationIds),
    name: faker.company.name(),
    location: faker.location.city(),
  }));

  const result = await prisma.store.createMany({ data: stores });
  return result;
}

async function seedUsers(
  organizationIds: string[],
  storeIds: string[],
  count: number
) {
  const hashedPassword = await bcrypt.hash("123456789", SALT_ROUNDS);

  const users = Array.from({ length: count }).map(() => ({
    email: faker.internet.email(),
    password: hashedPassword,
    phone: faker.phone.number(),
    address: faker.location.streetAddress(),
    name: faker.person.fullName(),
    role: faker.helpers.arrayElement(["USER", "MANAGER", "ADMIN"]),
    organizationId: faker.helpers.arrayElement(organizationIds),
    storeId: faker.helpers.arrayElement(storeIds),
  }));

  const result = await prisma.user.createMany({ data: users });
  return result;
}

async function seedAisles(storeIds: string[], count: number) {
  const aisles = Array.from({ length: count }).map((_, index) => ({
    storeId: faker.helpers.arrayElement(storeIds),
    number: index + 1,
    name: `Aisle ${index + 1}`,
    category: faker.commerce.department(),
  }));

  const result = await prisma.aisle.createMany({ data: aisles });
  return result;
}

async function seedCatalogs(storeIds: string[], count: number) {
  const data = Array.from({ length: count }).map((_, index) => ({
    storeId: faker.helpers.arrayElement(storeIds),
    name: `Catalog ${index + 1}`,
    filePath: faker.internet.url(),
  }));

  const result = await prisma.catalog.createMany({ data });
  return result;
}

async function seedProducts(
  storeIds: string[],
  aisleIds: string[],
  count: number
) {
  const products = Array.from({ length: count }).map(() => ({
    storeId: faker.helpers.arrayElement(storeIds),
    aisleId: faker.helpers.arrayElement(aisleIds),
    name: faker.commerce.productName(),
    category: faker.commerce.department(),
  }));

  const result = await prisma.product.createMany({ data: products });
  return result;
}

async function seedSearchEvents(
  storeIds: string[],
  productIds: string[],
  aisleIds: string[],
  count: number
) {
  const searchEvents = Array.from({ length: count }).map(() => ({
    searchTerm: faker.commerce.productAdjective(),
    matched: faker.datatype.boolean(),
    time: faker.date.recent(),
    storeId: faker.helpers.arrayElement(storeIds),
    productId: faker.helpers.arrayElement(productIds),
    aisleId: faker.helpers.arrayElement(aisleIds),
    sessionId: faker.string.uuid(),
    userAgent: faker.internet.userAgent(),
  }));

  const result = await prisma.searchEvent.createMany({ data: searchEvents });
  return result;
}

async function main() {
  const multibar = new cliProgress.MultiBar({
    clearOnComplete: false,
    hideCursor: true,
    format: "[{bar}] {percentage}% | {value}/{total} | {task}",
  });

  const overallBar = multibar.create(7, 0, { task: "Seed Progress" });

  try {
    // Seed Organizations
    await seedOrganizations(3);
    const organizations = await prisma.organization.findMany();
    const organizationIds = organizations.map((org) => org.id);
    overallBar.increment();

    // Seed Stores
    await seedStores(organizationIds, 8);
    const stores = await prisma.store.findMany();
    const storeIds = stores.map((store) => store.id);
    overallBar.increment();

    // Seed Users
    await seedUsers(organizationIds, storeIds, 10);
    overallBar.increment();

    // Seed Aisles
    await seedAisles(storeIds, 50);
    const aisles = await prisma.aisle.findMany();
    const aisleIds = aisles.map((aisle) => aisle.id);
    overallBar.increment();

    // Seed Catalogs
    await seedCatalogs(storeIds, 25);
    overallBar.increment();

    // Seed Products
    await seedProducts(storeIds, aisleIds, 30000);
    const products = await prisma.product.findMany();
    const productIds = products.map((product) => product.id);
    overallBar.increment();

    // Seed Search Events
    await seedSearchEvents(storeIds, productIds, aisleIds, 150000);
    overallBar.increment();

    multibar.stop();
  } catch (e) {
    console.error(e);
    multibar.stop();
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
