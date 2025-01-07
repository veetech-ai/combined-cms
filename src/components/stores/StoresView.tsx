import React, { useState, useEffect } from 'react';
import { Store as StoreIcon, Plus } from 'lucide-react';
import { Store } from '../../types/store';
import StoresList from './StoresList';
import StoreDetailsView from './StoreDetailsView';
import AddStoreModal from './AddStoreModal';
import { useCustomer } from '../../contexts/CustomerContext';
import SearchInput from '../common/SearchInput';

export default function StoresView() {
  const [selectedStore, setSelectedStore] = useState<(Store & { customerName: string }) | null>(null);
  const [isAddingStore, setIsAddingStore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrganization, setSelectedOrganization] = useState<string>('');
  const { state: { customers }, dispatch } = useCustomer();
  
  // Get unique organizations
  const organizations = Array.from(new Set(customers.map(c => c.company)));

  // Keep selected store in sync with store updates
  useEffect(() => {
    if (selectedStore) {
      const customer = customers.find(c => 
        c.stores.some(s => s.id === selectedStore.id)
      );
      if (customer) {
        const updatedStore = customer.stores.find(s => s.id === selectedStore.id);
        if (updatedStore) {
          setSelectedStore({
            ...updatedStore,
            customerName: customer.name
          });
        } else {
          setSelectedStore(null);
        }
      } else {
        setSelectedStore(null);
      }
    }
  }, [customers, selectedStore?.id]);

  // Filter and flatten stores based on selected customer and search term
  const stores = customers.reduce<(Store & { customerName: string })[]>((acc, customer) => {
    if (selectedOrganization && customer.company !== selectedOrganization) {
      return acc;
    }
    const customerStores = customer.stores.map(store => ({
      ...store,
      customerName: customer.name
    }));
    return [...acc, ...customerStores];
  }, []).filter(store => 
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleModuleToggle = (storeId: string, moduleId: string, enabled: boolean) => {
    const customer = customers.find(c => 
      c.stores.some(s => s.id === storeId)
    );
    if (customer) {
      dispatch({
        type: 'UPDATE_MODULE',
        payload: { customerId: customer.id, storeId, moduleId, enabled }
      });
    }
  };

  if (selectedStore) {
    return (
      <StoreDetailsView
        store={selectedStore}
        onBack={() => setSelectedStore(null)}
        onModuleToggle={(moduleId, enabled) => handleModuleToggle(selectedStore.id, moduleId, enabled)}
      />
    );
  }

  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Store Management</h1>
          <p className="text-gray-600 mt-1">Manage all store locations and their modules</p>
        </div>
        <button 
          onClick={() => setIsAddingStore(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>Add Store</span>
        </button>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex -space-x-1 overflow-hidden">
            {organizations.map((company) => (
              <button
                key={company}
                onClick={() => setSelectedOrganization(
                  selectedOrganization === company ? '' : company
                )}
                className={`relative inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full border-2 transition-all ${
                  selectedOrganization === company
                    ? 'border-blue-600 bg-blue-50 text-blue-600 z-10'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {company}
              </button>
            ))}
          </div>
          <div className="flex-1">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search stores..."
            />
          </div>
        </div>
      </div>

      <StoresList 
        stores={stores} 
        onStoreClick={setSelectedStore}
      />

      {isAddingStore && customers.length > 0 && (
        <AddStoreModal
          isOpen={isAddingStore}
          onClose={() => setIsAddingStore(false)}
          onAdd={(store) => {
            const targetCustomer = selectedOrganization
              ? customers.find(c => c.company === selectedOrganization) || customers[0]
              : customers[0];
            
            if (!targetCustomer) {
              console.error('No customer found');
              return;
            }
            
            dispatch({
              type: 'ADD_STORE',
              payload: { customerId: targetCustomer.id, store }
            });
            setIsAddingStore(false);
          }}
          customerId={selectedOrganization 
            ? customers.find(c => c.company === selectedOrganization)?.id || customers[0].id
            : customers[0].id}
        />
      )}
    </main>
  );
}