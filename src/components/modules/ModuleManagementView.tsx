import React, { useState } from 'react';
import { ArrowLeft, Monitor, Store, Coffee, Gift, Plus } from 'lucide-react';
import { Module } from '../../types/module';
import ToggleSwitch from '../common/ToggleSwitch';
import AddDeviceModal from './AddDeviceModal';

const moduleIcons = {
  venu: Monitor,
  kiosk: Store,
  kitchen: Coffee,
  rewards: Gift,
};

interface ModuleManagementViewProps {
  module: Module;
  onBack: () => void;
  onToggle: (enabled: boolean) => void;
}

export default function ModuleManagementView({ 
  module, 
  onBack,
  onToggle 
}: ModuleManagementViewProps) {
  const [isAddingDevice, setIsAddingDevice] = useState(false);
  const Icon = moduleIcons[module.id as keyof typeof moduleIcons] || Store;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Icon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{module.name}</h2>
              <p className="text-sm text-gray-500">Device Management</p>
            </div>
          </div>
        </div>
        <ToggleSwitch enabled={module.isEnabled} onChange={onToggle} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-medium text-gray-700 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => setIsAddingDevice(true)}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} />
              <span>Add New Device</span>
            </button>
            <button className="w-full px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              View Analytics
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-medium text-gray-700 mb-4">Connected Devices</h3>
          <div className="text-center py-8">
            <Monitor size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 mb-2">No devices connected</p>
            <p className="text-sm text-gray-400">Click "Add New Device" to get started</p>
          </div>
        </div>
      </div>

      <AddDeviceModal
        isOpen={isAddingDevice}
        onClose={() => setIsAddingDevice(false)}
        onAdd={(device) => {
          console.log('Adding device:', device);
          setIsAddingDevice(false);
        }}
      />
    </div>
  );
}