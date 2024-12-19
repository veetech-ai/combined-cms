import { authClient } from "./apiClient";
import { API_CONFIG } from "../config/api";
import type { User, LoginResponse } from "../types";

export const authService = {
  async login(email: string, password: string, rememberMe: boolean = false) {
    const { data } = await authClient.post<LoginResponse>(
      API_CONFIG.ENDPOINTS.LOGIN,
      { email, password, rememberMe }
    );

    // Store access token
    localStorage.setItem("access_token", data.accessToken);
    localStorage.setItem("logged_in_user", JSON.stringify(data.user));

    return data;
  },

  async logout() {
    try {
      await authClient.post(API_CONFIG.ENDPOINTS.LOGOUT);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("logged_in_user");
    }
  },

  async refreshToken() {
    const { data } = await authClient.post<{ accessToken: string }>(
      API_CONFIG.ENDPOINTS.REFRESH_TOKEN
    );
    localStorage.setItem("access_token", data.accessToken);
    return data.accessToken;
  },

  setToken(token: string) {
    localStorage.setItem("access_token", token);
  },

  getToken() {
    return localStorage.getItem("access_token");
  },

  getLoggedInUser() {
    const userString = localStorage.getItem("logged_in_user");
    return userString ? JSON.parse(userString) : null;
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};
