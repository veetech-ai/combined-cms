// services/store.service.ts
import pool from "../db";

export const storeService = {
  getStores: async () => {
    const { rows: stores } = await pool.query("SELECT * FROM stores");
    return stores;
  },

  getStoreById: async (id: number) => {
    const {
      rows: [store],
    } = await pool.query("SELECT * FROM stores WHERE id = $1", [id]);
    return store;
  },

  getStoreAnalytics: async (id: number) => {
    const { rows: analytics } = await pool.query(
      "SELECT * FROM search_events WHERE store_id = $1",
      [id]
    );
    return analytics;
  },

  getStoreCount: async () => {
    const {
      rows: [count],
    } = await pool.query("SELECT COUNT(*) FROM stores");
    return count.count;
  },

  getStoreCountByOrganization: async (organizationId: number) => {
    const {
      rows: [count],
    } = await pool.query(
      "SELECT COUNT(*) FROM stores WHERE organization_id = $1",
      [organizationId]
    );
    return count.count;
  },

  getStoresByOrganizationId: async (organizationId: number) => {
    const { rows: stores } = await pool.query(
      "SELECT * FROM stores WHERE organization_id = $1",
      [organizationId]
    );
    return stores;
  },
};
