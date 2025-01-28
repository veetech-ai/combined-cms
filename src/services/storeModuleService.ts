import apiClient from './apiClient';
import { API_CONFIG } from '../config/api';
import type { Module } from '../types/module';

interface StoreModuleResponse {
  id: string;
  storeId: string;
  moduleId: string;
  isEnabled: boolean;
  status: string;
  stats: {
    activeDevices: number;
    activeUsers: number;
    lastUpdated: string;
  } | null;
  module: {
    id: string;
    name: string;
    key: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface StoreModuleWithDevices extends Module {
  Devices: Array<{
    id: string;
    name: string;
    description?: string;
    location?: string;
    screenSpecs: {
      id: string;
      size: string;
      resolution?: string;
      aspectRatio?: string;
    };
  }>;
}

export const storeModuleService = {
  async getStoreModules(storeId: string) {
    const { data } = await apiClient.get<Module[]>(
      `${API_CONFIG.ENDPOINTS.STORE_MODULES}/${storeId}`
    );
    return data;
  },

  async getModuleWithDevices(storeId: string, moduleId: string) {
    const { data } = await apiClient.get<StoreModuleWithDevices>(
      `${API_CONFIG.ENDPOINTS.STORE_MODULES}/${storeId}/${moduleId}`
    );
    return data;
  },

  // async updateModuleState(storeId: string, moduleId: string, isEnabled: boolean) {
  //   const { data } = await apiClient.put<StoreModuleResponse>(
  //     `${API_CONFIG.ENDPOINTS.STORE_MODULES}/${storeId}/${moduleId}`,
  //     { isEnabled }
  //   );
  //   return data;
  // },
  async updateModuleState(storeId: string, moduleId: string, isEnabled: boolean) {
    console.log(`Updating module state: storeId=${storeId}, moduleId=${moduleId}, isEnabled=${isEnabled}`);
    
    try {
      const { data } = await apiClient.put<StoreModuleResponse>(
        `${API_CONFIG.ENDPOINTS.STORE_MODULES}/${storeId}/${moduleId}`,
        { isEnabled }
      );
      return data;
    } catch (error) {
      console.error('Error updating module state:', error);
      throw error; // Re-throw the error to handle it in the calling function
    }
  },
  
  async initializeStoreModules(storeId: string) {
    const { data } = await apiClient.post<Module[]>(
      `${API_CONFIG.ENDPOINTS.STORE_MODULES}/${storeId}/initialize`
    );
    return data;
  }
}; 