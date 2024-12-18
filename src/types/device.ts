export interface Device {
  id: string;
  name: string;
  type: 'menu-board' | 'kiosk' | 'kitchen-display' | 'tablet';
  status: 'online' | 'offline' | 'maintenance';
  lastSeen: string;
  moduleId: string;
  storeId: string;
  settings: {
    displayName: string;
    location: string;
    orientation: 'landscape' | 'portrait';
    autoUpdate: boolean;
    [key: string]: any;
  };
}

export interface DeviceStats {
  totalDevices: number;
  activeDevices: number;
  offlineDevices: number;
  lastSync: string;
}