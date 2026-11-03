import { useState, useEffect, useCallback } from 'react';
import { API_BASE } from '../../constants';
import type { AssetPoint, MonthlyRecord, OtherIncome, Position } from '../types';

export interface StockDataOptions {
  /** 后端 API base URL，默认读取全局 API_BASE */
  apiBase?: string;
  fallback: {
    assetHistory: AssetPoint[];
    positions: Position[];
    monthly: MonthlyRecord[];
    otherIncome: OtherIncome[];
  };
}

export interface StockData {
  assetHistory: AssetPoint[];
  positions: Position[];
  monthly: MonthlyRecord[];
  otherIncome: OtherIncome[];
  /** 重新拉取仪表盘数据，提交每日记录后调用以拿到最新持仓和收益。 */
  refresh: () => void;
}

async function fetchJSON<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } catch {
    return fallback;
  }
}

export function useStockData({ apiBase = API_BASE, fallback }: StockDataOptions): StockData {
  const [assetHistory, setAssetHistory] = useState<AssetPoint[]>(fallback.assetHistory);
  const [positions, setPositions] = useState<Position[]>(fallback.positions);
  const [monthly, setMonthly] = useState<MonthlyRecord[]>(fallback.monthly);
  const [otherIncome, setOtherIncome] = useState<OtherIncome[]>(fallback.otherIncome);

  const refresh = useCallback(() => {
    // 并发请求，各自到达各自更新，不互相阻塞
    fetchJSON(`${apiBase}/stock/asset-history`, fallback.assetHistory).then(setAssetHistory);
    fetchJSON(`${apiBase}/stock/positions`, fallback.positions).then(setPositions);
    fetchJSON(`${apiBase}/stock/monthly`, fallback.monthly).then(setMonthly);
    fetchJSON(`${apiBase}/stock/other-income`, fallback.otherIncome).then(setOtherIncome);
  }, [apiBase, fallback.assetHistory, fallback.monthly, fallback.otherIncome, fallback.positions]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { assetHistory, positions, monthly, otherIncome, refresh };
}
