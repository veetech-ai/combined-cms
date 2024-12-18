import { Store } from './store';
import { Module } from './module';
import { PosIntegration } from './pos';

export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  stores: Store[];
  modules: Module[]; // Customer-level modules
  primaryContact: {
    name: string;
    email: string;
    phone: string;
    role: string;
  };
  subscription: {
    plan: 'basic' | 'premium' | 'enterprise';
    status: 'active' | 'inactive' | 'pending';
    startDate: string;
    renewalDate: string;
  };
  posIntegration: PosIntegration; // Full POS integration details
  avatar: string;
  createdAt: string;
  updatedAt: string;
}