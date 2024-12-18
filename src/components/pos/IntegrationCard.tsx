import React from 'react';
import { RefreshCw } from 'lucide-react';
import { PosIntegration } from '../../types/pos';
import StatusIndicator from './StatusIndicator';
import ProviderSelect from './ProviderSelect';

interface IntegrationCardProps {
  integration: PosIntegration;
  onProviderChange: (provider: PosIntegration['provider']) => void;
  onReconnect: () => void;
}

export default function IntegrationCard({
  integration,
  onProviderChange,
  onReconnect,
}: IntegrationCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">POS Integration</h3>
          <p className="text-sm text-gray-500">Configure your point of sale integration</p>
        </div>
        <StatusIndicator status={integration.status} />
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            POS Provider
          </label>
          <ProviderSelect
            value={integration.provider}
            onChange={onProviderChange}
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <div>
            <p className="text-gray-500">Last Synced</p>
            <p className="font-medium mt-0.5">{integration.lastSync}</p>
          </div>
          <div>
            <p className="text-gray-500">Connected Since</p>
            <p className="font-medium mt-0.5">{integration.connectedAt}</p>
          </div>
        </div>

        {integration.errorMessage && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
            {integration.errorMessage}
          </div>
        )}

        {(integration.status === 'disconnected' || integration.status === 'error') && (
          <button
            onClick={onReconnect}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <RefreshCw size={18} />
            <span>Reconnect</span>
          </button>
        )}
      </div>
    </div>
  );
}