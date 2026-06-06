CREATE TABLE IF NOT EXISTS stock_asset_histories (
  id BIGSERIAL PRIMARY KEY,
  date TEXT NOT NULL UNIQUE,
  cash DOUBLE PRECISION NOT NULL DEFAULT 0,
  stock_value DOUBLE PRECISION NOT NULL DEFAULT 0,
  loan DOUBLE PRECISION NOT NULL DEFAULT 0,
  other DOUBLE PRECISION NOT NULL DEFAULT 0,
  remark TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stock_asset_histories_date
  ON stock_asset_histories(date);

CREATE TABLE IF NOT EXISTS stock_monthly_records (
  id BIGSERIAL PRIMARY KEY,
  month TEXT NOT NULL UNIQUE,
  t_target DOUBLE PRECISION NOT NULL DEFAULT 0,
  t_revenue DOUBLE PRECISION NOT NULL DEFAULT 0,
  remark TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stock_monthly_records_month
  ON stock_monthly_records(month);

CREATE TABLE IF NOT EXISTS stock_other_incomes (
  id BIGSERIAL PRIMARY KEY,
  date TEXT NOT NULL,
  amount DOUBLE PRECISION NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  remark TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stock_other_incomes_date
  ON stock_other_incomes(date);

CREATE TABLE IF NOT EXISTS stock_positions (
  id BIGSERIAL PRIMARY KEY,
  stock TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  cost DOUBLE PRECISION NOT NULL DEFAULT 0,
  shares DOUBLE PRECISION NOT NULL DEFAULT 0,
  remark TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stock_positions_active_order
  ON stock_positions(active, display_order, id);

CREATE TABLE IF NOT EXISTS stock_position_bases (
  id BIGSERIAL PRIMARY KEY,
  position_id BIGINT NOT NULL UNIQUE REFERENCES stock_positions(id) ON DELETE CASCADE,
  cost DOUBLE PRECISION NOT NULL DEFAULT 0,
  shares DOUBLE PRECISION NOT NULL DEFAULT 0,
  date TEXT,
  remark TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stock_position_targets (
  id BIGSERIAL PRIMARY KEY,
  position_id BIGINT NOT NULL REFERENCES stock_positions(id) ON DELETE CASCADE,
  cost DOUBLE PRECISION NOT NULL DEFAULT 0,
  price DOUBLE PRECISION NOT NULL DEFAULT 0,
  shares DOUBLE PRECISION NOT NULL DEFAULT 0,
  date TEXT,
  remark TEXT,
  status TEXT NOT NULL DEFAULT 'planned',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stock_position_targets_position_order
  ON stock_position_targets(position_id, display_order, id);
