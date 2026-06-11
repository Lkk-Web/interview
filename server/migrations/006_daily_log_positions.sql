CREATE TABLE IF NOT EXISTS stock_daily_log_positions (
  id BIGSERIAL PRIMARY KEY,
  daily_log_id BIGINT NOT NULL REFERENCES stock_daily_logs(id) ON DELETE CASCADE,
  stock TEXT NOT NULL,
  code  TEXT NOT NULL DEFAULT '',
  cost  DOUBLE PRECISION NOT NULL DEFAULT 0,
  shares DOUBLE PRECISION NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_stock_daily_log_positions_log
  ON stock_daily_log_positions(daily_log_id);
