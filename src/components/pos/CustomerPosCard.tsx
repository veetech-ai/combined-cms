import React, { useState } from 'react';
import { CreditCard, Settings } from 'lucide-react';
import { Customer } from '../../types/customer';
import StatusIndicator from './StatusIndicator';
import PosConfigurationModal from './PosConfigurationModal';

interface CustomerPosCardProps {
  customer: Customer;
  onUpdate: (posIntegration: Customer['posIntegration']) => void;
}

export default function CustomerPosCard({ customer, onUpdate }: CustomerPosCardProps) {
  const [isConfiguring, setIsConfiguring] = useState(false);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{customer.name}</h3>
              <p className="text-sm text-gray-500">{customer.company}</p>
            </div>
          </div>
          <StatusIndicator status={customer.posIntegration.status} />
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">POS Provider</p>
            <p className="font-medium">{customer.posIntegration.type || 'None'}</p>
          </div>

          {customer.posIntegration.lastSync && (
            <div>
              <p className="text-sm text-gray-500">Last Synced</p>
              <p className="font-medium">
                {new Date(customer.posIntegration.lastSync).toLocaleDateString()}
              </p>
            </div>
          )}

          {customer.posIntegration.errorMessage && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
              {customer.posIntegration.errorMessage}
            </div>
          )}

          <button
            onClick={() => setIsConfiguring(true)}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Settings size={18} />
            <span>Configure Integration</span>
          </button>
        </div>
      </div>

      <PosConfigurationModal
        isOpen={isConfiguring}
        onClose={() => setIsConfiguring(false)}
        customer={customer}
        onUpdate={onUpdate}
      />
    </>
  );
}