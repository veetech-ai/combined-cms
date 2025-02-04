import { create } from 'zustand';
import { findOrCreateCustomer, getCustomerByPhone } from '../api/customers';

interface Customer {
  id: string;
  name: string;
  phone: string;
  is_vip: boolean;
}

interface CustomerStore {
  customer: Customer | null;
  isLoading: boolean;
  error: string | null;
  findOrCreate: (name: string, phone: string) => Promise<Customer>;
  lookupByPhone: (phone: string) => Promise<Customer | null>;
  clear: () => void;
}

export const useCustomerStore = create<CustomerStore>((set) => ({
  customer: null,
  isLoading: false,
  error: null,

  findOrCreate: async (name: string, phone: string) => {
    set({ isLoading: true, error: null });
    try {
      const customer = await findOrCreateCustomer({ name, phone }); // Using mock implementation
      set({ customer, isLoading: false });
      return customer;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save customer';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  lookupByPhone: async (phone: string) => {
    set({ isLoading: true, error: null });
    try {
      const customer = await getCustomerByPhone(phone); // Using mock implementation
      set({ customer, isLoading: false });
      return customer;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to lookup customer';
      set({ error: message, isLoading: false });
      return null;
    }
  },

  clear: () => {
    set({ customer: null, error: null, isLoading: false });
  }
}));