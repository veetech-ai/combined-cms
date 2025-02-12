import apiClient from './apiClient';
import { API_CONFIG } from '../config/api';
import { Module } from '../types';

export type DisplayStatus = 'ONLINE' | 'OFFLINE';

export interface Display {
  id: string;
  name: string;
  location: string;
  store: string;
  organization: string;
  status: DisplayStatus;
  lastSeen: string;
  hexCode: string;
  storeModuleId: string;
}

export const displayService = {
  async getDisplays() {
    const { data } = await apiClient.get<Display[]>(
      `${API_CONFIG.ENDPOINTS.DISPLAYS}`
    );
    return data;
  },

  async addDisplay(display: Display) {
    const { data } = await apiClient.post<Display>(
      `${API_CONFIG.ENDPOINTS.DISPLAYS}`,
      display
    );
    return data;
  },

  async updateDisplay(id: string, updateData: Partial<Display>) {
    const { data } = await apiClient.put<Display>(
      `${API_CONFIG.ENDPOINTS.DISPLAYS}/${id}`,
      updateData
    );
    return data;
  },

  async deleteDisplay(id: string) {
    await apiClient.delete(`${API_CONFIG.ENDPOINTS.DISPLAYS}/${id}`);
  },

  async getStoreModules(storeId: string) {
    const { data } = await apiClient.get<Module[]>(
      `${API_CONFIG.ENDPOINTS.STORE_MODULES}/${storeId}`
    );
    console.log({ data });
    return data;
  }
};
