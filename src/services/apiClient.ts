import axios from 'axios';
import { API_CONFIG } from '../config/api';
import { authService } from "./authService";

export const authClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  withCredentials: true,
});

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL + API_CONFIG.VERSION,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for handling refresh tokens
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling token refresh
apiClient.interceptors.response.use(
  (response) => {
    // Check for new token in response headers
    const newToken = response.headers["x-new-access-token"];
    if (newToken) {
      // Update the token in auth service
      authService.setToken(newToken);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        const newToken = await authService.refreshToken();

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        authService.logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
