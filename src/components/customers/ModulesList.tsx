import React, { useEffect, useState } from 'react';
import { storeModuleService } from '../../services/storeModuleService';
import ToggleSwitch from '../common/ToggleSwitch';
import { Module } from '../../types/module';
import { toast, Toaster } from 'react-hot-toast';

interface ModulesListProps {
  modules: Module[];
  onToggle: (moduleId: string, enabled: boolean) => void;
}

export default function ModulesList({
  store
}: // modules,
// onToggle
ModulesListProps) {
  const [modules, setModules] = useState<Module[]>([]);
  const [pendingToggles, setPendingToggles] = useState<Record<string, boolean>>(
    {}
  );
  const [lastToggleTime, setLastToggleTime] = useState<Record<string, number>>(
    {}
  );

  useEffect(() => {
    if (store.id) {
      loadStoreModules();
    }
  }, [store.id]);

  const loadStoreModules = async () => {
    try {
      const data = await storeModuleService.getStoreModules(store.id);
      console.log(data);
      setModules(data);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Failed to load store modules'
      );
    }
  };

  const handleToggle = async (moduleId: string, currentState: boolean) => {
    // Prevent rapid clicking and concurrent toggles
    const now = Date.now();
    const lastToggle = lastToggleTime[moduleId] || 0;
    const timeSinceLastToggle = now - lastToggle;

    if (timeSinceLastToggle < 1000 || pendingToggles[moduleId]) {
      return;
    }

    const newState = !currentState;

    // Find the current module
    const currentModule = modules.find((m) => m.id === moduleId);
    if (!currentModule) {
      toast.error('Module not found');
      return;
    }

    try {
      // Set pending state first
      setPendingToggles((prev) => ({ ...prev, [moduleId]: true }));
      setLastToggleTime((prev) => ({ ...prev, [moduleId]: now }));

      // Make API call first
      const response = await storeModuleService.updateModuleState(
        store.id,
        moduleId,
        newState
      );

      // Update modules state with response
      setModules((prevModules) =>
        prevModules.map((m) =>
          m.id === moduleId
            ? {
                ...m,
                isEnabled: newState, // Use the response value
                status: response.status as ModuleStatus,
                stats: response.stats || undefined,
                updatedAt: response.updatedAt
              }
            : m
        )
      );

      toast.success(`Module ${newState ? 'enabled' : 'disabled'} successfully`);
    } catch (error: any) {
      // Revert to previous state on error
      toast.error(
        error.response?.data?.message || 'Failed to update module state'
      );
    } finally {
      // Clear pending state
      setPendingToggles((prev) => {
        const newPending = { ...prev };
        delete newPending[moduleId];
        return newPending;
      });
    }
  };
  if (!modules || modules.length === 0) {
    return <div className="text-gray-500">No modules available</div>;
  }

  return (
    <div className="space-y-2">
      {modules.map((module) => (
        <div
          key={module.id}
          className="flex items-center justify-between text-sm"
        >
          <span className="text-gray-700">{module.name}</span>
          <div onClick={(e) => e.stopPropagation()}>
            <ToggleSwitch
              enabled={module.isEnabled}
              onChange={() => handleToggle(module.id, module.isEnabled)}
              size="sm"
            />
          </div>
        </div>
      ))}

      <Toaster />
    </div>
  );
}
