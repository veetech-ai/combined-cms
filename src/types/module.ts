export interface Module {
  id: string;
  name: string;
  isEnabled: boolean;
  stats?: {
    activeUsers: number;
    lastUpdated: string;
  };
}

export const DEFAULT_MODULES = [
  { id: 'venu', name: 'Venu (Video Menu)', isEnabled: false },
  { id: 'kiosk', name: 'Kiosk System', isEnabled: false },
  { id: 'kitchen', name: 'Kitchen Display', isEnabled: false },
  { id: 'rewards', name: 'Rewards Program', isEnabled: false }
];