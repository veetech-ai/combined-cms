import { apiClient } from './apiClient';

interface OrderItem {
  menu_item_id: number;
  quantity: number;
  price: number;
  instructions?: string;
}

interface Order {
  id: string;
  customer_id: string;
  order_number: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  subtotal: number;
  phone_discount: boolean;
  phone_discount_amount: number;
  coupon_code?: string;
  coupon_discount_amount: number;
  total: number;
  payment_method: 'cash' | 'card';
  payment_status: boolean;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export async function createOrder(data: {
  customer_id: string;
  items: OrderItem[];
  phone_discount: boolean;
  coupon_code?: string;
  payment_method: 'cash' | 'card';
}): Promise<Order> {
  return apiClient.post<Order>('/orders', data);
}

export async function getOrdersByCustomer(customerId: string): Promise<Order[]> {
  return apiClient.get<Order[]>(`/orders/customer/${customerId}`);
}

export async function getOrderByNumber(orderNumber: string): Promise<Order> {
  return apiClient.get<Order>(`/orders/number/${orderNumber}`);
}

export async function updateOrderStatus(
  id: string, 
  status: Order['status']
): Promise<Order> {
  return apiClient.put<Order>(`/orders/${id}/status`, { status });
}