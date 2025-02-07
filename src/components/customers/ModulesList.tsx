import React from 'react';
import ToggleSwitch from '../common/ToggleSwitch';
import { Module } from '../../types/module';

interface ModulesListProps {
  modules: Module[];
  onToggle: (moduleId: string, enabled: boolean) => void;
}

export default function ModulesList({ modules, onToggle }: ModulesListProps) {
  if (!modules || modules.length === 0) {
    return <div className="text-gray-500">No modules available</div>;
  }

  return (
    <div className="space-y-2">
      {modules.map((module) => (
        <div key={module.id} className="flex items-center justify-between text-sm">
          <span className="text-gray-700">{module.name}</span>
          <div onClick={(e) => e.stopPropagation()}>
            <ToggleSwitch
              enabled={module.isEnabled}
              onChange={(enabled) => onToggle(module.id, enabled)}
              size="sm"
            />
          </div>
        </div>
      ))}
    </div>
  );
}