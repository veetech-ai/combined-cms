import { PrismaClient } from "@prisma/client";
import { faker } from '@faker-js/faker';
import cliProgress from "cli-progress";
import { encryptPassword } from '../../util/password';

const prisma = new PrismaClient();
const USER_PASSORD_DEV = '123456';

async function seedOrganizations(count: number) {
	const organizations = Array.from({ length: count }).map(() => ({
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

	const result = await prisma.organization.createMany({
		data: organizations,
	});
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
	const hashedPassword = await encryptPassword(USER_PASSORD_DEV);

	const users = Array.from({ length: count }).map(() => ({
		email: faker.internet.email(),
		password: hashedPassword,
		phone: faker.phone.number(),
		address: faker.location.streetAddress(),
		name: faker.person.fullName(),
		role: faker.helpers.arrayElement(['USER', 'MANAGER', 'ADMIN']),
		organizationId: faker.helpers.arrayElement(organizationIds),
		storeId: faker.helpers.arrayElement(storeIds),
	}));

	const result = await prisma.user.createMany({ data: users });
	return result;
}

async function main() {
	const multibar = new cliProgress.MultiBar({
		clearOnComplete: false,
		hideCursor: true,
		format: '[{bar}] {percentage}% | {value}/{total} | {task}',
	});

	const overallBar = multibar.create(3, 0, { task: 'Seed Progress' });

	try {
		// Seed Organizations
		await seedOrganizations(3);
		const organizations = await prisma.organization.findMany();
		const organizationIds = organizations.map(org => org.id);
		overallBar.increment();

		// Seed Stores
		await seedStores(organizationIds, 8);
		const stores = await prisma.store.findMany();
		const storeIds = stores.map(store => store.id);
		overallBar.increment();

		// Seed Users
		await seedUsers(organizationIds, storeIds, 10);
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
