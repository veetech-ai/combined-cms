import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Module } from '../../types/module';
import ModuleManagementView from '../modules/ModuleManagementView';

interface ModuleDetailsViewProps {
  module: Module;
  onBack: () => void;
  onToggle: (enabled: boolean) => void;
}

export default function ModuleDetailsView({ 
  module, 
  onBack,
  onToggle 
}: ModuleDetailsViewProps) {
  return (
    <ModuleManagementView
      module={module}
      onBack={onBack}
      onToggle={onToggle}
    />
  );
}