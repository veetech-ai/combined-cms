import { Module } from '../types/module';
import { Customer } from '../types/customer';

export interface DashboardStats {
  activeCustomers: number;
  modulesEnabled: number;
  posIntegrations: number;
  totalUsers: number;
}

export function calculateDashboardStats(customers: Customer[]): DashboardStats {
  return customers.reduce((stats, customer) => {
    // Count active customers
    if (customer.subscription.status === 'active') {
      stats.activeCustomers++;
    }

    // Count enabled modules across all stores
    customer.stores.forEach(store => {
      store.modules.forEach(module => {
        if (module.isEnabled) {
          stats.modulesEnabled++;
        }
      });
    });

    // Count active POS integrations
    if (customer.posIntegration.status === 'synced') {
      stats.posIntegrations++;
    }

    // Count total users (based on active modules' users)
    customer.stores.forEach(store => {
      store.modules.forEach(module => {
        if (module.isEnabled && module.stats?.activeUsers) {
          stats.totalUsers += module.stats.activeUsers;
        }
      });
    });

    return stats;
  }, {
    activeCustomers: 0,
    modulesEnabled: 0,
    posIntegrations: 0,
    totalUsers: 0
  });
}

export function calculateModuleStats(module: Module) {
  return {
    activeUsers: module.stats?.activeUsers || 0,
    activeDevices: module.stats?.activeDevices || 0,
    lastUpdated: module.stats?.lastUpdated || new Date().toISOString()
  };
}

export function calculateCustomerStats(customer: Customer) {
  const activeModules = customer.modules.filter(m => m.isEnabled);
  const totalActiveUsers = activeModules.reduce((sum, m) => sum + (m.stats?.activeUsers || 0), 0);
  const totalActiveDevices = activeModules.reduce((sum, m) => sum + (m.stats?.activeDevices || 0), 0);
  
  return {
    activeModules: activeModules.length,
    totalActiveUsers,
    totalActiveDevices,
    posStatus: customer.posIntegration.status
  };
}