import { create } from 'zustand';
import { apiClient } from '../api/apiClient';

interface Customer {
  id: string;
  name: string;
  phone: string;
  rewardPoints?: number;
}

interface CustomerStore {
  customer: Customer | null;
  isLoading: boolean;
  error: string | null;
  findOrCreate: (name: string, phone: string) => Promise<Customer>;
  setCustomer: (customer: Customer | null) => void;
  clearError: () => void;
}

export const useCustomerStore = create<CustomerStore>((set, get) => ({
  customer: null,
  isLoading: false,
  error: null,

  findOrCreate: async (name: string, phone: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.findOrCreateCustomer(name, phone);
      
      if (response.error) {
        throw new Error(response.error);
      }

      const customer = response.data;
      set({ customer, isLoading: false });
      return customer;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create/find customer';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  setCustomer: (customer) => set({ customer }),
  clearError: () => set({ error: null })
}));