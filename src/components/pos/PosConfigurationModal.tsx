import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Customer } from '../../types/customer';
import ProviderSelect from './ProviderSelect';
import PosConfigurationForm from './PosConfigurationForm';

interface PosConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer;
  onUpdate: (posIntegration: Customer['posIntegration']) => void;
}

export default function PosConfigurationModal({
  isOpen,
  onClose,
  customer,
  onUpdate,
}: PosConfigurationModalProps) {
  const [posIntegration, setPosIntegration] = useState(customer.posIntegration);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(posIntegration);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold">Configure POS Integration</h2>
            <p className="text-sm text-gray-500 mt-1">{customer.name}</p>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                POS Provider
              </label>
              <ProviderSelect
                value={posIntegration.provider}
                onChange={(provider) =>
                  setPosIntegration({
                    ...posIntegration,
                    provider,
                    type: provider,
                    status: 'pending',
                  })
                }
              />
            </div>

            {posIntegration.provider !== 'None' && (
              <PosConfigurationForm
                provider={posIntegration.provider}
                config={posIntegration.configuration}
                onChange={(config) =>
                  setPosIntegration({
                    ...posIntegration,
                    configuration: config,
                  })
                }
              />
            )}
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}