export type PosProvider = 'Clover' | 'Square' | 'Toast' | 'Stripe' | 'None';

export type ConnectionStatus = 'synced' | 'disconnected' | 'error' | 'pending';

export interface PosCredentials {
  apiKey?: string;
  merchantId?: string;
  accessToken?: string;
  environment: 'sandbox' | 'production';
}

export interface PosConfiguration {
  webhookUrl: string;
  callbackUrl: string;
  settings: {
    autoSync?: boolean;
    syncInterval?: number;
    locationId?: string;
    syncInventory?: boolean;
    catalogSync?: boolean;
    restaurantId?: string;
    menuSync?: boolean;
    terminalEnabled?: boolean;
    autoCapture?: boolean;
  };
}

export interface PosIntegration {
  provider: PosProvider;
  status: ConnectionStatus;
  type: string;
  credentials?: PosCredentials;
  configuration: PosConfiguration;
  lastSync?: string;
  errorMessage?: string;
  connectedAt?: string;
}

export const DEFAULT_POS_CONFIG: PosConfiguration = {
  webhookUrl: '',
  callbackUrl: '',
  settings: {
    autoSync: false,
    syncInterval: 15,
    locationId: '',
    syncInventory: false,
    catalogSync: false,
    restaurantId: '',
    menuSync: false,
    terminalEnabled: false,
    autoCapture: true,
  },
};

export const DEFAULT_POS_INTEGRATION: PosIntegration = {
  provider: 'None',
  status: 'pending',
  type: 'None',
  configuration: DEFAULT_POS_CONFIG,
};