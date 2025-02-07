import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Store } from '../../types/store';
import StoreInfo from './StoreInfo';
import StoreOperatingHours from './StoreOperatingHours';
import StoreModulesSection from './StoreModulesSection';
import StoreMenuSection from './StoreMenuSection';
import CollapsibleSection from '../common/CollapsibleSection';
import ModuleManagementView from '../modules/ModuleManagementView';

interface StoreDetailsViewProps {
  store: Store & { customerName: string };
  onBack: () => void;
}

export default function StoreDetailsView({
  store,
  onBack
}: StoreDetailsViewProps) {
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

  const handleModuleClick = (moduleId: string) => {
    setSelectedModuleId(moduleId);
  };

  if (selectedModuleId) {
    return (
      <ModuleManagementView
        moduleId={selectedModuleId}
        storeId={store.id}
        onBack={() => setSelectedModuleId(null)}
      />
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{store.name}</h1>
          <p className="text-gray-600">Customer: {store.customerName}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm">
          <CollapsibleSection title="Store Information">
            <StoreInfo store={store} />
          </CollapsibleSection>
        </div>
        <div className="bg-white rounded-xl shadow-sm">
          <CollapsibleSection title="Operating Hours">
            <StoreOperatingHours operatingHours={store.operatingHours} />
          </CollapsibleSection>
        </div>
      </div>

      <div className="mb-8">
        <CollapsibleSection title="Menu Management">
          <StoreMenuSection storeId={store.id} />
        </CollapsibleSection>
      </div>

      <CollapsibleSection
        title="Store Modules"
        subtitle="Manage your store's active modules and devices"
      >
        <StoreModulesSection
          store={store}
          onModuleClick={handleModuleClick}
        />
      </CollapsibleSection>
    </div>
  );
}
