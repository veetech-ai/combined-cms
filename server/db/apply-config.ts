import fs from "fs";
import path from "path";
import pool from ".";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  const client = await pool.connect();
  try {
    // Check if the materialized views already exist
    const checkViewsQuery = `
      SELECT matviewname
      FROM pg_matviews
      WHERE matviewname IN ('search_stats_hourly', 'search_stats_daily');`;

    const res = await client.query(checkViewsQuery);

    if (res.rows.length > 0) {
      console.log("Materialized views already exist. Skipping creation.");
    } else {
      const viewsSchemaPath = path.join(
        __dirname,
        "config",
        "materialized_views.sql"
      );
      const viewsSchemaSql = fs.readFileSync(viewsSchemaPath, "utf8");

      console.log("Creating materialized views...");
      // Split the SQL into individual statements and execute them separately
      const statements = viewsSchemaSql
        .split(";")
        .filter((stmt) => stmt.trim().length > 0);

      for (const statement of statements) {
        await client.query(statement);
      }

      console.log("Materialized views created successfully.");
    }

    // Attempt to add the continuous aggregate policies
    const addPolicyQuery = `
      SELECT add_continuous_aggregate_policy('search_stats_hourly',
        start_offset => INTERVAL '1 day',
        end_offset => INTERVAL '1 hour',
        schedule_interval => INTERVAL '1 hour')
    `;

    // Try to add policy for hourly stats, catch error if already exists
    try {
      await client.query(addPolicyQuery);
      console.log(
        "Continuous aggregate policy for 'search_stats_hourly' added successfully."
      );
    } catch (err) {
      if (err.code === "42710") {
        console.log(
          "Continuous aggregate policy for 'search_stats_hourly' already exists."
        );
      } else {
        throw err; // Rethrow if the error is not related to existing policy
      }
    }

    const addDailyPolicyQuery = `
      SELECT add_continuous_aggregate_policy('search_stats_daily',
        start_offset => INTERVAL '1 week',
        end_offset => INTERVAL '1 day',
        schedule_interval => INTERVAL '1 day')
    `;

    // Try to add policy for daily stats, catch error if already exists
    try {
      await client.query(addDailyPolicyQuery);
      console.log(
        "Continuous aggregate policy for 'search_stats_daily' added successfully."
      );
    } catch (err) {
      if (err.code === "42710") {
        console.log(
          "Continuous aggregate policy for 'search_stats_daily' already exists."
        );
      } else {
        throw err; // Rethrow if the error is not related to existing policy
      }
    }
  } catch (err) {
    console.error("Error running migrations:", err);
    throw err;
  } finally {
    client.release();
  }
}

runMigrations().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
