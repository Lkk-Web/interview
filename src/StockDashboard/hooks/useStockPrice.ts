import { useState, useEffect, useCallback } from 'react';
import type { Position, PositionWithPrice } from '../types';

/**
 * 通过腾讯行情接口获取实时股价
 * 接口：https://qt.gtimg.cn/q=sz000516,sh600860
 * 返回格式：v_sz000516="1~国际医学~000516~4.57~4.59~4.60~...";
 * 第 3 个字段是当前价格
 */

export function fetchStockPrices(codes: string[]): Promise<Record<string, number>> {
  return new Promise((resolve, reject) => {
    const callbackName = `stock_cb_${Date.now()}`;
    const script = document.createElement('script');
    const codesStr = codes.join(',');

    // 腾讯接口不支持 JSONP callback，返回的是赋值语句
    // 用 script 标签加载，解析全局变量
    script.src = `https://qt.gtimg.cn/q=${codesStr}`;
    script.charset = 'gbk';

    script.onload = () => {
      const prices: Record<string, number> = {};
      codes.forEach((code) => {
        try {
          // 腾讯接口会在 window 上挂 v_sz000516 这样的变量
          const varName = `v_${code}`;
          const data = (window as any)[varName];
          if (data) {
            const parts = data.split('~');
            // parts[3] 是当前价格
            const price = parseFloat(parts[3]);
            if (!isNaN(price) && price > 0) {
              prices[code] = price;
            }
          }
        } catch (e) {
          // 忽略单个解析错误
        }
      });
      // 清理
      script.remove();
      resolve(prices);
    };

    script.onerror = () => {
      script.remove();
      reject(new Error('股票行情接口请求失败'));
    };

    document.head.appendChild(script);
  });
}

interface UseStockPriceResult {
  /** 带实时价格的持仓列表 */
  positions: PositionWithPrice[];
  /** 是否正在加载 */
  loading: boolean;
  /** 错误信息 */
  error: string | null;
  /** 手动刷新 */
  refresh: () => void;
  /** 最后更新时间 */
  updatedAt: string | null;
}

export function useStockPrice(rawPositions: Position[]): UseStockPriceResult {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  const fetchPrices = useCallback(async () => {
    if (rawPositions.length === 0) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const codes = rawPositions.map((p) => p.code);
      const result = await fetchStockPrices(codes);
      setPrices(result);
      setUpdatedAt(new Date().toLocaleTimeString('zh-CN'));
    } catch (e: any) {
      setError(e.message || '获取行情失败');
    } finally {
      setLoading(false);
    }
  }, [rawPositions]);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  // 合并持仓和实时价格
  const positions: PositionWithPrice[] = rawPositions.map((p) => ({
    ...p,
    price: prices[p.code] || 0,
  }));

  return {
    positions,
    loading,
    error,
    refresh: fetchPrices,
    updatedAt,
  };
}
