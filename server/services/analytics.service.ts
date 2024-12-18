import pool from "../db";
import { SearchEvent, TimeRangeParams } from "../types";

export class AnalyticsService {
  async recordSearchEvent(event: SearchEvent) {
    // TODO we may get aisleNumber instead of aisleId
    // TODO in that case get it from db against that storew
    return pool.query(
      `INSERT INTO search_events (
				time, store_id, product_id, aisle_id, search_term,
				matched, session_id, user_agent
			) VALUES (NOW(), $1, $2, $3, $4, $5, $6, $7)`,
      [
        event.storeId,
        event.productId,
        event.aisleId,
        event.searchTerm,
        event.matched,
        event.sessionId,
        event.userAgent,
      ]
    );
  }

  async getStoreAnalytics(storeId: number, params: TimeRangeParams) {
    return pool.query(
      `SELECT
				time_bucket($1, time) AS bucket,
				COUNT(*) as total_searches,
				COUNT(*) FILTER (WHERE matched = true) as matched_searches,
				COUNT(*) FILTER (WHERE matched = false) as unmatched_searches
			FROM search_events
			WHERE store_id = $2
				AND time > $3
				AND time <= $4
			GROUP BY bucket
			ORDER BY bucket DESC`,
      [
        params.interval || "1 hour",
        storeId,
        params.startDate || "NOW() - INTERVAL '7 days'",
        params.endDate || "NOW()",
      ]
    );
  }

  async getTopProducts(storeId: number, params: TimeRangeParams) {
    const { rows } = await pool.query(
      `SELECT
        p.id,
        p.name,
        p.category,
        a.number as aisle_number,
        a.id as aisle_id,
        COUNT(*) as total_searches,
        COUNT(*) FILTER (WHERE matched = true) as matched_count,
        COUNT(*) FILTER (WHERE matched = false) as unmatched_count
      FROM search_events se
        JOIN products p ON se.product_id = p.id
        JOIN aisles a ON p.aisle_id = a.id
      WHERE se.store_id = $1
      --  AND se.time > COALESCE($2, NOW() - INTERVAL '30 days')
      --  AND se.time <= COALESCE($3, NOW())
      GROUP BY p.id, p.name, p.category, a.number, a.id
      ORDER BY total_searches DESC
      LIMIT 100`,
      [
        storeId,
        // params.startDate, // If null, will default to 'NOW() - INTERVAL 7 days'
        // params.endDate, // If null, will default to 'NOW()'
      ]
    );

    return rows;
  }

  async getAisleAnalytics(storeId: number, params: TimeRangeParams) {
    return pool.query(
      `SELECT
				a.id,
				a.number,
				a.name,
				a.category,
				COUNT(*) as total_searches,
				COUNT(*) FILTER (WHERE matched = true) as matched_searches
			FROM search_events se
			  JOIN aisles a ON se.aisle_id = a.id
			WHERE se.store_id = $1
				AND se.time > $2
				AND se.time <= $3
			GROUP BY a.id, a.number, a.name, a.category
			ORDER BY total_searches DESC`,
      [
        storeId,
        params.startDate || "NOW() - INTERVAL '7 days'",
        params.endDate || "NOW()",
      ]
    );
  }

  async getKeywordAnalytics(storeId: number, params: TimeRangeParams) {
    const { rows: searches } = await pool.query(
      `SELECT
				search_term,
				COUNT(*) as total_searches,
				COUNT(*) FILTER (WHERE matched = true) as matched_searches,
				(
          SELECT array_agg(DISTINCT name)
          FROM (
              SELECT DISTINCT p.name
              FROM search_events se2
              JOIN products p ON se2.product_id = p.id
              WHERE se2.search_term = se.search_term
              LIMIT 5
        ) top_products
    ) as related_products
			FROM search_events se
			  LEFT JOIN products p ON se.product_id = p.id
			WHERE se.store_id = $1
			--	AND se.time > $2
			--	AND se.time <= $3
			GROUP BY search_term
			ORDER BY total_searches DESC
			LIMIT 100`,
      [
        storeId,
        // params.startDate || "NOW() - INTERVAL '7 days'",
        // params.endDate || "NOW()",
      ]
    );

    return searches;
  }

  async getOrganizationTotalSearches(organizationId: number) {
    const { rows: stores } = await pool.query(
      "SELECT id FROM stores WHERE organization_id = $1",
      [organizationId]
    );

    const storeIds = stores.map((store) => store.id);

    const { rows } = await pool.query(
      "SELECT COUNT(*) FROM search_events WHERE store_id = ANY($1::uuid[])",
      [storeIds]
    );

    return rows[0].count; // Access the COUNT(*) result
  }

  async getStoreTotalSearches(storeId: number) {
    const { rows } = await pool.query(
      `SELECT
        COUNT(*) as total_searches,
        COUNT(*) FILTER (WHERE matched = false) as unmatched_count
        FROM search_events WHERE store_id = $1`,
      [storeId]
    );

    return rows[0]; // Access the COUNT(*) result
  }
}

export const analyticsService = new AnalyticsService();
