import React from 'react';
import { PosProvider, PosConfiguration } from '../../types/pos';

interface PosConfigurationFormProps {
  provider: PosProvider;
  config: PosConfiguration;
  onChange: (config: PosConfiguration) => void;
}

export default function PosConfigurationForm({
  provider,
  config,
  onChange,
}: PosConfigurationFormProps) {
  const renderCloverConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={config.settings.autoSync}
            onChange={(e) =>
              onChange({
                ...config,
                settings: { ...config.settings, autoSync: e.target.checked },
              })
            }
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Enable Auto Sync</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Sync Interval (minutes)
        </label>
        <input
          type="number"
          value={config.settings.syncInterval}
          onChange={(e) =>
            onChange({
              ...config,
              settings: { ...config.settings, syncInterval: Number(e.target.value) },
            })
          }
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  const renderSquareConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location ID
        </label>
        <input
          type="text"
          value={config.settings.locationId}
          onChange={(e) =>
            onChange({
              ...config,
              settings: { ...config.settings, locationId: e.target.value },
            })
          }
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={config.settings.syncInventory}
            onChange={(e) =>
              onChange({
                ...config,
                settings: { ...config.settings, syncInventory: e.target.checked },
              })
            }
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Sync Inventory</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={config.settings.catalogSync}
            onChange={(e) =>
              onChange({
                ...config,
                settings: { ...config.settings, catalogSync: e.target.checked },
              })
            }
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Sync Catalog</span>
        </label>
      </div>
    </div>
  );

  const renderToastConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Restaurant ID
        </label>
        <input
          type="text"
          value={config.settings.restaurantId}
          onChange={(e) =>
            onChange({
              ...config,
              settings: { ...config.settings, restaurantId: e.target.value },
            })
          }
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={config.settings.menuSync}
            onChange={(e) =>
              onChange({
                ...config,
                settings: { ...config.settings, menuSync: e.target.checked },
              })
            }
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Sync Menu</span>
        </label>
      </div>
    </div>
  );

  const renderStripeConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={config.settings.terminalEnabled}
            onChange={(e) =>
              onChange({
                ...config,
                settings: { ...config.settings, terminalEnabled: e.target.checked },
              })
            }
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Enable Terminal</span>
        </label>
      </div>

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={config.settings.autoCapture}
            onChange={(e) =>
              onChange({
                ...config,
                settings: { ...config.settings, autoCapture: e.target.checked },
              })
            }
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Auto Capture Payments</span>
        </label>
      </div>
    </div>
  );

  const renderConfigForm = () => {
    switch (provider) {
      case 'Clover':
        return renderCloverConfig();
      case 'Square':
        return renderSquareConfig();
      case 'Toast':
        return renderToastConfig();
      case 'Stripe':
        return renderStripeConfig();
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-4">
          Provider Configuration
        </h4>
        {renderConfigForm()}
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-4">Webhook Settings</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Webhook URL
            </label>
            <input
              type="url"
              value={config.webhookUrl}
              onChange={(e) =>
                onChange({
                  ...config,
                  webhookUrl: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Callback URL
            </label>
            <input
              type="url"
              value={config.callbackUrl}
              onChange={(e) =>
                onChange({
                  ...config,
                  callbackUrl: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}