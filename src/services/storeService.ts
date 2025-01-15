import apiClient from './apiClient';
import { API_CONFIG } from '../config/api';
import type { Store } from '../types/store';

export const storeService = {
  async getStores() {
    const { data } = await apiClient.get<Store[]>(API_CONFIG.ENDPOINTS.STORES);
    return data;
  },

  async getStoreById(id: string) {
    const { data } = await apiClient.get<Store>(
      API_CONFIG.ENDPOINTS.STORE_BY_ID(id)
    );
    return data;
  },

  async getStoresByOrganizationId(organizationId: string) {
    const { data } = await apiClient.get<Store[]>(
      API_CONFIG.ENDPOINTS.STORES_BY_ORGANIZATION_ID(organizationId)
    );
    return data;
  },

  async createStore(storeData: Omit<Store, 'id'>, organizationId: string) {
    const url = API_CONFIG.ENDPOINTS.STORES;
    console.log(organizationId)
    try {
      const { data } = await apiClient.post<Store>(url, {
        ...storeData,
        organizationId
      });

      return data;
    } catch (error) {
      console.error('Error creating store:', error);
      throw error;
    }
  }
};
