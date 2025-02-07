import apiClient from './apiClient';
import { API_CONFIG } from '../config/api';
import type { Organization } from '../types';

// Simple in-memory cache
const cache = new Map<string, { data: Organization; timestamp: number }>();
const CACHE_DURATION = 1; // 5 minutes

export const organizationService = {
  async getOrganizations() {
    const { data } = await apiClient.get<Organization[]>(
      API_CONFIG.ENDPOINTS.ORGANIZATIONS
    );
    return data;
  },

  async getOrganizationById(id: string) {
    // Check cache first
    const cached = cache.get(id);
    const now = Date.now();

    if (cached && now - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    try {
      const { data } = await apiClient.get<Organization>(
        API_CONFIG.ENDPOINTS.ORGANIZATION_BY_ID(id)
      );

      // Update cache
      cache.set(id, { data, timestamp: now });

      return data;
    } catch (error) {
      console.error('Error fetching organization:', error);
      throw error;
    }
  },

  async createOrganization(organizationData: Partial<Organization>) {
    try {
      const dataWithLogo = {
        ...organizationData,
        logo: organizationData.logo || DEFAULT_AVATAR
      };

      const { data } = await apiClient.post<Organization>(
        API_CONFIG.ENDPOINTS.ORGANIZATIONS,
        dataWithLogo
      );

      return data;
    } catch (error) {
      console.error('Error creating organization:', error);
      throw error;
    }
  },

  async fetchAllOrganizations() {
    try {
      const { data } = await apiClient.get<Organization[]>(
        `${API_CONFIG.ENDPOINTS.ORGANIZATIONS}/all`
      );
      return data;
    } catch (error) {
      console.error('Error fetching organizations:', error);
      throw error;
    }
  },

  clearCache() {
    cache.clear();
  },

  async updateModuleStatus(
    customerId: string,
    storeId: string | null,
    moduleId: string,
    enabled: boolean
  ) {
    try {
      const endpoint = storeId
        ? `${API_CONFIG.ENDPOINTS.ORGANIZATIONS}/${customerId}/stores/${storeId}/modules/${moduleId}`
        : `${API_CONFIG.ENDPOINTS.ORGANIZATIONS}/${customerId}/modules/${moduleId}`;

      const { data } = await apiClient.patch(endpoint, {
        enabled
      });

      // Clear the cache for this organization since it's been updated
      cache.delete(customerId);

      return data;
    } catch (error) {
      console.error('Error updating module status:', error);
      throw error;
    }
  },

  async updatePosIntegration(
    customerId: string,
    posIntegration: Customer['posIntegration']
  ) {
    try {
      const { data } = await apiClient.patch(
        `${API_CONFIG.ENDPOINTS.ORGANIZATIONS}/${customerId}/pos`,
        posIntegration
      );

      // Clear the cache for this organization
      cache.delete(customerId);

      return data;
    } catch (error) {
      console.error('Error updating POS integration:', error);
      throw error;
    }
  },

  async checkEmailAvailability(email: string) {
    try {
      const { data } = await apiClient.get<{
        available: boolean;
        message: string;
      }>(API_CONFIG.ENDPOINTS.CHECK_EMAIL(email));
      return data;
    } catch (error: any) {
      console.error('Error checking email availability:', error);
      return {
        available: false,
        message:
          error.response?.data?.message || 'Error checking email availability'
      };
    }
  }
};
