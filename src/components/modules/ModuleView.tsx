import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Module } from '../../types/module';
import ModuleDevices from './ModuleDevices';
import ModuleSettings from './ModuleSettings';
import ModuleStats from './ModuleStats';

interface ModuleViewProps {
  module: Module;
  onBack: () => void;
}

export default function ModuleView({ module, onBack }: ModuleViewProps) {
  return (
    <div>
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{module.name}</h1>
          <p className="text-gray-600">Module Management</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <ModuleStats moduleId={module.id} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ModuleDevices moduleId={module.id} />
        </div>
        <div>
          <ModuleSettings module={module} />
        </div>
      </div>
    </div>
  );
}