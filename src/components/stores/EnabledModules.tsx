import React from 'react';
import { Monitor, Store, Coffee, Gift } from 'lucide-react';
import { Module } from '../../types/module';

const moduleConfigs = {
  venu: {
    icon: Monitor,
    title: 'Venu (Video Menu)',
    description: 'Digital menu display system',
    component: VenuModule
  },
  kiosk: {
    icon: Store,
    title: 'Kiosk System',
    description: 'Self-service ordering kiosk',
    component: KioskModule
  },
  kitchen: {
    icon: Coffee,
    title: 'Kitchen Display',
    description: 'Order management system for kitchen staff',
    component: KitchenModule
  },
  rewards: {
    icon: Gift,
    title: 'Rewards Program',
    description: 'Customer loyalty and rewards system',
    component: RewardsModule
  }
};

interface EnabledModulesProps {
  module: Module;
}

export default function EnabledModules({ module }: EnabledModulesProps) {
  const config = moduleConfigs[module.id as keyof typeof moduleConfigs];
  if (!config) return null;

  const { icon: Icon, title, description, component: ModuleComponent } = config;

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
      </div>
      <div className="p-6">
        <ModuleComponent />
      </div>
    </div>
  );
}

function VenuModule() {
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
}

function KioskModule() {
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
}

function KitchenModule() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-sm mb-2">Active Displays</h4>
          <p className="text-2xl font-bold">4</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-sm mb-2">Orders in Queue</h4>
          <p className="text-2xl font-bold">12</p>
        </div>
      </div>
      <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        View Kitchen Dashboard
      </button>
    </div>
  );
}

function RewardsModule() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-sm mb-2">Active Members</h4>
          <p className="text-2xl font-bold">1,234</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-sm mb-2">Points Issued Today</h4>
          <p className="text-2xl font-bold">5,678</p>
        </div>
      </div>
      <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        Manage Rewards Program
      </button>
    </div>
  );
}