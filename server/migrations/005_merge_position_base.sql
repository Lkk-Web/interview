-- 把 stock_position_bases 的字段合并到 stock_positions，消除不必要的 1:1 关联表
ALTER TABLE stock_positions
  ADD COLUMN IF NOT EXISTS base_cost   DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS base_shares DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS base_date   TEXT,
  ADD COLUMN IF NOT EXISTS base_remark TEXT;

-- 把已有的 base 数据迁移过去
UPDATE stock_positions p
SET
  base_cost   = b.cost,
  base_shares = b.shares,
  base_date   = b.date,
  base_remark = b.remark
FROM stock_position_bases b
WHERE b.position_id = p.id;

DROP TABLE IF EXISTS stock_position_bases;
