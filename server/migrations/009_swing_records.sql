-- 波段收益（跨日做T）：
-- 1) trades 增加 has_issue，标记该腿不参与当日自动撮合，等待跨日匹配
-- 2) stock_unmatched_legs 持久化尚未配对的买/卖腿，供之后任意天数后 FIFO 匹配
-- 3) stock_swing_records 存放跨日撮合成功后的波段收益明细
-- 4) stock_monthly_records 增加 swing_revenue 累计列

ALTER TABLE stock_trades ADD COLUMN IF NOT EXISTS has_issue BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE stock_monthly_records ADD COLUMN IF NOT EXISTS swing_revenue DOUBLE PRECISION NOT NULL DEFAULT 0;

-- 与 monthly_t_revenue 同样的用途：记录提交当天后，本月波段收益的最新累计值
ALTER TABLE stock_daily_logs ADD COLUMN IF NOT EXISTS monthly_swing_revenue DOUBLE PRECISION NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS stock_unmatched_legs (
  id BIGSERIAL PRIMARY KEY,
  daily_log_id BIGINT NOT NULL REFERENCES stock_daily_logs(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  stock TEXT NOT NULL,
  code TEXT NOT NULL,
  action TEXT NOT NULL,
  price DOUBLE PRECISION NOT NULL DEFAULT 0,
  remaining_shares DOUBLE PRECISION NOT NULL DEFAULT 0,
  total_shares DOUBLE PRECISION NOT NULL DEFAULT 0,
  total_fee DOUBLE PRECISION NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stock_unmatched_legs_code_remaining
  ON stock_unmatched_legs(code, remaining_shares);

CREATE TABLE IF NOT EXISTS stock_swing_records (
  id BIGSERIAL PRIMARY KEY,
  daily_log_id BIGINT NOT NULL REFERENCES stock_daily_logs(id) ON DELETE CASCADE,
  stock TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  buy_date TEXT NOT NULL DEFAULT '',
  sell_date TEXT NOT NULL DEFAULT '',
  gross_profit DOUBLE PRECISION NOT NULL DEFAULT 0,
  fee DOUBLE PRECISION NOT NULL DEFAULT 0,
  tax DOUBLE PRECISION NOT NULL DEFAULT 0,
  net_revenue DOUBLE PRECISION NOT NULL DEFAULT 0,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stock_swing_records_daily_log
  ON stock_swing_records(daily_log_id, display_order);
