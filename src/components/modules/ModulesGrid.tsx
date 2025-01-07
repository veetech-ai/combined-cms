import React from 'react';
import { useCustomer } from '../../contexts/CustomerContext';
import CustomerSelect from '../common/CustomerSelect';
import { ModuleCard } from './ModuleCard';
import { useState } from 'react';

export default function ModulesGrid() {
  const { state: { customers }, dispatch } = useCustomer();
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
  const customerModules = selectedCustomer?.modules || [];

  const handleModuleToggle = (moduleId: string, enabled: boolean) => {
    if (selectedCustomerId) {
      dispatch({
        type: 'UPDATE_MODULE',
        payload: { customerId: selectedCustomerId, storeId: null, moduleId, enabled }
      });
    }
  };

  if (!customers || customers.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-center">
        <p className="text-gray-500">No customers found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Customer
        </label>
        <CustomerSelect
          customers={customers}
          value={selectedCustomerId}
          onChange={setSelectedCustomerId}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {customerModules.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            onToggle={(enabled) => handleModuleToggle(module.id, enabled)}
          />
        ))}
      </div>
    </div>
  );
}