import apiClient from './apiClient';
import { API_CONFIG } from '../config/api';
import type { Organization } from '../types';

export const organizationService = {
  async getOrganizations() {
    const { data } = await apiClient.get<Organization[]>(
      API_CONFIG.ENDPOINTS.ORGANIZATIONS
    );
    return data;
  },

  async getOrganizationById(id: string) {
    const { data } = await apiClient.get<Organization>(
      API_CONFIG.ENDPOINTS.ORGANIZATION_BY_ID(id)
    );
    return data;
  },

  async createOrganization(organizationData: Partial<Organization>) {
    try {
      console.log('Creating organization...'); // Debug log
      const { data } = await apiClient.post<Organization>(
        API_CONFIG.ENDPOINTS.ORGANIZATIONS,
        organizationData
      );
      console.log('Creation successful:', data); // Debug log
      return data;
    } catch (error) {
      console.error('Error creating organization:', error); // Debug log
      throw error;
    }
  },

  async fetchAllOrganizations() {
    try {
      console.log('Fetching all organizations...'); // Debug log
      const { data } = await apiClient.get<Organization[]>(
        `${API_CONFIG.ENDPOINTS.ORGANIZATIONS}/all`
      );
      console.log('Fetch successful:', data); // Debug log
      return data;
    } catch (error) {
      console.error('Error fetching organizations:', error); // Debug log
      throw error;
    }
  }
};