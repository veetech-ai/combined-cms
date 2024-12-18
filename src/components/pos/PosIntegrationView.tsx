import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { mockCustomers } from '../../data/mockData';
import CustomerPosCard from './CustomerPosCard';
import SearchInput from '../common/SearchInput';

export default function PosIntegrationView() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = mockCustomers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.posIntegration.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">POS Integrations</h1>
          <p className="text-gray-600 mt-1">
            Manage customer point of sale integrations
          </p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={20} />
          <span>New Integration</span>
        </button>
      </div>

      <div className="mb-6 max-w-md">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by customer or POS type..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <CustomerPosCard
            key={customer.id}
            customer={customer}
            onUpdate={(posIntegration) => {
              console.log('Updating POS integration:', posIntegration);
            }}
          />
        ))}
      </div>
    </main>
  );
}