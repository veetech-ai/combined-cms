import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Monitor, Store, Coffee, Gift } from 'lucide-react';
import { Module, ModuleStatus } from '../../types/module';
import ToggleSwitch from '../common/ToggleSwitch';
import { storeModuleService } from '../../services/storeModuleService';
import { toast, Toaster } from 'react-hot-toast';
import { displayService } from '../../services/displayService';

interface StoreModulesSectionProps {
  store: {
    id: string;
    name: string;
  };
  onModuleClick: (moduleId: string) => void;
}

// Define the order of modules
const moduleOrder = [
  'venu',      // Digital Menu Board
  'kiosk',     // Kiosk System
  'kitchen',   // Order Display System
  'rewards',   // Rewards Program
  'feedback',  // Customer Feedback
  'inventory', // Inventory Management
  'analytics'  // Analytics Dashboard
];

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
  const [kioskActiveDevices, setKioskActiveDevices] = useState<number>(0);

  useEffect(() => {
    if (store.id) {
      loadStoreModules();
      loadKioskDevices();
    }
  }, [store.id]);

  const loadKioskDevices = async () => {
    try {
      const data = await displayService.getDisplays();
      // Count only online displays for this store
      const activeDisplays = data.filter(
        display => display.store === store.name && display.status === 'Online'
      ).length;
      setKioskActiveDevices(activeDisplays);
    } catch (error) {
      console.error('Failed to load kiosk devices:', error);
    }
  };

  const loadStoreModules = async () => {
    try {
      const data = await storeModuleService.getStoreModules(store.id);
      // Sort modules based on the defined order
      const sortedModules = [...data].sort((a, b) => {
        const indexA = moduleOrder.indexOf(a.key);
        const indexB = moduleOrder.indexOf(b.key);
        // If module key not found in order, put it at the end
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });
      setModules(sortedModules);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load store modules');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (moduleId: string, currentState: boolean) => {
    const now = Date.now();
    const lastToggle = lastToggleTime[moduleId] || 0;
    const timeSinceLastToggle = now - lastToggle;
    
    if (timeSinceLastToggle < 1000 || pendingToggles[moduleId]) {
      return;
    }
    
    const newState = !currentState;
    
    setLastToggleTime(prev => ({
      ...prev,
      [moduleId]: now
    }));
    
    setPendingToggles(prev => ({
      ...prev,
      [moduleId]: true
    }));

    try {
      await storeModuleService.updateModuleState(
        store.id,
        moduleId,
        newState
      );
      
      // Reload all modules to get the latest state
      await loadStoreModules();
      
      toast.success(`Module ${newState ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      // Revert the UI state on error
      setModules(prevModules =>
        prevModules.map(m =>
          m.id === moduleId ? { ...m, isEnabled: currentState } : m
        )
      );
      
      toast.error('Failed to update module state');
    } finally {
      setPendingToggles(prev => {
        const newPending = { ...prev };
        delete newPending[moduleId];
        return newPending;
      });
    }
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

        // Get active devices count based on module type
        const activeDevices = module.key === 'kiosk' 
          ? kioskActiveDevices 
          : module.stats?.activeDevices || 0;

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

            {module.isEnabled && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50/50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700">
                    Active Devices
                  </h4>
                  <p className="text-2xl font-bold mt-1">
                    {activeDevices.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50/50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700">
                    Last Updated
                  </h4>
                  <p className="text-sm font-medium mt-1">
                    {module.stats?.lastUpdated
                      ? new Date(module.stats.lastUpdated).toLocaleString()
                      : 'Never'}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <Toaster />
    </div>
  );
};

export default StoreModulesSection;
