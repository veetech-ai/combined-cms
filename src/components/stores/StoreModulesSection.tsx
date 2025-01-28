import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Monitor, Store, Coffee, Gift } from 'lucide-react';
import { Module, ModuleStatus } from '../../types/module';
import ToggleSwitch from '../common/ToggleSwitch';
import { storeModuleService } from '../../services/storeModuleService';
import { toast } from 'react-hot-toast';

interface StoreModulesSectionProps {
  store: {
    id: string;
    name: string;
  };
  onModuleClick: (moduleId: string) => void;
}

const moduleIcons = {
  venu: Monitor,
  kiosk: Store,
  kitchen: Coffee,
  rewards: Gift,
  feedback: Gift,
  inventory: Store,
  analytics: Monitor
};

const moduleLabels = {
  venu: 'Digital Menu Board',
  kiosk: 'Kiosk System',
  kitchen: 'Order Display System',
  rewards: 'Rewards Program',
  feedback: 'Customer Feedback',
  inventory: 'Inventory Management',
  analytics: 'Analytics Dashboard'
};

const getModuleStatusColor = (status: ModuleStatus) => {
  switch (status) {
    case 'APPROVED':
      return 'text-green-600';
    case 'PENDING_APPROVAL':
      return 'text-yellow-600';
    case 'DISABLED':
      return 'text-gray-400';
    default:
      return 'text-gray-400';
  }
};

const getModuleStatusText = (status: ModuleStatus) => {
  switch (status) {
    case 'APPROVED':
      return 'Active';
    case 'PENDING_APPROVAL':
      return 'Pending Approval';
    case 'DISABLED':
      return 'Disabled';
    default:
      return 'Unknown';
  }
};

const StoreModulesSection: React.FC<StoreModulesSectionProps> = ({ store, onModuleClick }) => {
  const navigate = useNavigate();
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingToggles, setPendingToggles] = useState<Record<string, boolean>>({});
  const [lastToggleTime, setLastToggleTime] = useState<Record<string, number>>({});

  useEffect(() => {
    if (store.id) {
      loadStoreModules();
    }
  }, [store.id]);

  const loadStoreModules = async () => {
    try {
      const data = await storeModuleService.getStoreModules(store.id);
      setModules(data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load store modules');
    } finally {
      setIsLoading(false);
    }
  };

  const updateBackend = async (moduleId: string, newState: boolean) => {
    try {
      const response = await storeModuleService.updateModuleState(
        store.id,
        moduleId,
        newState
      );
      
      const transformedModule: Module = {
        id: response.module.id,
        name: response.module.name,
        key: response.module.key,
        isEnabled: response.isEnabled,
        status: response.status as ModuleStatus,
        stats: response.stats || undefined,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt
      };

      setModules(prevModules =>
        prevModules.map(m =>
          m.id === moduleId ? transformedModule : m
        )
      );
      
      setPendingToggles(prev => {
        const newPending = { ...prev };
        delete newPending[moduleId];
        return newPending;
      });
      
      toast.success(`Module ${newState ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      toast.error('Failed to update module state');
      
      setModules(prevModules =>
        prevModules.map(m =>
          m.id === moduleId ? { ...m, isEnabled: !newState } : m
        )
      );
      
      setPendingToggles(prev => {
        const newPending = { ...prev };
        delete newPending[moduleId];
        return newPending;
      });
    }
  };

  const handleToggle = async (moduleId: string, currentState: boolean) => {
    const now = Date.now();
    const lastToggle = lastToggleTime[moduleId] || 0;
    const timeSinceLastToggle = now - lastToggle;
    
    if (timeSinceLastToggle < 1000) {
      return;
    }
    
    const newState = !currentState;
    
    setLastToggleTime(prev => ({
      ...prev,
      [moduleId]: now
    }));
    
    setModules(prevModules =>
      prevModules.map(m =>
        m.id === moduleId ? { ...m, isEnabled: newState } : m
      )
    );
    
    setPendingToggles(prev => ({
      ...prev,
      [moduleId]: true
    }));
    
    setTimeout(() => {
      updateBackend(moduleId, newState);
    }, 500);
  };

  const handleInitialize = async () => {
    try {
      setIsLoading(true);
      await storeModuleService.initializeStoreModules(store.id);
      await loadStoreModules();
      toast.success('Store modules initialized successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to initialize store modules');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>;
  }

  if (!modules.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No modules found for this store.</p>
        <button
          onClick={handleInitialize}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Initialize Modules
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {modules.map((module) => {
        const Icon = moduleIcons[module.key as keyof typeof moduleIcons] || Store;
        const isPending = pendingToggles[module.id];

        return (
          <div
            key={module.id}
            className={`border border-gray-200 rounded-lg p-6 ${
              module.isEnabled 
                ? 'cursor-pointer hover:shadow-md transition-shadow'
                : ''
            }`}
            onClick={() =>
              module.isEnabled &&
              module.key === 'kiosk' &&
              navigate('/display-menus', { state: { store } })
            }
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div
                  className={`p-3 rounded-lg ${
                    module.isEnabled 
                      ? 'bg-blue-100'
                      : 'bg-gray-100'
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      module.isEnabled 
                        ? 'text-blue-600'
                        : 'text-gray-400'
                    }`}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {moduleLabels[module.key as keyof typeof moduleLabels] || module.name}
                  </h3>
                  <p className={`text-sm ${getModuleStatusColor(module.status)}`}>
                    {getModuleStatusText(module.status)}
                    {isPending && ' (Updating...)'}
                  </p>
                </div>
              </div>
              <div onClick={(e) => e.stopPropagation()}>
                <ToggleSwitch
                  enabled={module.isEnabled}
                  onChange={() => handleToggle(module.id, module.isEnabled)}
                />
              </div>
            </div>

            {module.isEnabled && module.stats && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50/50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700">
                    Active Devices
                  </h4>
                  <p className="text-2xl font-bold mt-1">
                    {module.stats.activeDevices?.toLocaleString() || '0'}
                  </p>
                </div>
                <div className="bg-gray-50/50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700">
                    Last Updated
                  </h4>
                  <p className="text-sm font-medium mt-1">
                    {module.stats.lastUpdated
                      ? new Date(module.stats.lastUpdated).toLocaleString()
                      : 'Never'}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StoreModulesSection;
