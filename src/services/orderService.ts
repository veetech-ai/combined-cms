import apiClient from './apiClient';
import { API_CONFIG } from '../config/api';

export interface OrderItem {
  id: number | string;
  name: { en: string; es: string };
  price: number;
  quantity: number;
  customization?: Record<string, string>;
  addons?: Array<{
    id: string;
    name: string;
    price: number;
  }>;
  extras?: Array<{
    id: string;
    name: string;
    price: number;
  }>;
  instructions?: string;
}

export interface Order {
  orderId: string;
  status: string;
  customerName: string;
  customerPhone: string;
  timestamp: string;
  items: OrderItem[];
  totalBill: string;
}

// Helper function to get endpoint
const getEndpoint = (endpoint: string) => endpoint;

export const orderService = {
  async getOrder(orderId: string) {
    const { data } = await apiClient.get<Order>(
      getEndpoint(`${API_CONFIG.ENDPOINTS.ORDERS}/${orderId}`)
    );
    return data;
  },

  async createOrder(order: Order) {
    const { data } = await apiClient.post<Order>(
      getEndpoint(API_CONFIG.ENDPOINTS.ORDERS),
      order
    );
    return data;
  },

  async updateOrder(orderId: string, order: Partial<Order>) {
    const { data } = await apiClient.put<Order>(
      getEndpoint(`${API_CONFIG.ENDPOINTS.ORDERS}/${orderId}`),
      order
    );
    return data;
  },

  async deleteOrder(orderId: string) {
    await apiClient.delete(
      getEndpoint(`${API_CONFIG.ENDPOINTS.ORDERS}/${orderId}`)
    );
  }
};
