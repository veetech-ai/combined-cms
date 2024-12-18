import React, { useState } from 'react';
import { ArrowLeft, Store as StoreIcon, Plus } from 'lucide-react';
import { Customer } from '../../types/customer';
import StoreCard from './StoreCard';
import CustomerPosIntegration from '../pos/CustomerPosIntegration';
import ModulesList from './ModulesList';
import StoreDetailsView from '../stores/StoreDetailsView';

interface CustomerDetailsViewProps {
  customer: Customer;
  onBack: () => void;
  onModuleToggle: (storeId: string | null, moduleId: string, enabled: boolean) => void;
  onPosUpdate: (posIntegration: Customer['posIntegration']) => void;
}

export default function CustomerDetailsView({ 
  customer, 
  onBack,
  onModuleToggle,
  onPosUpdate
}: CustomerDetailsViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'pos'>('overview');
  const [selectedStore, setSelectedStore] = useState<string | null>(null);

  const selectedStoreData = customer.stores.find(store => store.id === selectedStore);

  if (selectedStore && selectedStoreData) {
    return (
      <StoreDetailsView
        store={{ ...selectedStoreData, customerName: customer.name }}
        onBack={() => setSelectedStore(null)}
        onModuleToggle={(moduleId, enabled) => onModuleToggle(selectedStore, moduleId, enabled)}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{customer.name}</h1>
          <p className="text-gray-600">{customer.company}</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('pos')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pos'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              POS Integration
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <>
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-medium text-gray-700 mb-4">Customer Modules</h3>
              <ModulesList
                modules={customer.modules}
                onToggle={(moduleId, enabled) => onModuleToggle(null, moduleId, enabled)}
              />
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-medium text-gray-700 mb-2">Subscription</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-500">Plan:</span> {customer.subscription.plan}</p>
                <p><span className="text-gray-500">Status:</span> {customer.subscription.status}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-medium text-gray-700 mb-2">Contact Information</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-500">Email:</span> {customer.email}</p>
                <p><span className="text-gray-500">Phone:</span> {customer.phone}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Stores</h2>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus size={18} />
                <span>Add Store</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {customer.stores.map((store) => (
                <StoreCard
                  key={store.id}
                  store={store}
                  onClick={() => setSelectedStore(store.id)}
                  onModuleToggle={(moduleId, enabled) => onModuleToggle(store.id, moduleId, enabled)}
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        <CustomerPosIntegration
          customer={customer}
          onUpdate={onPosUpdate}
        />
      )}
    </div>
  );
}