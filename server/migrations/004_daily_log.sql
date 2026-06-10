CREATE TABLE IF NOT EXISTS stock_daily_logs (
  id BIGSERIAL PRIMARY KEY,
  date TEXT NOT NULL UNIQUE,
  marker TEXT NOT NULL DEFAULT '',
  review_market TEXT NOT NULL DEFAULT '',
  review_feeling TEXT NOT NULL DEFAULT '',
  review_next_plan TEXT NOT NULL DEFAULT '',
  monthly_t_revenue DOUBLE PRECISION NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stock_daily_logs_date
  ON stock_daily_logs(date);

CREATE TABLE IF NOT EXISTS stock_trades (
  id BIGSERIAL PRIMARY KEY,
  daily_log_id BIGINT NOT NULL REFERENCES stock_daily_logs(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  stock TEXT NOT NULL,
  code TEXT NOT NULL,
  price DOUBLE PRECISION NOT NULL DEFAULT 0,
  shares DOUBLE PRECISION NOT NULL DEFAULT 0,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stock_trades_daily_log
  ON stock_trades(daily_log_id, display_order);

CREATE TABLE IF NOT EXISTS stock_t_records (
  id BIGSERIAL PRIMARY KEY,
  daily_log_id BIGINT NOT NULL REFERENCES stock_daily_logs(id) ON DELETE CASCADE,
  stock TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  gross_profit DOUBLE PRECISION NOT NULL DEFAULT 0,
  fee DOUBLE PRECISION NOT NULL DEFAULT 0,
  tax DOUBLE PRECISION NOT NULL DEFAULT 0,
  net_revenue DOUBLE PRECISION NOT NULL DEFAULT 0,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stock_t_records_daily_log
  ON stock_t_records(daily_log_id, display_order);
