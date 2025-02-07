// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api",
  VERSION: import.meta.env.VITE_API_VERSION || "/v1",
  ENDPOINTS: {
    // Auth
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH_TOKEN: "/auth/refresh-token",

    // Organizations
    ORGANIZATIONS: "/organizations",
    ORGANIZATION_BY_ID: (id: string) => `/organizations/${id}`,
    ORGANIZATION_ANALYTICS: (id: string) => `/organizations/${id}/analytics`,

    // Stores
    STORES: "/stores",
    STORE_BY_ID: (id: string) => `/stores/${id}`,
    STORE_ANALYTICS: (id: string) => `/stores/${id}/analytics`,
    STORE_SEARCH_ANALYTICS: (id: string) => `/stores/${id}/search-analytics`,
    STORES_BY_ORGANIZATION_ID: (organizationId: string) =>
      `/stores/organization/${organizationId}`,

    // Aisles
    AISLE_ANALYTICS: (storeId: string) => `/analytics/stores/${storeId}/aisles`,

    // Products
    PRODUCT_SEARCH_ANALYTICS: (storeId: string) =>
      `/analytics/stores/${storeId}/products/`,
  },
};
