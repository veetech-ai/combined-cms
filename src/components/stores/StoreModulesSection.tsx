import React from 'react';
import { Monitor, Store, Coffee, Gift } from 'lucide-react';
import { Module } from '../../types/module';
import ToggleSwitch from '../common/ToggleSwitch';

interface StoreModulesSectionProps {
  modules: Module[];
  onModuleToggle: (moduleId: string, enabled: boolean) => void;
  onModuleClick: (moduleId: string) => void;
}

const moduleIcons = {
  venu: Monitor,
  kiosk: Store,
  kitchen: Coffee,
  rewards: Gift,
};

const moduleLabels = {
  venu: 'Venu (Digital Menu)',
  kiosk: 'Kiosk System',
  kitchen: 'Kitchen Display',
  rewards: 'Rewards Program',
};

export default function StoreModulesSection({ 
  modules, 
  onModuleToggle,
  onModuleClick 
}: StoreModulesSectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((module) => {
          const Icon = moduleIcons[module.id as keyof typeof moduleIcons] || Store;
          
          return (
            <div 
              key={module.id}
              className={`border border-gray-200 rounded-lg p-6 ${
                module.isEnabled ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
              }`}
              onClick={() => module.isEnabled && onModuleClick(module.id)}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg ${
                    module.isEnabled ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      module.isEnabled ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {moduleLabels[module.id as keyof typeof moduleLabels]}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {module.isEnabled ? 'Click to manage devices' : 'Module disabled'}
                    </p>
                  </div>
                </div>
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    onModuleToggle(module.id, !module.isEnabled);
                  }}
                >
                  <ToggleSwitch
                    enabled={module.isEnabled}
                    onChange={(enabled) => onModuleToggle(module.id, enabled)}
                  />
                </div>
              </div>

              {module.isEnabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50/50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700">Active Devices</h4>
                    <p className="text-2xl font-bold mt-1">
                      {module.stats?.activeDevices?.toLocaleString() || '0'}
                    </p>
                  </div>
                  <div className="bg-gray-50/50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700">Last Updated</h4>
                    <p className="text-sm font-medium mt-1">
                      {module.stats?.lastUpdated 
                        ? new Date(module.stats.lastUpdated).toLocaleString() 
                        : 'Never'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}