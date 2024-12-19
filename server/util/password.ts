import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export const encryptPassword = (password: string) =>
	bcrypt.hash(password, SALT_ROUNDS);

export const checkPassword = (password: string, passwordHash: string) =>
	bcrypt.compare(password, passwordHash);
