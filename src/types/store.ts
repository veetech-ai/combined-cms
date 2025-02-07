import { Module } from './module';
import { Organization } from './organization';

export interface Store {
  id: string;
  name: string;
  location: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  modules: Module[];
  operatingHours: {
    [key: string]: {
      open: string;
      close: string;
    } | null;
  };
  organizationId: string;
  organization?: {
    id: string;
    name: string;
  };
}