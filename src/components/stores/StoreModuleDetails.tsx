import React from 'react';
import { Module } from '../../types/module';

interface StoreModuleDetailsProps {
  module: Module;
}

export default function StoreModuleDetails({ module }: StoreModuleDetailsProps) {
  if (!module.isEnabled) return null;

  const renderModuleContent = () => {
    switch (module.id) {
      case 'venu':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Active Menu Boards</h4>
                <p className="text-2xl font-bold">3</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Menu Items</h4>
                <p className="text-2xl font-bold">127</p>
              </div>
            </div>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Manage Menu Content
            </button>
          </div>
        );

      case 'kiosk':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Active Kiosks</h4>
                <p className="text-2xl font-bold">2</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Today's Orders</h4>
                <p className="text-2xl font-bold">45</p>
              </div>
            </div>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Manage Kiosk Settings
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mt-4">
      {renderModuleContent()}
    </div>
  );
}