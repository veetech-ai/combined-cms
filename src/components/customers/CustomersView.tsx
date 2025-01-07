import React, { useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';
import CustomerCard from './CustomerCard';
import CustomerDetailsView from './CustomerDetailsView';
import AddCustomerModal from './AddCustomerModal';
import { Customer } from '../../types/customer';
import { useCustomer } from '../../contexts/CustomerContext';
import SearchInput from '../common/SearchInput';

export default function CustomersView() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { state: { customers }, dispatch } = useCustomer();

  const handleModuleToggle = (customerId: string, storeId: string | null, moduleId: string, enabled: boolean) => {
    dispatch({
      type: 'UPDATE_MODULE',
      payload: { customerId, storeId, moduleId, enabled }
    });
  };

  // Keep selected customer in sync with store updates
  useEffect(() => {
    if (selectedCustomer) {
      const updatedCustomer = customers.find(c => c.id === selectedCustomer.id);
      setSelectedCustomer(updatedCustomer || null);
    }
  }, [customers, selectedCustomer?.id]);

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedCustomer) {
    return (
      <main className="p-6">
        <CustomerDetailsView
          customer={selectedCustomer}
          onBack={() => setSelectedCustomer(null)}
          onModuleToggle={(storeId, moduleId, enabled) => 
            handleModuleToggle(selectedCustomer.id, storeId, moduleId, enabled)
          }
        />
      </main>
    );
  }

  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
          <p className="text-gray-600 mt-1">Manage your customer accounts and their stores</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <UserPlus size={20} />
          <span>Add Customer</span>
        </button>
      </div>

      <div className="mb-6 max-w-md">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search customers..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <CustomerCard
            key={customer.id}
            customer={customer}
            onClick={() => setSelectedCustomer(customer)}
          />
        ))}
      </div>
      
      <AddCustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={async (customerData) => {
          const newCustomer: Customer = {
            ...customerData,
            id: `customer-${Date.now()}`, 
            avatar: customerData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(customerData.name)}&background=random`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          dispatch({ type: 'ADD_CUSTOMER', payload: newCustomer });
          setIsModalOpen(false);
        }}
      />
    </main>
  );
}