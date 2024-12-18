import React from 'react';
import { ArrowLeft, Monitor, Store, Coffee, Gift } from 'lucide-react';
import { Module } from '../../types/module';
import ToggleSwitch from '../common/ToggleSwitch';

const moduleIcons = {
  venu: Monitor,
  kiosk: Store,
  kitchen: Coffee,
  rewards: Gift,
};

interface EnabledModuleViewProps {
  module: Module;
  onBack: () => void;
  onToggle: (enabled: boolean) => void;
}

export default function EnabledModuleView({ module, onBack, onToggle }: EnabledModuleViewProps) {
  const Icon = moduleIcons[module.id as keyof typeof moduleIcons] || Store;

  const renderModuleContent = () => {
    switch (module.id) {
      case 'venu':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-1">Active Menu Boards</h4>
                <p className="text-2xl font-bold">3</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-1">Menu Items</h4>
                <p className="text-2xl font-bold">127</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-1">Categories</h4>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>

            <div className="space-y-4">
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Manage Menu Content
              </button>
              <button className="w-full px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Configure Display Settings
              </button>
            </div>
          </div>
        );

      case 'kiosk':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-1">Active Kiosks</h4>
                <p className="text-2xl font-bold">2</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-1">Today's Orders</h4>
                <p className="text-2xl font-bold">45</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-1">Average Order Value</h4>
                <p className="text-2xl font-bold">$24.50</p>
              </div>
            </div>

            <div className="space-y-4">
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                View Orders Dashboard
              </button>
              <button className="w-full px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Kiosk Settings
              </button>
            </div>
          </div>
        );

      case 'kitchen':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-1">Active Displays</h4>
                <p className="text-2xl font-bold">4</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-1">Orders in Queue</h4>
                <p className="text-2xl font-bold">12</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-1">Avg. Prep Time</h4>
                <p className="text-2xl font-bold">8m</p>
              </div>
            </div>

            <div className="space-y-4">
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Open Kitchen Dashboard
              </button>
              <button className="w-full px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Display Settings
              </button>
            </div>
          </div>
        );

      case 'rewards':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-1">Active Members</h4>
                <p className="text-2xl font-bold">1,234</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-1">Points Issued Today</h4>
                <p className="text-2xl font-bold">5,678</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-1">Redemptions Today</h4>
                <p className="text-2xl font-bold">89</p>
              </div>
            </div>

            <div className="space-y-4">
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Manage Rewards Program
              </button>
              <button className="w-full px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Configure Rules
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

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
            <h2 className="text-xl font-semibold">{module.name}</h2>
          </div>
        </div>
        <ToggleSwitch enabled={module.isEnabled} onChange={onToggle} />
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        {renderModuleContent()}
      </div>
    </div>
  );
}