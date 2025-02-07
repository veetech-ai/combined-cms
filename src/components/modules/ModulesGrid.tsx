import React, { useState, useEffect } from 'react';
import { Store } from '../../types/store';
import { Module, ModuleStatus } from '../../types/module';
import { ModuleCard } from './ModuleCard';
import { storeModuleService } from '../../services/storeModuleService';
import { toast } from 'react-hot-toast';
import apiClient from '../../services/apiClient';
import { API_CONFIG } from '../../config/api';

export default function ModulesGrid() {
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string>('');
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoadingStores, setIsLoadingStores] = useState(true);
  const [isLoadingModules, setIsLoadingModules] = useState(false);
  const [pendingToggles, setPendingToggles] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadStores();
  }, []);

  useEffect(() => {
    if (selectedStoreId) {
      loadStoreModules(selectedStoreId);
    }
  }, [selectedStoreId]);

  const loadStores = async () => {
    try {
      setIsLoadingStores(true);
      const { data } = await apiClient.get<{ stores: Store[] }>(API_CONFIG.ENDPOINTS.STORES);
      setStores(data.stores || []);
      if (data.stores?.length > 0) {
        setSelectedStoreId(data.stores[0].id);
      }
    } catch (error: any) {
      toast.error('Failed to load stores');
    } finally {
      setIsLoadingStores(false);
    }
  };

  const loadStoreModules = async (storeId: string) => {
    try {
      setIsLoadingModules(true);
      const data = await storeModuleService.getStoreModules(storeId);
      setModules(data);
    } catch (error: any) {
      toast.error('Failed to load store modules');
      setModules([]);
    } finally {
      setIsLoadingModules(false);
    }
  };

  const handleModuleToggle = async (moduleId: string, enabled: boolean) => {
    if (!selectedStoreId || pendingToggles[moduleId]) return;

    setPendingToggles(prev => ({
      ...prev,
      [moduleId]: true
    }));

    try {
      const response = await storeModuleService.updateModuleState(
        selectedStoreId,
        moduleId,
        enabled
      );

      setModules(prevModules =>
        prevModules.map(m =>
          m.id === moduleId
            ? {
                ...m,
                isEnabled: response.isEnabled,
                status: response.status as ModuleStatus,
                stats: response.stats || undefined
              }
            : m
        )
      );

      toast.success(`Module ${enabled ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      toast.error('Failed to update module state');
      setModules(prevModules =>
        prevModules.map(m =>
          m.id === moduleId ? { ...m, isEnabled: !enabled } : m
        )
      );
    } finally {
      setPendingToggles(prev => {
        const newPending = { ...prev };
        delete newPending[moduleId];
        return newPending;
      });
    }
  };

  if (isLoadingStores) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stores || stores.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-center">
        <p className="text-gray-500">No stores found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Store
        </label>
        <select
          value={selectedStoreId}
          onChange={(e) => setSelectedStoreId(e.target.value)}
          className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          {stores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))}
        </select>
      </div>

      {isLoadingModules ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            onToggle={(enabled) => handleModuleToggle(module.id, enabled)}
            isPending={pendingToggles[module.id]}
          />
        ))}
      </div>
      )}
    </div>
  );
}