import pool from "../db";

export const aisleService = {
  getAislesByStoreId: async (storeId: number) => {
    const { rows: aisles } = await pool.query(
      "SELECT * FROM aisles where store_id = $1",
      [storeId]
    );

    return aisles;
  },
};
