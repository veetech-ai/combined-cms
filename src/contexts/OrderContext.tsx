import React, { createContext, useContext, useState } from 'react';

// Create Order Context
const OrderContext = createContext();

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
