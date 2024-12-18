import React from 'react';
import { Monitor, Store, Coffee, Gift } from 'lucide-react';
import ToggleSwitch from '../common/ToggleSwitch';
import { Module } from '../../types/module';

const moduleIcons = {
  venu: Monitor,
  kiosk: Store,
  kitchen: Coffee,
  rewards: Gift,
};

interface StoreModuleCardProps {
  module: Module;
  onToggle: (enabled: boolean) => void;
  onClick: () => void;
}

export default function StoreModuleCard({ module, onToggle, onClick }: StoreModuleCardProps) {
  const Icon = moduleIcons[module.id as keyof typeof moduleIcons] || Store;

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm p-6 ${
        module.isEnabled ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${module.isEnabled ? 'bg-blue-100' : 'bg-gray-100'}`}>
            <Icon 
              className={`w-6 h-6 ${module.isEnabled ? 'text-blue-600' : 'text-gray-500'}`}
            />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{module.name}</h3>
            {module.stats && (
              <p className="text-sm text-gray-500">
                {module.stats.activeUsers.toLocaleString()} active users
              </p>
            )}
          </div>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <ToggleSwitch 
            enabled={module.isEnabled} 
            onChange={onToggle}
          />
        </div>
      </div>
    </div>
  );
}