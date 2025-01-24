import apiClient from './apiClient';
import { Display } from '../types/display';

export const displayService = {
  async getDisplays(params?: { storeId?: string; moduleId?: string }) {
    const { data } = await apiClient.get<Display[]>('/api/displays', { params });
    return data;
  },

  async createDisplay(displayData: {
    name: string;
    hexCode: string;
    storeId: string;
    moduleId: string;
  }) {
    const { data } = await apiClient.post<Display>('/api/displays', displayData);
    return data;
  },

  async updateDisplay(id: string, displayData: {
    name?: string;
    hexCode?: string;
    status?: string;
  }) {
    const { data } = await apiClient.put<Display>(`/api/displays/${id}`, displayData);
    return data;
  },

  async deleteDisplay(id: string) {
    await apiClient.delete(`/api/displays/${id}`);
  }
}; 