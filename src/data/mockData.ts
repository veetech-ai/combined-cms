import { Customer } from '../types/customer';
import { DEFAULT_MODULES } from '../types/module';
import { DEFAULT_POS_INTEGRATION } from '../types/pos';

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    company: 'Tech Solutions Inc',
    phone: '(555) 123-4567',
    billingAddress: {
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'USA'
    },
    stores: [
      {
        id: 'store1',
        name: 'Downtown Location',
        address: '456 Market St',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        phone: '(555) 987-6543',
        modules: DEFAULT_MODULES.map(m => ({ ...m, isEnabled: false })),
        operatingHours: {
          monday: { open: '09:00', close: '21:00' },
          tuesday: { open: '09:00', close: '21:00' },
          wednesday: { open: '09:00', close: '21:00' },
          thursday: { open: '09:00', close: '21:00' },
          friday: { open: '09:00', close: '22:00' },
          saturday: { open: '10:00', close: '22:00' },
          sunday: { open: '10:00', close: '20:00' }
        }
      }
    ],
    modules: DEFAULT_MODULES.map(m => ({ ...m, isEnabled: false })),
    primaryContact: {
      name: 'John Smith',
      email: 'john@example.com',
      phone: '(555) 123-4567',
      role: 'Owner'
    },
    subscription: {
      plan: 'premium',
      status: 'active',
      startDate: '2024-01-01T00:00:00Z',
      renewalDate: '2025-01-01T00:00:00Z'
    },
    posIntegration: {
      ...DEFAULT_POS_INTEGRATION,
      provider: 'Clover',
      type: 'Clover',
      status: 'synced',
      lastSync: '2024-03-15T00:00:00Z',
      connectedAt: '2024-01-01T00:00:00Z'
    },
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=faces',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z'
  }
];