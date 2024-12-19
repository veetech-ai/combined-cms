import { ROLES } from '../server/middleware/auth';

declare namespace Express {
	export interface Request {
		user?: {
			role: keyof typeof ROLES;
			organizationId?: string;
			storeId?: string;
		};
	}
}
