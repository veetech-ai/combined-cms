import React from 'react';
import { Monitor, Store, Coffee, Gift } from 'lucide-react';
import ToggleSwitch from '../common/ToggleSwitch';
import { formatNumber, formatTimeAgo } from '../../utils/formatters';

const moduleIcons = {
  venue: Store,
  kiosk: Monitor,
  kitchen: Coffee,
  rewards: Gift,
};

interface ModuleCardProps {
  module: {
    id: string;
    name: string;
    isEnabled: boolean;
    stats: {
      activeUsers: number;
      lastUpdated: string;
    };
  };
  onToggle: (enabled: boolean) => void;
}

export function ModuleCard({ module, onToggle }: ModuleCardProps) {
  const Icon = moduleIcons[module.id as keyof typeof moduleIcons] || Store;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Icon size={24} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{module.name}</h3>
          </div>
        </div>
        <div 
          onClick={(e) => {
            e.stopPropagation();
            onToggle(!module.isEnabled);
          }}
        >
          <ToggleSwitch
            enabled={module.isEnabled}
            onChange={(enabled) => onToggle(enabled)}
            size="md"
          />
        </div>
      </div>

      <div className="border-t pt-4 mt-4">
        <div className="flex justify-between text-sm">
          <div>
            <p className="text-gray-500">Active Users</p>
            <p className="font-semibold mt-1">{formatNumber(module.stats.activeUsers)}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-500">Last Updated</p>
            <p className="font-semibold mt-1">{formatTimeAgo(module.stats.lastUpdated)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}