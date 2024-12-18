import React from 'react';
import { Module } from '../../types/module';
import ModulesList from '../customers/ModulesList';

interface StoreModulesProps {
  modules: Module[];
  onModuleToggle: (moduleId: string, enabled: boolean) => void;
}

export default function StoreModules({ modules, onModuleToggle }: StoreModulesProps) {
  return (
    <>
      <h3 className="font-medium text-gray-700 mb-4">Store Modules</h3>
      <ModulesList
        modules={modules}
        onToggle={onModuleToggle}
      />
    </>
  );
}