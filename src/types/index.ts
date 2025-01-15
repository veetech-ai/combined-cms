export interface Module {
  id: string;
  name: string;
  isEnabled: boolean;
}

export interface Store {
  id: string;
  name: string;
  modules: Module[];
}

export interface Organization {
  id: string;
  name: string;
  company: string;
  modules: Module[];
  stores: Store[];
}

export interface Customer extends Organization {
  posIntegration?: {
    type: string;
    settings: Record<string, any>;
  };
} 