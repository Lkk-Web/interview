import { useEffect, useState } from 'react';
import { API_BASE } from '../../constants';

export interface PositionSnapshotItem {
  stock: string;
  code: string;
  shares: number;
  /** 当日收盘价，早期记录没有填写时为 0（那些日期不展示仓位占比，避免算出误导性的 0%） */
  price: number;
}

/**
 * 拉取所有"当天确实提交过持仓更新"的日期明细（date -> positions），
 * 供资产曲线 tooltip 使用：只有这些日期才在"股票"那一行后面追加持仓明细，
 * 提示当天发生了真实的持仓变动（买入/卖出/建仓）。
 */
export function usePositionSnapshots(): Record<string, PositionSnapshotItem[]> {
  const [snapshots, setSnapshots] = useState<Record<string, PositionSnapshotItem[]>>({});

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}/stock/position-snapshots`)
      .then((res) => (res.ok ? res.json() : {}))
      .then((data) => {
        if (!cancelled) setSnapshots(data || {});
      })
      .catch(() => {
        if (!cancelled) setSnapshots({});
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return snapshots;
}
