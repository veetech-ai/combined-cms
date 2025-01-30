import { PrismaClient, UserRole, UserStatus } from "@prisma/client";
import { encryptPassword } from '../../util/password';

const prisma = new PrismaClient();
const USER_PASSORD_DEV = '123456';

const DEFAULT_MODULES = [
	{ name: 'Venu (Digital Menu)', key: 'venu' },
	{ name: 'Kiosk System', key: 'kiosk' },
	{ name: 'Kitchen Display', key: 'kitchen' },
	{ name: 'Rewards Program', key: 'rewards' }
];

const ADMIN_USERS = [
	{
		name: 'Shariq',
		email: 'shariq@gmail.com',
		phone: '+92 300 1234567',
		address: 'House #123, Street 4, Islamabad',
		role: UserRole.ADMIN,
		status: UserStatus.ACTIVE
	},
	{
		name: 'Danish',
		email: 'danish@gmail.com',
		phone: '+92 300 2345678',
		address: 'House #456, Street 7, Lahore',
		role: UserRole.ADMIN,
		status: UserStatus.ACTIVE
	},
	{
		name: 'Hafiz',
		email: 'hafiz@gmail.com',
		phone: '+92 300 3456789',
		address: 'House #789, Street 10, Karachi',
		role: UserRole.ADMIN,
		status: UserStatus.ACTIVE
	}
];

async function seedModules() {
	console.log('Seeding modules...');
	for (const moduleData of DEFAULT_MODULES) {
		await prisma.module.upsert({
			where: { key: moduleData.key },
			update: moduleData,
			create: moduleData
		});
	}
	console.log('Modules seeded successfully');
}

async function seedUsers() {
	console.log('Seeding users...');
	const hashedPassword = await encryptPassword(USER_PASSORD_DEV);

	for (const userData of ADMIN_USERS) {
		const { role, status, ...rest } = userData;
		await prisma.user.upsert({
			where: { email: userData.email },
			update: {
				...rest,
				password: hashedPassword,
				role,
				status
			},
			create: {
				...rest,
		password: hashedPassword,
				role,
				status
			}
		});
	}
	console.log('Users seeded successfully');
}

async function main() {
	try {
		await seedModules();
		await seedUsers();
		console.log('Seed completed successfully');
	} catch (e) {
		console.error('\nError during seeding:', e);
		process.exit(1);
	} finally {
		await prisma.$disconnect();
	}
}

main();
