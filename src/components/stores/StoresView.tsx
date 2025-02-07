import React, { useState, useEffect } from 'react';
import { Store as StoreIcon, Plus } from 'lucide-react';
import { Store } from '../../types/store';
import StoresList from './StoresList';
import StoreDetailsView from './StoreDetailsView';
import AddStoreModal from './AddStoreModal';
import { useCustomer } from '../../contexts/CustomerContext';
import SearchInput from '../common/SearchInput';
import { storeService } from '../../services/storeService';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function StoresView() {
  const [selectedStore, setSelectedStore] = useState<
    (Store & { customerName: string }) | null
  >(null);
  const [isAddingStore, setIsAddingStore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrganization, setSelectedOrganization] = useState<string>('');
  const {
    state: { customers },
    dispatch
  } = useCustomer();

  const [storesList, setStoresList] = useState([]);

  const token = localStorage.getItem('access_token');

  // Add a function to fetch stores
  const fetchStores = async () => {
    try {
      const resp = await axios.get(
        'http://localhost:4000/api/v1/stores/all',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (resp && resp.data) {
        setStoresList(resp.data);
      }
    } catch (err) {
      console.error('Failed to fetch Stores');
      toast.error('Failed to fetch stores');
    }
  };

  // Use the fetchStores function in useEffect
  useEffect(() => {
    fetchStores();
  }, []);

  // Get unique organizations from the stores list
  const organizations = Array.from(
    new Set(storesList.map((store) => store.organization?.name).filter(Boolean))
  );

  // Filter and flatten stores based on selected organization and search term
  const filteredStores = storesList
    .filter(
      (store) =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (store.organization?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(
      (store) =>
        !selectedOrganization || store.organization?.name === selectedOrganization
    );

  // Handle when a store is clicked to view details
  const handleStoreClick = (store: Store & { organization?: { name: string } }) => {
    setSelectedStore({
      ...store,
      customerName: store.organization?.name || 'Unknown Organization'
    });
  };

  const handleModuleToggle = (
    storeId: string,
    moduleId: string,
    enabled: boolean
  ) => {
    const customer = customers.find((c) =>
      c.stores.some((s) => s.id === storeId)
    );
    if (customer) {
      dispatch({
        type: 'UPDATE_MODULE',
        payload: { customerId: customer.id, storeId, moduleId, enabled }
      });
    }
  };

  // Update the onAdd handler in AddStoreModal
  const handleAddStore = async (store: Omit<Store, 'id'>) => {
    try {
      const newStore = await storeService.createStore(store);
      // Fetch updated stores list
      await fetchStores();
      setIsAddingStore(false);
      toast.success('Store added successfully');
    } catch (error) {
      console.error('Error adding store:', error);
      toast.error('Failed to add store');
    }
  };

  if (selectedStore) {
    return (
      <StoreDetailsView
        store={selectedStore}
        onBack={() => setSelectedStore(null)}
        onModuleToggle={(moduleId, enabled) =>
          handleModuleToggle(selectedStore.id, moduleId, enabled)
        }
      />
    );
  }

  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Store Management</h1>
          <p className="text-gray-600 mt-1">
            Manage all store locations and their modules
          </p>
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
            {organizations.map((orgName) => (
              <button
                key={orgName}
                onClick={() =>
                  setSelectedOrganization(
                    selectedOrganization === orgName ? '' : orgName
                  )
                }
                className={`relative inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full border-2 transition-all ${
                  selectedOrganization === orgName
                    ? 'border-blue-600 bg-blue-50 text-blue-600 z-10'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {orgName}
              </button>
            ))}
          </div>
          <div className="flex-1">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search stores or organizations..."
            />
          </div>
        </div>
      </div>

      <StoresList 
        stores={filteredStores.map(store => ({
          ...store,
          customerName: store.organization?.name || 'Unknown Organization',
          address: store.address || store.location,
          city: store.city || '',
          state: store.state || '',
          zipCode: store.zipCode || '',
          phone: store.phone || '',
          modules: store.modules || []
        }))} 
        onStoreClick={handleStoreClick} 
      />

      {isAddingStore && organizations.length > 0 && (
        <AddStoreModal
          isOpen={isAddingStore}
          onClose={() => setIsAddingStore(false)}
          onAdd={handleAddStore}
          organizationId={
            selectedOrganization
              ? storesList.find(
                  (store) => store.organization?.name === selectedOrganization
                )?.organizationId || ''
              : ''
          }
          organizationName={selectedOrganization || ''}
        />
      )}
    </main>
  );
}
