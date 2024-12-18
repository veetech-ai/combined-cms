import pool from "../db";

export const organizationService = {
  getOrganizations: async () => {
    return pool.query("SELECT * FROM organizations");
  },
};
