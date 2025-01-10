import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function seedOrganizations() {
  // Check if organizations already exist
  const existingOrgs = await prisma.organization.findMany();
  if (existingOrgs.length === 0) {
    const organizations = Array.from({ length: 3 }).map(() => ({
      name: faker.company.name(),
      email: faker.internet.email(),
      company: faker.company.name(),
      phone: faker.phone.number(),
      logo: faker.image.urlLoremFlickr(),
      website: faker.internet.url(),
      
      // Billing Address
      billingStreet: faker.location.street(),
      billingCity: faker.location.city(),
      billingState: faker.location.state(),
      billingZip: faker.location.zipCode(),
      billingCountry: faker.location.country(),
      
      // Primary Contact
      contactName: faker.person.fullName(),
      contactEmail: faker.internet.email(),
      contactPhone: faker.phone.number(),
      contactRole: faker.person.jobTitle(),
      
      // Subscription
      subscriptionPlan: faker.helpers.arrayElement(['BASIC', 'PREMIUM', 'ENTERPRISE']),
      subscriptionStatus: faker.helpers.arrayElement(['ACTIVE', 'PENDING', 'CANCELLED']),
      subscriptionStart: faker.date.past(),
      subscriptionRenewal: faker.date.future(),
      
      // POS Integration
      posType: faker.helpers.arrayElement(['NONE', 'SQUARE', 'CLOVER', 'STRIPE', 'CUSTOM']),
      posProvider: faker.helpers.arrayElement(['Square', 'Clover', 'Stripe', null]),
      posConfig: {
        webhookUrl: faker.internet.url(),
        apiKey: faker.string.uuid(),
        settings: {}
      }
    }));

    await prisma.organization.createMany({ data: organizations });
  }
}

async function seedStores() {
  // Check if stores already exist
  const existingStores = await prisma.store.findMany();
  if (existingStores.length === 0) {
    const organizations = await prisma.organization.findMany();
    const organizationIds = organizations.map((org) => org.id);

    const stores = Array.from({ length: 5 }).map(() => ({
      organizationId: faker.helpers.arrayElement(organizationIds),
      name: faker.company.name(),
      location: faker.location.city(),
    }));

    await prisma.store.createMany({ data: stores });
  }
}

const encryptPassword = async (password: string) =>
  bcrypt.hash(password, SALT_ROUNDS);

async function seedUsers() {
  // Check if users already exist
  const existingUsers = await prisma.user.findMany();
  if (existingUsers.length === 0) {
    const organizations = await prisma.organization.findMany();
    const stores = await prisma.store.findMany();

    const organizationIds = organizations.map((org) => org.id);
    const storeIds = stores.map((store) => store.id);

    const users = [
      // Admin user (no store ID)
      {
        email: "admin@finder.com",
        password: await encryptPassword("admin_123456"),
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        name: faker.person.fullName(),
        role: "ADMIN",
        organizationId: faker.helpers.arrayElement(organizationIds),
        storeId: null,
      },
      // Superadmin user (no store ID)
      {
        email: "super.admin@finder.com",
        password: await encryptPassword("superadmin_123456"),
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        name: faker.person.fullName(),
        role: "SUPER_ADMIN",
        organizationId: faker.helpers.arrayElement(organizationIds),
        storeId: null,
      },
      // Manager user (has both org and store IDs)
      {
        email: "manager@finder.com",
        password: await encryptPassword("manager_123456"),
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        name: faker.person.fullName(),
        role: "MANAGER",
        organizationId: faker.helpers.arrayElement(organizationIds),
        storeId: faker.helpers.arrayElement(storeIds),
      },
      {
        email: "user@finder.com",
        password: await encryptPassword("123456"),
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        name: faker.person.fullName(),
        role: "USER",
        organizationId: faker.helpers.arrayElement(organizationIds),
        storeId: faker.helpers.arrayElement(storeIds),
      },
    ];

    // Ensure no duplicate emails exist
    for (const user of users) {
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });
      if (!existingUser) {
        await prisma.user.create({ data: user });
      }
    }
  }
}

async function main() {
  try {
    // Seed Organizations, Stores, and Users
    console.log("Seeding orgs...");
    await seedOrganizations();
    console.log("Seeding stores...");
    await seedStores();
    console.log("Seeding users...");
    await seedUsers();
    console.log("Seeding done...");
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
