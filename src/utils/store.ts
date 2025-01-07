import { Store } from '../types/store';
import { DEFAULT_MODULES } from '../types/module';

export const createDefaultStore = (): Omit<Store, 'id'> => ({
  name: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  phone: '',
  modules: DEFAULT_MODULES.map(module => ({
    ...module,
    stats: {
      activeUsers: 0,
      activeDevices: 0,
      lastUpdated: new Date().toISOString()
    }
  })),
  operatingHours: {
    monday: { open: '09:00', close: '17:00' },
    tuesday: { open: '09:00', close: '17:00' },
    wednesday: { open: '09:00', close: '17:00' },
    thursday: { open: '09:00', close: '17:00' },
    friday: { open: '09:00', close: '17:00' },
    saturday: null,
    sunday: null,
  },
});