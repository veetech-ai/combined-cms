import React, { useState } from 'react';
import { Store as StoreIcon, Plus } from 'lucide-react';
import { Store } from '../../types/store';
import StoresList from './StoresList';
import StoreDetailsView from './StoreDetailsView';
import { mockCustomers } from '../../data/mockData';

export default function StoresView() {
  const [selectedStore, setSelectedStore] = useState<(Store & { customerName: string }) | null>(null);

  // Flatten all stores from all customers
  const stores = mockCustomers.reduce<(Store & { customerName: string })[]>((acc, customer) => {
    const customerStores = customer.stores.map(store => ({
      ...store,
      customerName: customer.name
    }));
    return [...acc, ...customerStores];
  }, []);

  const handleModuleToggle = (storeId: string, moduleId: string, enabled: boolean) => {
    // In a real application, this would update the store's module status
    console.log(`Toggle module ${moduleId} to ${enabled} for store ${storeId}`);
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
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={20} />
          <span>Add Store</span>
        </button>
      </div>

      <StoresList 
        stores={stores} 
        onStoreClick={setSelectedStore}
      />
    </main>
  );
}