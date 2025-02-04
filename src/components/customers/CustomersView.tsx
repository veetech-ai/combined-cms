import React, { useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';
import CustomerCard from './CustomerCard';
import CustomerDetailsView from './CustomerDetailsView';
import AddCustomerModal from './AddCustomerModal';
import { Customer, Organization, Module, Store } from '../../types';
import { useCustomer } from '../../contexts/CustomerContext';
import SearchInput from '../common/SearchInput';
import { organizationService } from '../../services/organizationService';
import { toast } from 'react-hot-toast';

export default function CustomersView() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchOrganizations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await organizationService.fetchAllOrganizations();
      setOrganizations(data);
    } catch (err) {
      setError('Failed to fetch organizations');
      toast.error('Failed to fetch organizations');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleAddCustomer = async (customerData: Partial<Organization>) => {
    try {
      setIsSubmitting(true);
      const newOrg = await organizationService.createOrganization(customerData);
      await fetchOrganizations();
      toast.success('Organization created successfully');
      setIsModalOpen(false);
    } catch (err) {
      toast.error('Failed to create organization');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomerSelect = (customerId: string) => {
    setSelectedCustomerId(customerId);
  };

  const filteredOrganizations = organizations.filter(
    (org) =>
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedCustomerId) {
    return (
      <CustomerDetailsView
        customerId={selectedCustomerId}
        onBack={() => setSelectedCustomerId(null)}
      />
    );
  }

  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
          <p className="text-gray-600 mt-1">
            Manage your customer accounts and their stores
          </p>
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

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-600 py-8">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrganizations.map((organization) => (
            <CustomerCard
              key={organization.id}
              customer={organization}
              onClick={() => handleCustomerSelect(organization.id)}
            />
          ))}
        </div>
      )}

      <AddCustomerModal
        customers={organizations}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddCustomer}
      />

      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}
    </main>
  );
}
