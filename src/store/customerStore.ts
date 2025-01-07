import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Customer } from '../types/customer';
import { Store } from '../types/store';
import { mockCustomers } from '../data/mockData';
import { DEFAULT_MODULES } from '../types/module';

interface CustomerStore {
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => void;
  addStore: (customerId: string, store: Omit<Store, 'id'>) => void;
  updateCustomer: (customerId: string, updates: Partial<Customer>) => void;
  updateCustomerModule: (customerId: string, storeId: string | null, moduleId: string, enabled: boolean) => void;
  getCustomerById: (customerId: string) => Customer | undefined;
  getStoreById: (storeId: string) => { store: Store; customer: Customer } | undefined;
}

const initializeModuleStats = (modules: typeof DEFAULT_MODULES) => 
  modules.map(module => ({
    ...module,
    stats: {
      activeUsers: 0,
      activeDevices: 0,
      lastUpdated: new Date().toISOString()
    }
  }));

const initializeStore = (store: Omit<Store, 'id'>): Store => ({
  ...store,
  id: `store-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  modules: initializeModuleStats(DEFAULT_MODULES)
});

export const useCustomerStore = create<CustomerStore>()(
  persist(
    (set, get) => ({
      customers: mockCustomers,
      
      getCustomerById: (customerId) => 
        get().customers.find(c => c.id === customerId),

      getStoreById: (storeId) => {
        const customer = get().customers.find(c => 
          c.stores.some(s => s.id === storeId)
        );
        if (!customer) return undefined;
        
        const store = customer.stores.find(s => s.id === storeId);
        if (!store) return undefined;

        return { store, customer };
      },

      addCustomer: (customerData) => {
        const newCustomer: Customer = {
          ...customerData,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          stores: customerData.stores.map(store => initializeStore(store)),
          modules: initializeModuleStats(DEFAULT_MODULES)
        };

        set(state => ({
          customers: [...state.customers, newCustomer]
        }));

        return newCustomer;
      },

      addStore: (customerId, storeData) =>
        set(state => ({
          customers: state.customers.map(customer => {
            if (customer.id !== customerId) return customer;
            
            const newStore = initializeStore(storeData);

            return {
              ...customer,
              stores: [...customer.stores, newStore],
              updatedAt: new Date().toISOString()
            };
          })
        })),

      updateCustomer: (customerId, updates) =>
        set(state => ({
          customers: state.customers.map(customer =>
            customer.id === customerId
              ? { 
                  ...customer, 
                  ...updates,
                  updatedAt: new Date().toISOString()
                }
              : customer
          )
        })),

      updateCustomerModule: (customerId, storeId, moduleId, enabled) =>
        set(state => ({
          customers: state.customers.map(customer => {
            if (customer.id !== customerId) return customer;

            // Update customer-level modules
            const updatedModules = customer.modules.map(module =>
              module.id === moduleId ? { ...module, isEnabled: enabled } : module
            );

            // Update store-level modules if storeId is provided
            const updatedStores = storeId
              ? customer.stores.map(store =>
                  store.id === storeId
                    ? {
                        ...store,
                        modules: store.modules.map(module =>
                          module.id === moduleId
                            ? { ...module, isEnabled: enabled }
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
        }))
    }),
    {
      name: 'customer-store',
      version: 2,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Add module stats
          const state = {
            ...persistedState,
            customers: persistedState.customers.map((customer: Customer) => ({
              ...customer,
              stores: customer.stores.map(store => ({
                ...store,
                modules: initializeModuleStats(DEFAULT_MODULES)
              })),
              modules: initializeModuleStats(DEFAULT_MODULES)
            }))
          };
          return state;
        }
        return persistedState;
      }
    }
  )
);