import React, { createContext, useContext, useState } from 'react';

// Create Order Context
const OrderContext = createContext();

interface OrderItem {
  id: number;
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

interface OrderContextType {
  orderItems: {
    orderId: string;
    items: OrderItem[];
    totalBill: string;
  } | null;
  setOrder: (order: any) => void;
}

// Provider Component
export const OrderProvider = ({ children }) => {
  const [orderItems, setOrderItems] = useState([]);

  // Set the full order array (replaces previous order)
  const setOrder = (newOrder) => {
    setOrderItems(newOrder);
  };

  // Clear the order
  const clearOrder = () => {
    setOrderItems([]);
  };

  return (
    <OrderContext.Provider value={{ orderItems, setOrder, clearOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

// Custom Hook for using the Order Context
export const useOrder = () => {
  return useContext(OrderContext);
};
