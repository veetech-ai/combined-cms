import { apiClient } from './apiClient';

interface Customer {
  id: string;
  name: string;
  phone: string;
  is_vip: boolean;
  created_at: string;
  updated_at: string;
}

export async function findOrCreateCustomer(data: { 
  name: string; 
  phone: string; 
}): Promise<Customer> {
  return apiClient.post<Customer>('/customers/find-or-create', data);
}

export async function getCustomerByPhone(phone: string): Promise<Customer | null> {
  return apiClient.get<Customer | null>(`/customers/phone/${phone}`);
}

export async function updateCustomer(id: string, data: {
  name?: string;
  phone?: string;
  is_vip?: boolean;
}): Promise<Customer> {
  return apiClient.put<Customer>(`/customers/${id}`, data);
}