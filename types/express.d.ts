import { ROLES } from "../server/middleware/auth.middleware";

declare namespace Express {
	export interface Request {
		user?: {
			role: keyof typeof ROLES;
			organizationId?: string;
			storeId?: string;
		};
	}
}
