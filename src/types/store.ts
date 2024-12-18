import { Module } from './module';

export interface OperatingHours {
  [key: string]: { open: string; close: string } | null;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  modules: Module[];
  operatingHours: OperatingHours;
}