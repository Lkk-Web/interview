-- 未匹配腿软删除：增加 status 字段区分 pending（待匹配）和 matched（已完全消耗）
-- 之前是硬删除（DELETE），现在改成更新状态，保留历史记录便于审计和追溯。

ALTER TABLE stock_unmatched_legs ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending';

-- 为已有数据补齐 status（如果列是新加的，已有行会用 DEFAULT 值，但显式更新一次更清晰）
UPDATE stock_unmatched_legs SET status = 'pending' WHERE status = '';

-- 索引：查询未匹配腿时需要过滤 status='pending'，和 remaining_shares > 0 一起用
CREATE INDEX IF NOT EXISTS idx_stock_unmatched_legs_status_remaining
  ON stock_unmatched_legs(status, remaining_shares)
  WHERE status = 'pending' AND remaining_shares > 0;
