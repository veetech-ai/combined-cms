import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Store } from '../../types/store';
import { DEFAULT_MODULES } from '../../types/module';
import { useCustomer } from '../../contexts/CustomerContext';
import { storeService } from '../../services/storeService';
import { toast } from 'react-hot-toast';

interface AddStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (store: Omit<Store, 'id'>) => void;
  customerId: string;
}

const defaultOperatingHours = {
  monday: { open: '09:00', close: '17:00' },
  tuesday: { open: '09:00', close: '17:00' },
  wednesday: { open: '09:00', close: '17:00' },
  thursday: { open: '09:00', close: '17:00' },
  friday: { open: '09:00', close: '17:00' },
  saturday: null,
  sunday: null
};

export default function AddStoreModal({
  isOpen,
  onClose,
  onAdd,
  customerId
}: AddStoreModalProps) {
  const {
    state: { customers }
  } = useCustomer();

  if (!customerId) {
    console.error('No customer ID provided to AddStoreModal');
    return null;
  }

  const customer = customers.find((c) => c.id === customerId);

  if (!customer) {
    console.error('Invalid customer ID provided to AddStoreModal');
    return null;
  }

  const [formData, setFormData] = useState<Omit<Store, 'id'>>({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    modules: DEFAULT_MODULES.map((m) => ({
      ...m,
      stats: {
        activeUsers: 0,
        activeDevices: 0,
        lastUpdated: new Date().toISOString()
      }
    })),
    operatingHours: defaultOperatingHours
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Transform the form data to match the API expectations
      const storeData = {
        name: formData.name,
        location: formData.address, // Using address as location
        phone: formData.phone,
        address: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode
        },
        modules: formData.modules,
        operatingHours: formData.operatingHours
        // organizationId: customerId // This is passed from parent component
      };

      console.log(storeData)

      // Call the store service to create the store
      // const newStore = await storeService.createStore(storeData, customerId);

      const organizationId = 'f58ea712-fbf6-42ba-b0a1-bd60e01ba536';

      // Call the onAdd callback with the new store data
      onAdd(storeData, organizationId);

      // Show success message
      toast.success('Store created successfully');

      // Close the modal
      onClose();

      // Reset form
      setFormData({
        name: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        phone: '',
        modules: DEFAULT_MODULES.map((m) => ({
          ...m,
          stats: {
            activeUsers: 0,
            activeDevices: 0,
            lastUpdated: new Date().toISOString()
          }
        })),
        operatingHours: defaultOperatingHours
      });
    } catch (error) {
      console.error('Error creating store:', error);
      toast.error('Failed to create store. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold">Add New Store</h2>
            {customer && (
              <p className="text-sm text-gray-500 mt-1">
                Organization: {customer.company}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Store Information */}
            <div>
              <h3 className="text-lg font-medium mb-4">Store Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Store Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.zipCode}
                    onChange={(e) =>
                      setFormData({ ...formData, zipCode: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} />
              <span>Add Store</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
