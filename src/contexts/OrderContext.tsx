import React, { createContext, useContext, useState } from 'react';

interface OrderItem {
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
  imageUrl?: string;
  cartId?: string;
  addOnPrices?: { [key: string]: number };
  beveragePrices?: { [key: string]: number };
  sidePrices?: { [key: string]: number };
  dessertPrices?: { [key: string]: number };
  beverages?: string[];
  sides?: string[];
  desserts?: string[];
}

interface OrderContextType {
  orderItems: {
    orderId: string;
    items: OrderItem[];
    totalBill: string;
    customerName?: string;
    customerPhone?: string;
    timestamp?: string;
  } | null;
  setOrder: (order: OrderContextType['orderItems']) => void;
  clearOrder: () => void;
}

// Create Order Context with type
const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Provider Component
export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orderItems, setOrderItems] = useState<OrderContextType['orderItems']>(null);

  // Set the full order array (replaces previous order)
  const setOrder = (newOrder: OrderContextType['orderItems']) => {
    setOrderItems(newOrder);
  };

  // Clear the order
  const clearOrder = () => {
    setOrderItems(null);
  };

  return (
    <OrderContext.Provider value={{ orderItems, setOrder, clearOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

// Custom Hook for using the Order Context
export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
