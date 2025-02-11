export type ModuleStatus = 'DISABLED' | 'PENDING_APPROVAL' | 'APPROVED';

export interface ModuleStats {
  activeDevices: number;
  activeUsers: number;
  lastUpdated: string;
}

export interface Module {
  id: string;
  moduleId: string;
  name: string;
  key: string;
  isEnabled: boolean;
  status: ModuleStatus;
  stats?: ModuleStats;
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_MODULES: Array<Pick<Module, 'key' | 'name'>> = [
  { key: 'venu', name: 'Venu (Digital Menu)' },
  { key: 'kiosk', name: 'Kiosk System' },
  { key: 'kitchen', name: 'Kitchen Display' },
  { key: 'rewards', name: 'Rewards Program' }
];
