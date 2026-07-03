import { useEffect, useState } from 'react';
import { API_BASE } from '../../constants';
import { fetchStockPrices } from './useStockPrice';
import type { AssetPoint } from '../types';

/**
 * 腾讯日K线接口，直接从浏览器请求（该接口 CORS 是开放的，允许跨域），
 * 不经过我们自己的后端代理，避免多一层转发。
 * 注意：这个接口实测不支持一次带多个 param 批量查询多只股票——
 * 传多个 param 时只会返回参数列表里最后一只的数据，其他股票被静默丢弃，
 * 因此下面按股票代码逐个单独请求。
 */
const KLINE_BASE = 'https://web.ifzq.gtimg.cn/appstock/app/fqkline/get';

/**
 * Alpha 曲线：假设从某天起不再操作（股票持仓数量不变），股票市值会怎样。
 * 只对比"股票市值"这一项，不掺入现金/贷款/其他——
 * 这样才能和图表里同样只代表股票市值的"股票市值"主线放在一起公平比较，
 * 现金进出、还贷之类的动作和"操作股票的好坏"无关，混进来会污染对比。
 *
 * 第一天的持仓数量来自当天（或之前最近一次收盘记录）的真实持仓快照，
 * 后面每一天的市值 = 这个（不变的）持仓数量 × 腾讯接口查到的当天真实历史收盘价。
 *
 * 注意：起点持仓永远来自历史收盘记录，不会退化成"当前持仓"——
 * 用当前持仓掺进历史推算会让曲线在没有当天记录的日期上失真。
 */

export interface AlphaCurve {
  label: string;
  startDate: string;
  /** 持仓明细文案（如"国际医学20,000股+京城股份3,000股"），供 tooltip 里展示 */
  positionsDesc: string;
  points: {
    date: string;
    value: number;
    /** 当天每只股票的收盘价明细，供 tooltip 核对"股数×收盘价"的计算过程 */
    breakdown: { stock: string; shares: number; close: number }[];
  }[];
}

interface StartSnapshot {
  /** 真正找到快照的日期，可能早于请求的 startDate（该日无记录时往前找最近一次） */
  actualDate: string;
  positions: { stock: string; code: string; shares: number }[];
}

// 股数格式化：加千分位，大额持仓（如上万股）更好读
const formatShares = (n: number) => n.toLocaleString();

async function fetchJSON<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// 起点持仓快照：始终来自历史收盘记录（当天没有就往前找最近一次），绝不用当前持仓兜底。
// 找不到任何历史快照时返回 null，这条曲线直接跳过，而不是用不准确的数据硬画。
async function getStartSnapshot(date: string): Promise<StartSnapshot | null> {
  const snapshot = await fetchJSON<{
    date: string;
    positions: { stock: string; code: string; shares: number }[];
  }>(`${API_BASE}/stock/position-snapshot-as-of/${date}`);
  if (!snapshot) return null;

  return {
    actualDate: snapshot.date,
    positions: snapshot.positions.map((p) => ({ stock: p.stock, code: p.code, shares: p.shares })),
  };
}

interface KlineResponse {
  code: number;
  data?: Record<
    string,
    {
      // 前复权日K线；部分没有分红配股历史的股票接口会直接返回 day 字段
      qfqday?: string[][];
      day?: string[][];
    }
  >;
}

// 查询单只股票的腾讯日K线，返回 { date: close }。
// 320 是这个接口单次返回的最大条数，覆盖约一年半交易日，足够 Alpha 曲线使用。
async function getHistoricalCloseOne(
  code: string,
  start: string,
  end: string,
): Promise<Record<string, number>> {
  const param = encodeURIComponent(`${code},day,${start},${end},320,qfq`);
  const data = await fetchJSON<KlineResponse>(`${KLINE_BASE}?param=${param}`);
  if (!data || data.code !== 0 || !data.data) return {};

  const rows = data.data[code]?.qfqday ?? data.data[code]?.day ?? [];
  const closeByDate: Record<string, number> = {};
  for (const row of rows) {
    // row: [date, open, close, high, low, volume]
    const close = Number(row[2]);
    if (row[0] && !Number.isNaN(close)) closeByDate[row[0]] = close;
  }
  return closeByDate;
}

// 逐个股票单独请求日K线（该接口不支持一次带多个 param 批量查询，见上方说明），
// 再合并成 { code: { date: close } } 供 Alpha 曲线使用。
async function getHistoricalClose(
  codes: string[],
  start: string,
  end: string,
): Promise<Record<string, Record<string, number>>> {
  if (codes.length === 0) return {};
  const entries = await Promise.all(
    codes.map(async (code) => [code, await getHistoricalCloseOne(code, start, end)] as const),
  );
  return Object.fromEntries(entries);
}

export function useAlphaCurves(
  startDates: string[],
  assetHistory: AssetPoint[],
): { curves: AlphaCurve[]; loading: boolean } {
  const [curves, setCurves] = useState<AlphaCurve[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (startDates.length === 0 || assetHistory.length === 0) {
      setCurves([]);
      return;
    }
    let cancelled = false;
    setLoading(true);

    const dates = assetHistory.map((a) => a.date);
    const today = dates[dates.length - 1];

    Promise.all(
      startDates.map(async (startDate) => {
        const snapshot = await getStartSnapshot(startDate);
        if (!snapshot) return null;

        const codes = snapshot.positions.map((p) => p.code).filter(Boolean);
        const closeByCode = await getHistoricalClose(codes, snapshot.actualDate, today);

        // 今天这一点：腾讯K线接口在收盘前不会返回当天数据，若沿用前向填充会把
        // "今天"错误地显示成昨天的收盘价。这里改用实时行情接口补today当天的价格，
        // 有实时价就优先用实时价，没有（如接口失败）才退回前向填充。
        const needsRealtime = codes.some((code) => closeByCode[code]?.[today] === undefined);
        const realtimeByCode: Record<string, number> = needsRealtime
          ? await fetchStockPrices(codes).catch(() => ({}))
          : {};

        // 收盘价按日期前向填充：非交易日（周末/停牌）沿用最近一个交易日的收盘价
        const lastClose: Record<string, number> = {};

        // 每天的值 = 持仓数量（不变）× 当日真实收盘价，可以直接拿收盘价心算核对。
        // 注意：这里不做任何缩放去对齐"股票市值"主线的起点——主线是手工记录，
        // 可能和真实收盘价算出来的市值有少量误差，硬拉齐起点会让后面每天的数字
        // 也跟着偏移，没法再对着收盘价核对，得不偿失。
        const points = dates
          .filter((d) => d >= snapshot.actualDate)
          .map((d) => {
            let value = 0;
            const breakdown: { stock: string; shares: number; close: number }[] = [];
            for (const p of snapshot.positions) {
              const close = closeByCode[p.code]?.[d];
              if (close !== undefined) lastClose[p.code] = close;
              // 今天且K线还没有当天数据时，用实时价而不是昨天的收盘价填充
              const usedClose =
                d === today && close === undefined && realtimeByCode[p.code]
                  ? realtimeByCode[p.code]
                  : lastClose[p.code] || 0;
              value += usedClose * p.shares;
              breakdown.push({ stock: p.stock, shares: p.shares, close: usedClose });
            }
            return { date: d, value: Math.round(value), breakdown };
          });

        // 持仓明细单独存一份，供图表 tooltip 展示——图例本身只用简短标签，
        // 避免多条曲线的图例文字全堆在一起看不清。
        const positionsDesc = snapshot.positions
          .map((p) => `${p.stock}${formatShares(p.shares)}股`)
          .join('+');
        const label =
          snapshot.actualDate === startDate
            ? `${startDate}持仓`
            : `${startDate}持仓(用${snapshot.actualDate})`;

        return { label, startDate, positionsDesc, points };
      }),
    ).then((result) => {
      if (!cancelled) {
        setCurves(result.filter((c): c is AlphaCurve => c !== null));
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [startDates.join(','), assetHistory]);

  return { curves, loading };
}

// 默认取"当日往前 3 个月、2 个月、1 个月"的同日作为起点（格式 "2026-04-02"）。
// 月底边界（如 1/31 往前 1 个月没有 2/31）时 JS Date 会自动溢出到下月头几天，
// 行为和大多数日历应用一致，不做额外处理。
export function getDefaultAlphaStartDates(referenceDate = new Date()): string[] {
  const result: string[] = [];
  for (let i = 3; i >= 1; i--) {
    const d = new Date(
      referenceDate.getFullYear(),
      referenceDate.getMonth() - i,
      referenceDate.getDate(),
    );
    result.push(d.toLocaleDateString('sv'));
  }
  return result;
}
