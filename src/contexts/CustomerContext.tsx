import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Customer } from '../types/customer';
import { Store } from '../types/store';
import { mockCustomers } from '../data/mockData';

interface CustomerState {
  customers: Customer[];
  loading: boolean;
  error: string | null;
}

type CustomerAction = 
  | { type: 'ADD_CUSTOMER'; payload: Customer }
  | { type: 'UPDATE_CUSTOMER'; payload: { id: string; updates: Partial<Customer> } }
  | { type: 'UPDATE_MODULE'; payload: { customerId: string; storeId: string | null; moduleId: string; enabled: boolean } }
  | { type: 'ADD_STORE'; payload: { customerId: string; store: Store } };

const CustomerContext = createContext<{
  state: CustomerState;
  dispatch: React.Dispatch<CustomerAction>;
} | undefined>(undefined);

const customerReducer = (state: CustomerState, action: CustomerAction): CustomerState => {
  switch (action.type) {
    case 'ADD_CUSTOMER':
      return {
        ...state,
        customers: [...state.customers, action.payload]
      };

    case 'UPDATE_CUSTOMER':
      return {
        ...state,
        customers: state.customers.map(customer =>
          customer.id === action.payload.id
            ? { ...customer, ...action.payload.updates }
            : customer
        )
      };

    case 'UPDATE_MODULE':
      return {
        ...state,
        customers: state.customers.map(customer => {
          if (customer.id !== action.payload.customerId) return customer;

          // Update customer-level modules
          const updatedModules = customer.modules.map(module =>
            module.id === action.payload.moduleId
              ? { ...module, isEnabled: action.payload.enabled }
              : module
          );

          // Update store-level modules if storeId is provided
          const updatedStores = action.payload.storeId
            ? customer.stores.map(store =>
                store.id === action.payload.storeId
                  ? {
                      ...store,
                      modules: store.modules.map(module =>
                        module.id === action.payload.moduleId
                          ? { ...module, isEnabled: action.payload.enabled }
                          : module
                      )
                    }
                  : store
              )
            : customer.stores;

          return {
            ...customer,
            modules: updatedModules,
            stores: updatedStores,
            updatedAt: new Date().toISOString()
          };
        })
      };

    case 'ADD_STORE':
      return {
        ...state,
        customers: state.customers.map(customer =>
          customer.id === action.payload.customerId
            ? {
                ...customer,
                stores: [...customer.stores, action.payload.store],
                updatedAt: new Date().toISOString()
              }
            : customer
        )
      };

    default:
      return state;
  }
};

export const CustomerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(customerReducer, {
    customers: mockCustomers,
    loading: false,
    error: null
  });

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem('customerState', JSON.stringify(state));
  }, [state]);

  return (
    <CustomerContext.Provider value={{ state, dispatch }}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
};