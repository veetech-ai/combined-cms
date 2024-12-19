// API Response Types
export interface ApiResponse<T> {
	data: T;
	meta?: {
		total?: number;
		page?: number;
		limit?: number;
	};
}

export interface ErrorResponse {
	error: {
		code: string;
		message: string;
		details?: Record<string, any>;
	};
}

// Authentication
export interface LoginRequest {
	email: string;
	password: string;
}

export interface LoginResponse {
	token: string;
	user: User;
	expiresIn: number; // duration in seconds
}

export interface AuthToken {
	token: string;
	expiresAt: number; // timestamp in milliseconds
}

export interface PaginationParams {
	limit?: number;
	offset?: number;
}

export interface User {
	id: string;
	email: string;
	name: string;
	role: 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'USER';
	organizationId: string;
	storeId: string;
}
