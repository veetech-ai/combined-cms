export interface OrderItem {
  id: string;
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
  status:
    | 'pending'
    | 'confirmed'
    | 'preparing'
    | 'ready'
    | 'completed'
    | 'cancelled';
  customerName: string;
  customerPhone: string;
  timestamp: string;
  items: OrderItem[];
  totalBill: string;
}
