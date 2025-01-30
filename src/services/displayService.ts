import apiClient from './apiClient';
import { API_CONFIG } from '../config/api';

export interface Display {
  id: string;
  name: string;
  location: string;
  store: string;
  organization: string;
  status: string;
  lastSeen: string;
  hexCode: string;
}

export const displayService = {
  async getDisplays() {
    const { data } = await apiClient.get<Display[]>(`${API_CONFIG.ENDPOINTS.DISPLAYS}`);
    return data;
  },

  async addDisplay(display: Display) {
    const { data } = await apiClient.post<Display>(`${API_CONFIG.ENDPOINTS.DISPLAYS}`, display);
    return data;
  },

  async updateDisplay(id: string, display: Partial<Display>) {
    const { data } = await apiClient.put<Display>(`${API_CONFIG.ENDPOINTS.DISPLAYS}/${id}`, display);
    return data;
  },

  async deleteDisplay(id: string) {
    await apiClient.delete(`${API_CONFIG.ENDPOINTS.DISPLAYS}/${id}`);
  }
}; 