import { useState, useMemo } from 'react';
import { mockCustomers } from '../data/mockData';
import { Customer } from '../types/customer';
import { Module } from '../types/module';

interface ModuleWithStats extends Module {
  stats: {
    activeUsers: number;
    lastUpdated: string;
  };
}

export function useCustomerModules() {
  const [customers] = useState<Customer[]>(mockCustomers);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    customers[0]?.id || ''
  );

  const selectedCustomer = useMemo(
    () => customers.find((c) => c.id === selectedCustomerId),
    [customers, selectedCustomerId]
  );

  const customerModules = useMemo(() => {
    if (!selectedCustomer) return [];

    // Use customer-level modules instead of store modules
    return selectedCustomer.modules.map((module) => ({
      ...module,
      stats: {
        activeUsers: Math.floor(Math.random() * 1000),
        lastUpdated: new Date().toISOString(),
      },
    }));
  }, [selectedCustomer]);

  const handleModuleToggle = (moduleId: string, enabled: boolean) => {
    // In a real application, this would make an API call to update the customer's module status
    console.log(
      `Toggle module ${moduleId} to ${enabled} for customer ${selectedCustomerId}`
    );
  };

  return {
    selectedCustomerId,
    setSelectedCustomerId,
    customerModules,
    customers,
    handleModuleToggle,
  };
}