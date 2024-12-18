-- Enable TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Create hypertable for search events
SELECT create_hypertable('search_events', 'time', if_not_exists => TRUE);

-- Continuous Aggregates for real-time analytics
CREATE MATERIALIZED VIEW IF NOT EXISTS search_stats_hourly
WITH (timescaledb.continuous) AS
SELECT
  time_bucket('1 hour', time) AS bucket,
  store_id,
  COUNT(*) as total_searches,
  COUNT(*) FILTER (WHERE matched = true) as matched_searches,
  COUNT(*) FILTER (WHERE matched = false) as unmatched_searches
FROM search_events
GROUP BY bucket, store_id;


-- Daily aggregates
CREATE MATERIALIZED VIEW IF NOT EXISTS search_stats_daily
WITH (timescaledb.continuous) AS
SELECT
  time_bucket('1 day', time) AS bucket,
  store_id,
  product_id,
  aisle_id,
  COUNT(*) as total_searches,
  COUNT(*) FILTER (WHERE matched = true) as matched_searches
FROM search_events
GROUP BY bucket, store_id, product_id, aisle_id;
