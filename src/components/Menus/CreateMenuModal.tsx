import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { organizationService } from '../../services/organizationService';
import { storeService } from '../../services/storeService';

export function CreateMenuModal({ store, onClose }) {
  const [form, setForm] = useState({
    name: '',
    location: '',
    clientName: '',
    storeId: '',
    description: '',
    organizationId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [organizations, setOrganizations] = useState([]);
  const [stores, setStores] = useState([]);

  // Fetch organizations from the service
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const orgs = await organizationService.fetchAllOrganizations();
        setOrganizations(orgs); // Assuming `orgs` is an array
      } catch (error) {
        console.error('Failed to fetch organizations:', error);
        toast.error('Failed to load organizations');
      }
    };

    const fetchStores = async () => {
      try {
        const strs = await storeService.fetchAllStores();
        console.log(strs);
        setStores(strs); // Assuming `orgs` is an array
      } catch (error) {
        console.error('Failed to fetch organizations:', error);
        toast.error('Failed to load organizations');
      }
    };

    fetchOrganizations();
    fetchStores();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.organizationId) {
      toast.error('Please select an organization');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate store creation
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Store created successfully');
      setIsOpen(false);
      setForm({
        name: '',
        location: '',
        description: '',
        organizationId: '',
        storeId: ''
      });
    } catch (error) {
      toast.error('Failed to create store');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Create Store</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="organization"
                className="block text-sm font-medium text-gray-700"
              >
                Organization <span className="text-red-500">*</span>
              </label>
              <select
                id="organization"
                required
                value={form.organizationId}
                onChange={(e) =>
                  setForm({ ...form, organizationId: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Select an organization</option>
                {organizations &&
                  organizations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Store <span className="text-red-500">*</span>
              </label>
              <select
                id="stores"
                required
                value={form.storeId}
                onChange={(e) => setForm({ ...form, storeId: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Select a store</option>
                {stores &&
                  stores.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="clientName"
                className="block text-sm font-medium text-gray-700"
              >
                Client Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="clientName"
                required
                value={form.clientName}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="location"
                required
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div className="mt-5 sm:mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : 'Create Store'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
