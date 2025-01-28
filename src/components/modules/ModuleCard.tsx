import React from 'react';
import { Monitor, Store, Coffee, Gift } from 'lucide-react';
import ToggleSwitch from '../common/ToggleSwitch';
import { Module, ModuleStatus } from '../../types/module';

const moduleIcons = {
  venu: Monitor,
  kiosk: Store,
  kitchen: Coffee,
  rewards: Gift,
  feedback: Gift,
  inventory: Store,
  analytics: Monitor
};

const getModuleStatusColor = (status: ModuleStatus) => {
  switch (status) {
    case 'APPROVED':
      return 'text-green-600';
    case 'PENDING_APPROVAL':
      return 'text-yellow-600';
    case 'DISABLED':
      return 'text-gray-400';
    default:
      return 'text-gray-400';
  }
};

const getModuleStatusText = (status: ModuleStatus) => {
  switch (status) {
    case 'APPROVED':
      return 'Active';
    case 'PENDING_APPROVAL':
      return 'Pending Approval';
    case 'DISABLED':
      return 'Disabled';
    default:
      return 'Unknown';
  }
};

interface ModuleCardProps {
  module: Module;
  onToggle: (enabled: boolean) => void;
  isPending?: boolean;
}

export function ModuleCard({ module, onToggle, isPending }: ModuleCardProps) {
  const Icon = moduleIcons[module.key as keyof typeof moduleIcons] || Store;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className={`p-3 rounded-lg ${
            module.isEnabled && module.status === 'APPROVED'
              ? 'bg-blue-100'
              : 'bg-gray-100'
          }`}>
            <Icon className={`w-6 h-6 ${
              module.isEnabled && module.status === 'APPROVED'
                ? 'text-blue-600'
                : 'text-gray-400'
            }`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{module.name}</h3>
            <p className={`text-sm ${getModuleStatusColor(module.status)}`}>
              {getModuleStatusText(module.status)}
              {isPending && ' (Updating...)'}
            </p>
          </div>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <ToggleSwitch
            enabled={module.isEnabled}
            onChange={() => onToggle(!module.isEnabled)}
          />
        </div>
      </div>

      {module.isEnabled && module.status === 'APPROVED' && module.stats && (
      <div className="border-t pt-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
          <div>
              <p className="text-sm text-gray-500">Active Devices</p>
              <p className="text-2xl font-bold mt-1">
                {module.stats.activeDevices?.toLocaleString() || '0'}
              </p>
          </div>
          <div className="text-right">
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="text-sm font-medium mt-1">
                {module.stats.lastUpdated
                  ? new Date(module.stats.lastUpdated).toLocaleString()
                  : 'Never'}
              </p>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}