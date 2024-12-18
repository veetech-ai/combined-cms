import React from 'react';
import { Customer } from '../../types/customer';
import ModulesList from './ModulesList';
import StatusBadge from '../common/StatusBadge';
import SearchInput from '../common/SearchInput';
import TableHeader from '../common/TableHeader';
import { useSearch } from '../../hooks/useSearch';

interface CustomersTableProps {
  customers: Customer[];
  onModuleToggle: (customerId: string, storeId: string, moduleId: string, enabled: boolean) => void;
}

export default function CustomersTable({ customers, onModuleToggle }: CustomersTableProps) {
  const {
    searchTerm,
    setSearchTerm,
    sortField,
    sortDirection,
    toggleSort,
    results: filteredCustomers,
  } = useSearch<Customer>(
    customers,
    ['name', 'company', 'email'],
    'name'
  );

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Customer List</h2>
          <div className="w-72">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search customers..."
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm border-b border-gray-200">
                <TableHeader
                  label="Customer"
                  sortable
                  sortField={sortField === 'name' ? 'name' : undefined}
                  sortDirection={sortDirection}
                  onSort={() => toggleSort('name')}
                />
                <TableHeader label="Stores" />
                <TableHeader
                  label="POS Integration"
                  sortable
                  sortField={sortField === 'posIntegration.status' ? 'posIntegration.status' : undefined}
                  sortDirection={sortDirection}
                  onSort={() => toggleSort('posIntegration.status')}
                />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td className="py-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={customer.avatar}
                        alt=""
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{customer.name}</p>
                        <p className="text-sm text-gray-500">{customer.company}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="space-y-4">
                      {customer.stores.map((store) => (
                        <div key={store.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                          <p className="font-medium text-gray-900 mb-2">{store.name}</p>
                          <ModulesList
                            modules={store.modules}
                            onToggle={(moduleId, enabled) =>
                              onModuleToggle(customer.id, store.id, moduleId, enabled)
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center space-x-2">
                      <StatusBadge status={customer.posIntegration.status} />
                      <span className="text-sm text-gray-500">
                        {customer.posIntegration.type}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}