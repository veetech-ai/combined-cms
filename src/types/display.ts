export interface Display {
  id: string;
  name: string;
  hexCode: string;
  status: 'online' | 'offline';
  lastSeen: string;
  storeId: string;
  moduleId: string;
  createdAt: string;
  updatedAt: string;
  store: {
    id: string;
    name: string;
  };
  module: {
    id: string;
    name: string;
  };
} 