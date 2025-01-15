import React from 'react';
import { Customer } from '../../types/customer';
import IntegrationCard from './IntegrationCard';
import PosConfigurationForm from './PosConfigurationForm';

interface CustomerPosIntegrationProps {
  customer: Customer;
  onUpdate: (posIntegration: Customer['posIntegration']) => void;
}

export default function CustomerPosIntegration({
  customer,
  onUpdate
}: CustomerPosIntegrationProps) {
  const handleProviderChange = (
    provider: Customer['posIntegration']['provider']
  ) => {
    onUpdate({
      ...customer.posIntegration,
      provider,
      status: 'pending',
      errorMessage: undefined
    });
  };

  const handleReconnect = () => {
    onUpdate({
      ...customer.posIntegration,
      status: 'synced',
      lastSync: new Date().toISOString(),
      errorMessage: undefined
    });
  };

  const handleConfigUpdate = (
    config: Customer['posIntegration']['configuration']
  ) => {
    onUpdate({
      ...customer.posIntegration,
      configuration: config
    });
  };

  return (
    <div className="space-y-6">
      <IntegrationCard
        integration={customer.posConfig}
        onProviderChange={handleProviderChange}
        onReconnect={handleReconnect}
      />

      {customer.posProvider !== 'Null' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <PosConfigurationForm
            provider={customer.posProvider}
            config={customer.posConfig}
            onChange={handleConfigUpdate}
          />
        </div>
      )}
    </div>
  );
}
