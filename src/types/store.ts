import { Module } from './module';
import { Organization } from './organization';

export interface Store {
  id: string;
  name: string;
  location: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  modules: any[]; // Replace 'any' with your Module type if available
  operatingHours: {
    [key: string]: { open: string; close: string } | null;
  };
}