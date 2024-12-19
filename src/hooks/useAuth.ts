import { useEffect } from 'react';
import { useAuthStore } from '../stores/auth-store';

export const useAuth = () => {
	const { checkAuth, ...authState } = useAuthStore();

	useEffect(() => {
		// Check auth status when hook is mounted
		checkAuth();

		// Set up interval to periodically check token expiration
		const interval = setInterval(() => {
			checkAuth();
		}, 60000 * 5); // Check every 5 minute

		return () => clearInterval(interval);
	}, []);

	return authState;
};
