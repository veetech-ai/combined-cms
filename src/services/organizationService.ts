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
  }
};