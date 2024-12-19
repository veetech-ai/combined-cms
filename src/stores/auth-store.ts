import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '../types/api';
import { authService } from '../services/authService';

interface AuthState {
	user: User | null;
	token: string | null;
	expiresAt: number | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
	login: (
		email: string,
		password: string,
		rememberMe: boolean
	) => Promise<void>;
	logout: () => void;
	checkAuth: () => boolean;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			user: null,
			token: null,
			expiresAt: null,
			isAuthenticated: false,
			isLoading: false,
			error: null,

			checkAuth: () => {
				const state = get();
				if (!state.token || !state.expiresAt) return false;

				const isValid = state.expiresAt > Date.now();

				if (!isValid) {
					get().logout();
					return false;
				}

				return true;
			},

			login: async (
				email: string,
				password: string,
				rememberMe: boolean
			) => {
				set({ isLoading: true, error: null });

				try {
					const response = await authService.login(
						email,
						password,
						rememberMe
					);
					const expiresAt = Date.now() + response.expiresIn * 1000;

					set({
						user: response.user,
						token: response.token,
						expiresAt,
						isAuthenticated: true,
						isLoading: false,
					});
				} catch (err) {
					set({
						error:
							err instanceof Error
								? err.message
								: 'Invalid credentials',
						isLoading: false,
					});
					throw err;
				}
			},

			logout: () => {
				set({
					user: null,
					token: null,
					expiresAt: null,
					isAuthenticated: false,
					error: null,
				});
			},
		}),
		{
			name: 'auth-storage',
			storage: createJSONStorage(() => localStorage),
			partialize: state => ({
				user: state.user,
				token: state.token,
				expiresAt: state.expiresAt,
			}),
		}
	)
);
