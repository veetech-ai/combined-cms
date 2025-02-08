// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL as string,
  STORE_ID: 'PSK40XM0M8ME1', // Using Clover merchant ID as store ID
  ENDPOINTS: {
    CUSTOMERS: {
      FIND_OR_CREATE: (storeId: string) =>
        `/store/${storeId}/customers/find-or-create`
    },
    ORDERS: {
      CREATE: (storeId: string) => `/store/${storeId}/orders`
    }
  }
};

// API Headers
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'x-fastn-api-key': 'e2ea1416-f354-4353-bbd1-5068969ce8b4',
  'x-fastn-space-id': '2cade1a6-133a-4344-86bf-c3b6f2bbfbe1',
  'x-fastn-space-tenantid': 'veetech_customer2'
};
