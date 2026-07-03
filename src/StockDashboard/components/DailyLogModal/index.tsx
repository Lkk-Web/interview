import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { API_BASE, ADMIN_TOKEN } from '../../../constants';
import type { Position, MonthlyRecord } from '../../types';
import { fetchStockPrices } from '../../hooks/useStockPrice';
import './index.less';

interface Props {
  positions: Position[];
  currentMonth?: MonthlyRecord;
  draft: DailyLogDraft;
  onDraftChange: (draft: DailyLogDraft) => void;
  onClose: () => void;
  onSubmitted?: () => void;
}

// 草稿类型导出供父组件持有
export interface DailyLogDraft {
  date: string;
  positionForms: PositionForm[];
  trades: TradeRow[];
  tRecords: TRecordRow[];
  // 波段收益（买卖跨日撮合），交互和计算方式与 tRecords 一致
  swingRecords: SwingRecordRow[];
  // consumedLegs/newUnmatchedLegs 由“生成波段收益”自动计算得出，不由用户直接编辑，
  // 提交时随 swingRecords 一起发给后端，用于更新 stock_unmatched_legs。
  consumedLegs: ConsumedLegRow[];
  newUnmatchedLegs: NewUnmatchedLegRow[];
  monthlyTRevenue: string;
  monthlySwingRevenue: string;
  market: string;
  feeling: string;
  nextPlan: string;
}

export function emptyDraft(positions: Position[], currentMonth?: MonthlyRecord): DailyLogDraft {
  return {
    date: today(),
    positionForms: positions.map((p) => ({
      code: p.code,
      stock: p.stock,
      cost: String(p.cost),
      shares: String(p.shares),
      price: '',
    })),
    trades: [],
    tRecords: [],
    swingRecords: [],
    consumedLegs: [],
    newUnmatchedLegs: [],
    monthlyTRevenue: String(currentMonth?.tRevenue ?? ''),
    monthlySwingRevenue: String(currentMonth?.swingRevenue ?? ''),
    market: '',
    feeling: '',
    nextPlan: '',
  };
}

interface PositionForm {
  code: string;
  stock: string;
  cost: string;
  shares: string;
  price: string; // 当日收盘价
}

interface TradeRow {
  action: string;
  stock: string;
  code: string;
  price: string;
  shares: string;
  // 标记为“未匹配”：该腿不参与当日自动撮合（做T），跨日挂起等待之后反向操作再匹配成波段收益
  hasIssue: boolean;
}

// TRecord 有买卖价格/数量（触发自动计算），也有可覆盖的计算字段
interface TRecordRow {
  stock: string;
  buyPrice: string;
  buyShares: string;
  sellPrice: string;
  sellShares: string;
  grossProfit: string;
  fee: string;
  tax: string;
  netRevenue: string;
}

// 波段收益一行：买卖发生在不同交易日，字段结构和 TRecordRow 一致，多了买卖日期
interface SwingRecordRow {
  stock: string;
  buyDate: string;
  buyPrice: string;
  buyShares: string;
  sellDate: string;
  sellPrice: string;
  sellShares: string;
  grossProfit: string;
  fee: string;
  tax: string;
  netRevenue: string;
}

// 待匹配仓位：从后端 /stock/unmatched-positions 拉取的历史未匹配腿
interface UnmatchedLegItem {
  id: number;
  date: string;
  stock: string;
  code: string;
  action: string;
  price: number;
  remainingShares: number;
  totalShares: number;
  totalFee: number;
}

// 提交时随波段收益一起发给后端：本次消耗了哪个历史未匹配腿多少数量
interface ConsumedLegRow {
  legId: number;
  consumedShares: number;
}

// 提交时随波段收益一起发给后端：当日新产生、仍未匹配完的腿
interface NewUnmatchedLegRow {
  stock: string;
  code: string;
  action: string;
  price: number;
  remainingShares: number;
  totalShares: number;
  totalFee: number;
}

interface HistoryPosition {
  stock: string;
  code: string;
  cost: number;
  shares: number;
  price: number;
}
interface HistoryTrade {
  action: string;
  stock: string;
  code: string;
  price: number;
  shares: number;
  hasIssue: boolean;
}
interface HistoryTRecord {
  stock: string;
  desc: string;
  netRevenue: number;
}
interface HistorySwingRecord {
  stock: string;
  desc: string;
  buyDate: string;
  sellDate: string;
  netRevenue: number;
}
interface HistoryReview {
  market: string;
  feeling: string;
  nextPlan: string;
}
interface HistoryRecord {
  date: string;
  marker: string;
  positions: HistoryPosition[];
  trades: HistoryTrade[];
  tRecords: HistoryTRecord[];
  swingRecords: HistorySwingRecord[];
  monthlyTRevenue: number;
  monthlySwingRevenue: number;
  review: HistoryReview;
}

interface TRecordCalc {
  desc: string;
  grossProfit: number;
  fee: number;
  tax: number;
  netRevenue: number;
}

// 万0.856佣金（0.0000856），不足5元收5元；卖出印花税0.05%（2023年8月起）
const COMMISSION_RATE = 0.0000856;
const COMMISSION_MIN = 5;
const STAMP_TAX_RATE = 0.0005;

function calcTRecord(
  r: Pick<TRecordRow, 'buyPrice' | 'buyShares' | 'sellPrice' | 'sellShares'>,
): TRecordCalc {
  const bp = Number(r.buyPrice) || 0;
  const bs = Number(r.buyShares) || 0;
  const sp = Number(r.sellPrice) || 0;
  const ss = Number(r.sellShares) || 0;

  const buyAmount = bp * bs;
  const sellAmount = sp * ss;
  const matched = Math.min(bs, ss);
  const grossProfit = (sp - bp) * matched;
  const buyFee = buyAmount > 0 ? Math.max(buyAmount * COMMISSION_RATE, COMMISSION_MIN) : 0;
  const sellFee = sellAmount > 0 ? Math.max(sellAmount * COMMISSION_RATE, COMMISSION_MIN) : 0;
  const fee = round2(buyFee + sellFee);
  const tax = round2(sellAmount * STAMP_TAX_RATE);
  const netRevenue = round2(grossProfit - fee - tax);
  const desc = bp && bs && sp && ss ? `${bp}买${bs}→${sp}卖${ss}` : '';
  return { desc, grossProfit: round2(grossProfit), fee, tax, netRevenue };
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

// 用本地日期避免时区偏差（toISOString 返回 UTC，跨午夜会差一天）
const today = () => new Date().toLocaleDateString('sv');

const emptyTrade = (): TradeRow => ({
  action: '买入',
  stock: '',
  code: '',
  price: '',
  shares: '',
  hasIssue: false,
});

const emptyTRecord = (): TRecordRow => ({
  stock: '',
  buyPrice: '',
  buyShares: '',
  sellPrice: '',
  sellShares: '',
  grossProfit: '',
  fee: '',
  tax: '',
  netRevenue: '',
});

const DailyLogModal: React.FC<Props> = ({
  positions,
  currentMonth,
  draft,
  onDraftChange,
  onClose,
  onSubmitted,
}) => {
  const {
    date,
    positionForms,
    trades,
    tRecords,
    swingRecords,
    consumedLegs,
    newUnmatchedLegs,
    monthlyTRevenue,
    monthlySwingRevenue,
    market,
    feeling,
    nextPlan,
  } = draft;
  const set = (partial: Partial<DailyLogDraft>) => onDraftChange({ ...draft, ...partial });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // 非今日查看的历史记录（只读）
  const [historyRecord, setHistoryRecord] = useState<HistoryRecord | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  // 当前所有跨日未匹配的买/卖腿（待匹配做T仓位），从后端拉取
  const [unmatchedLegs, setUnmatchedLegs] = useState<UnmatchedLegItem[]>([]);

  const todayStr = new Date().toLocaleDateString('sv');
  const isToday = date === todayStr;

  // positionForms 有股票代码时，自动拉行情填入现价（用户仍可手动覆盖）
  useEffect(() => {
    const codes = positionForms.map((p) => p.code).filter(Boolean);
    if (codes.length === 0) return;
    fetchStockPrices(codes)
      .then((prices) => {
        set({
          positionForms: positionForms.map((p) =>
            prices[p.code] ? { ...p, price: String(prices[p.code]) } : p,
          ),
        });
      })
      .catch(() => {});
    // 只在弹窗初次挂载时拉一次，不随 positionForms 变化重复触发
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 弹窗初次挂载时拉一次当前所有跨日未匹配腿，供“未匹配做T仓位”区块展示和跨日撮合使用
  useEffect(() => {
    fetch(`${API_BASE}/stock/unmatched-positions`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setUnmatchedLegs(data || []))
      .catch(() => {});
  }, []);

  // 日期变化时：非今日显示只读历史；今日且草稿为空则把已提交记录带回
  useEffect(() => {
    if (!isToday) {
      setHistoryLoading(true);
      fetch(`${API_BASE}/stock/daily-log/${date}`)
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null)
        .then((data) => {
          setHistoryRecord(data);
          setHistoryLoading(false);
        });
      return;
    }

    setHistoryRecord(null);

    // 草稿为空（首次打开或提交后重置）才回填，避免覆盖用户已填内容
    const isEmpty =
      trades.length === 0 &&
      tRecords.length === 0 &&
      swingRecords.length === 0 &&
      !market &&
      !feeling &&
      !nextPlan;
    if (!isEmpty) return;

    fetch(`${API_BASE}/stock/daily-log/${date}`)
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null)
      .then((rec: HistoryRecord | null) => {
        if (!rec) return;
        set({
          positionForms: rec.positions.map((p) => ({
            code: p.code,
            stock: p.stock,
            cost: String(p.cost),
            shares: String(p.shares),
            price: String(p.price || ''),
          })),
          trades: rec.trades.map((t) => ({
            action: t.action,
            stock: t.stock,
            code: t.code,
            price: String(t.price),
            shares: String(t.shares),
            hasIssue: t.hasIssue || false,
          })),
          tRecords: rec.tRecords.map((r) => ({
            stock: r.stock,
            buyPrice: '',
            buyShares: '',
            sellPrice: '',
            sellShares: '',
            grossProfit: '',
            fee: '',
            tax: '',
            netRevenue: String(r.netRevenue),
          })),
          swingRecords: (rec.swingRecords || []).map((r) => ({
            stock: r.stock,
            buyDate: r.buyDate,
            buyPrice: '',
            buyShares: '',
            sellDate: r.sellDate,
            sellPrice: '',
            sellShares: '',
            grossProfit: '',
            fee: '',
            tax: '',
            netRevenue: String(r.netRevenue),
          })),
          consumedLegs: [],
          newUnmatchedLegs: [],
          monthlyTRevenue: String(rec.monthlyTRevenue || ''),
          monthlySwingRevenue: String(rec.monthlySwingRevenue || ''),
          market: rec.review?.market || '',
          feeling: rec.review?.feeling || '',
          nextPlan: rec.review?.nextPlan || '',
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, isToday]);

  // 跨日挂起（hasIssue）只是"买卖不在同一天"，不代表操作有问题，
  // 不再据此把 marker 标成"？"——有操作就是"！"，不区分是否跨日。
  const marker = trades.length === 0 ? '' : '！';

  const addPositionForm = () =>
    set({
      positionForms: [...positionForms, { code: '', stock: '', cost: '', shares: '', price: '' }],
    });
  const removePositionForm = (i: number) =>
    set({ positionForms: positionForms.filter((_, idx) => idx !== i) });

  const updatePosition = (i: number, key: keyof PositionForm, value: string) => {
    set({ positionForms: positionForms.map((p, idx) => (idx === i ? { ...p, [key]: value } : p)) });
  };

  const addTrade = () => set({ trades: [...trades, emptyTrade()] });
  const removeTrade = (i: number) => set({ trades: trades.filter((_, idx) => idx !== i) });
  const updateTrade = (i: number, key: keyof TradeRow, value: string | boolean) => {
    set({
      trades: trades.map((t, idx) => {
        if (idx !== i) return t;
        if (key === 'stock') {
          const pos = positions.find((p) => p.stock === String(value));
          return { ...t, stock: String(value), code: pos ? pos.code : t.code };
        }
        return { ...t, [key]: value };
      }),
    });
  };

  const addTRecord = () => set({ tRecords: [...tRecords, emptyTRecord()] });
  const removeTRecord = (i: number) => set({ tRecords: tRecords.filter((_, idx) => idx !== i) });

  const generateTRecordsFromTrades = () => {
    type Lot = { price: number; remaining: number; totalShares: number; totalFee: number };
    const buyQueues: Record<string, Lot[]> = {};
    const sellQueues: Record<string, Lot[]> = {};
    const generated: TRecordRow[] = [];

    for (const trade of trades) {
      // 标记为“未匹配”的操作不参与当日撮合，留给“生成波段收益”跨日处理
      if (trade.hasIssue) continue;
      if (!trade.stock || !trade.price || !trade.shares) continue;
      const price = Number(trade.price);
      const shares = Number(trade.shares);
      const tradeFee = Math.max(price * shares * COMMISSION_RATE, COMMISSION_MIN);

      if (trade.action === '买入') {
        // 先尝试匹配已挂起的卖出（先卖后买的T）
        const sq = sellQueues[trade.stock] ?? [];
        let toMatch = shares;

        for (const lot of sq) {
          if (toMatch <= 0 || lot.remaining <= 0) continue;
          const consume = Math.min(lot.remaining, toMatch);
          const buyFeeShare = tradeFee * (consume / shares);
          const sellFeeShare = lot.totalFee * (consume / lot.totalShares);
          const sellAmt = lot.price * consume;
          const gp = round2((lot.price - price) * consume);
          const f = round2(buyFeeShare + sellFeeShare);
          const tax = round2(sellAmt * STAMP_TAX_RATE);
          generated.push({
            stock: trade.stock,
            buyPrice: String(price),
            buyShares: String(consume),
            sellPrice: String(lot.price),
            sellShares: String(consume),
            grossProfit: String(gp),
            fee: String(f),
            tax: String(tax),
            netRevenue: String(round2(gp - f - tax)),
          });
          lot.remaining -= consume;
          toMatch -= consume;
        }
        sellQueues[trade.stock] = sq.filter((l) => l.remaining > 0);

        // 未匹配的余量入买入队列
        if (toMatch > 0) {
          if (!buyQueues[trade.stock]) buyQueues[trade.stock] = [];
          buyQueues[trade.stock].push({
            price,
            remaining: toMatch,
            totalShares: toMatch,
            totalFee: tradeFee * (toMatch / shares),
          });
        }
      } else {
        // 卖出：先匹配已挂起的买入（先买后卖的T）
        const bq = buyQueues[trade.stock] ?? [];
        let toMatch = shares;

        for (const lot of bq) {
          if (toMatch <= 0 || lot.remaining <= 0) continue;
          const consume = Math.min(lot.remaining, toMatch);
          const buyFeeShare = lot.totalFee * (consume / lot.totalShares);
          const sellFeeShare = tradeFee * (consume / shares);
          const sellAmt = price * consume;
          const gp = round2((price - lot.price) * consume);
          const f = round2(buyFeeShare + sellFeeShare);
          const tax = round2(sellAmt * STAMP_TAX_RATE);
          generated.push({
            stock: trade.stock,
            buyPrice: String(lot.price),
            buyShares: String(consume),
            sellPrice: String(price),
            sellShares: String(consume),
            grossProfit: String(gp),
            fee: String(f),
            tax: String(tax),
            netRevenue: String(round2(gp - f - tax)),
          });
          lot.remaining -= consume;
          toMatch -= consume;
        }
        buyQueues[trade.stock] = bq.filter((l) => l.remaining > 0);

        // 未匹配的余量入卖出队列（等后续买入来配对）
        if (toMatch > 0) {
          if (!sellQueues[trade.stock]) sellQueues[trade.stock] = [];
          sellQueues[trade.stock].push({
            price,
            remaining: toMatch,
            totalShares: toMatch,
            totalFee: tradeFee * (toMatch / shares),
          });
        }
      }
    }

    if (generated.length > 0) set({ tRecords: generated });
  };

  // 纯函数：对勾了 hasIssue 的操作做跨日 FIFO 撮合，返回计算结果但不修改 state。
  // handleSubmit 提交前自动调用，”从操作生成”按钮也复用这里，保持逻辑一致。
  const computeSwingFromTrades = (
    sourceTrades: TradeRow[],
    sourceLegs: UnmatchedLegItem[],
    forDate: string,
  ): {
    swingRecords: SwingRecordRow[];
    consumedLegs: ConsumedLegRow[];
    newUnmatchedLegs: NewUnmatchedLegRow[];
  } => {
    const issueTrades = sourceTrades.filter((t) => t.hasIssue && t.stock && t.price && t.shares);
    if (issueTrades.length === 0)
      return { swingRecords: [], consumedLegs: [], newUnmatchedLegs: [] };

    const generatedSwing: SwingRecordRow[] = [];
    const consumed: ConsumedLegRow[] = [];
    const newLegs: NewUnmatchedLegRow[] = [];
    // 按股票分组的历史挂起腿快照，本地扣减不影响原始数据（提交后由后端持久化扣减）
    const legPool: Record<string, (UnmatchedLegItem & { consumedSoFar: number })[]> = {};
    for (const leg of sourceLegs) {
      if (!legPool[leg.stock]) legPool[leg.stock] = [];
      legPool[leg.stock].push({ ...leg, consumedSoFar: 0 });
    }

    for (const trade of issueTrades) {
      const price = Number(trade.price);
      const shares = Number(trade.shares);
      const tradeFee = Math.max(price * shares * COMMISSION_RATE, COMMISSION_MIN);
      const opposite = trade.action === '买入' ? '卖出' : '买入';
      const candidates = (legPool[trade.stock] ?? []).filter(
        (l) => l.action === opposite && l.remainingShares - l.consumedSoFar > 0,
      );

      let toMatch = shares;
      for (const leg of candidates) {
        if (toMatch <= 0) break;
        const available = leg.remainingShares - leg.consumedSoFar;
        const consume = Math.min(available, toMatch);
        if (consume <= 0) continue;

        const legFeeShare = leg.totalFee * (consume / leg.totalShares);
        const tradeFeeShare = tradeFee * (consume / shares);
        const fee = round2(legFeeShare + tradeFeeShare);

        const isBuyLeg = leg.action === '买入';
        const buyPrice = isBuyLeg ? leg.price : price;
        const sellPrice = isBuyLeg ? price : leg.price;
        const buyDate = isBuyLeg ? leg.date : forDate;
        const sellDate = isBuyLeg ? forDate : leg.date;
        const sellAmt = sellPrice * consume;
        const gp = round2((sellPrice - buyPrice) * consume);
        const tax = round2(sellAmt * STAMP_TAX_RATE);

        generatedSwing.push({
          stock: trade.stock,
          buyDate,
          buyPrice: String(buyPrice),
          buyShares: String(consume),
          sellDate,
          sellPrice: String(sellPrice),
          sellShares: String(consume),
          grossProfit: String(gp),
          fee: String(fee),
          tax: String(tax),
          netRevenue: String(round2(gp - fee - tax)),
        });

        leg.consumedSoFar += consume;
        toMatch -= consume;
        const existing = consumed.find((c) => c.legId === leg.id);
        if (existing) {
          existing.consumedShares += consume;
        } else {
          consumed.push({ legId: leg.id, consumedShares: consume });
        }
      }

      // 未匹配完的余量：挂起为新的未匹配腿，等待未来某天再匹配
      if (toMatch > 0) {
        newLegs.push({
          stock: trade.stock,
          code: trade.code,
          action: trade.action,
          price,
          remainingShares: toMatch,
          totalShares: toMatch,
          totalFee: tradeFee * (toMatch / shares),
        });
      }
    }

    return { swingRecords: generatedSwing, consumedLegs: consumed, newUnmatchedLegs: newLegs };
  };

  // 从”标记为未匹配”的操作生成波段收益，结果写入 draft state 供用户预览后再提交。
  const generateSwingRecordsFromTrades = () => {
    const result = computeSwingFromTrades(trades, unmatchedLegs, date);
    if (result.swingRecords.length > 0 || result.newUnmatchedLegs.length > 0) {
      set({
        swingRecords: result.swingRecords,
        consumedLegs: result.consumedLegs,
        newUnmatchedLegs: result.newUnmatchedLegs,
      });
    }
  };

  const updateTRecord = (i: number, key: keyof TRecordRow, value: string) => {
    set({
      tRecords: tRecords.map((r, idx) => {
        if (idx !== i) return r;
        const updated = { ...r, [key]: value };
        if (['buyPrice', 'buyShares', 'sellPrice', 'sellShares'].includes(key)) {
          const calc = calcTRecord(updated);
          return {
            ...updated,
            grossProfit: calc.grossProfit !== 0 ? String(calc.grossProfit) : '',
            fee: calc.fee !== 0 ? String(calc.fee) : '',
            tax: calc.tax !== 0 ? String(calc.tax) : '',
            netRevenue: calc.netRevenue !== 0 ? String(calc.netRevenue) : '',
          };
        }
        return updated;
      }),
    });
  };

  const todayTTotal = round2(tRecords.reduce((sum, r) => sum + (Number(r.netRevenue) || 0), 0));

  // tRecords 变化时，自动把今日合计叠加到本月基准值上
  useEffect(() => {
    const base = currentMonth?.tRevenue ?? 0;
    const updated = round2(base + todayTTotal);
    set({ monthlyTRevenue: todayTTotal !== 0 ? String(updated) : String(base || '') });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayTTotal]);

  const addSwingRecord = () =>
    set({
      swingRecords: [
        ...swingRecords,
        {
          stock: '',
          buyDate: '',
          buyPrice: '',
          buyShares: '',
          sellDate: '',
          sellPrice: '',
          sellShares: '',
          grossProfit: '',
          fee: '',
          tax: '',
          netRevenue: '',
        },
      ],
    });
  const removeSwingRecord = (i: number) =>
    set({ swingRecords: swingRecords.filter((_, idx) => idx !== i) });

  const updateSwingRecord = (i: number, key: keyof SwingRecordRow, value: string) => {
    set({
      swingRecords: swingRecords.map((r, idx) => {
        if (idx !== i) return r;
        const updated = { ...r, [key]: value };
        if (['buyPrice', 'buyShares', 'sellPrice', 'sellShares'].includes(key)) {
          const calc = calcTRecord(updated);
          return {
            ...updated,
            grossProfit: calc.grossProfit !== 0 ? String(calc.grossProfit) : '',
            fee: calc.fee !== 0 ? String(calc.fee) : '',
            tax: calc.tax !== 0 ? String(calc.tax) : '',
            netRevenue: calc.netRevenue !== 0 ? String(calc.netRevenue) : '',
          };
        }
        return updated;
      }),
    });
  };

  const todaySwingTotal = round2(
    swingRecords.reduce((sum, r) => sum + (Number(r.netRevenue) || 0), 0),
  );

  // swingRecords 变化时，自动把今日合计叠加到本月波段收益基准值上
  useEffect(() => {
    const base = currentMonth?.swingRevenue ?? 0;
    const updated = round2(base + todaySwingTotal);
    set({ monthlySwingRevenue: todaySwingTotal !== 0 ? String(updated) : String(base || '') });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todaySwingTotal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // 有勾了 ⚠ 的交易但用户没点"从操作生成"时，提交前自动跑一遍撮合：
    // - 有历史反向腿可匹配 → 生成波段收益 + 扣减历史腿，不产生新挂起腿
    // - 没有反向腿可匹配 → 直接挂起为新的 newUnmatchedLegs，等待之后再匹配
    const hasIssueTrades = trades.some((t) => t.hasIssue && t.stock && t.price && t.shares);
    const alreadyGenerated =
      consumedLegs.length > 0 || newUnmatchedLegs.length > 0 || swingRecords.length > 0;
    const auto =
      hasIssueTrades && !alreadyGenerated
        ? computeSwingFromTrades(trades, unmatchedLegs, date)
        : null;

    const finalSwingRecords = auto ? auto.swingRecords : swingRecords;
    const finalConsumedLegs = auto ? auto.consumedLegs : consumedLegs;
    const finalNewUnmatched = auto ? auto.newUnmatchedLegs : newUnmatchedLegs;

    const body = {
      date,
      marker,
      positions: positionForms.map((p) => ({
        stock: p.stock,
        code: p.code,
        cost: Number(p.cost) || 0,
        shares: Number(p.shares) || 0,
        price: Number(p.price) || 0,
      })),
      trades: trades.map((t) => ({
        action: t.action,
        stock: t.stock,
        code: t.code,
        price: Number(t.price) || 0,
        shares: Number(t.shares) || 0,
        hasIssue: t.hasIssue,
        pnl: '',
      })),
      tRecords: tRecords.map((r) => ({
        stock: r.stock,
        desc: calcTRecord(r).desc,
        grossProfit: Number(r.grossProfit) || 0,
        fee: Number(r.fee) || 0,
        tax: Number(r.tax) || 0,
        netRevenue: Number(r.netRevenue) || 0,
      })),
      swingRecords: finalSwingRecords.map((r) => ({
        stock: r.stock,
        desc:
          r.buyPrice && r.buyShares && r.sellPrice && r.sellShares
            ? `${r.buyDate || '?'}买${r.buyShares}→${r.sellDate || '?'}卖${r.sellShares}`
            : '',
        buyDate: r.buyDate,
        sellDate: r.sellDate,
        grossProfit: Number(r.grossProfit) || 0,
        fee: Number(r.fee) || 0,
        tax: Number(r.tax) || 0,
        netRevenue: Number(r.netRevenue) || 0,
      })),
      consumedLegs: finalConsumedLegs.map((c) => ({
        legId: c.legId,
        consumedShares: c.consumedShares,
      })),
      newUnmatchedLegs: finalNewUnmatched.map((l) => ({
        stock: l.stock,
        code: l.code,
        action: l.action,
        price: l.price,
        remainingShares: l.remainingShares,
        totalShares: l.totalShares,
        totalFee: l.totalFee,
      })),
      monthlyTRevenue: Number(monthlyTRevenue) || 0,
      monthlySwingRevenue: Number(monthlySwingRevenue) || 0,
      review: { market, feeling, nextPlan },
    };
    try {
      const res = await fetch(`${API_BASE}/admin/stock/daily-log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ADMIN_TOKEN}` },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `HTTP ${res.status}`);
      }
      toast.success('记录已提交');
      onDraftChange(emptyDraft(positions, currentMonth));
      onSubmitted?.();
      onClose();
    } catch (err: any) {
      setError(err.message ?? '提交失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dlm-overlay" onClick={onClose}>
      <div className="dlm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="dlm-header">
          <span>每日收盘记录</span>
          <button className="dlm-close" onClick={onClose}>
            ×
          </button>
        </div>

        {/* datalist 供操作记录和T记录复用 */}
        <datalist id="dlm-positions-list">
          {positions.map((p) => (
            <option key={p.code} value={p.stock} />
          ))}
        </datalist>

        {/* 非今日：显示只读历史记录 */}
        {!isToday && (
          <div className="dlm-body">
            <div className="dlm-row">
              <label className="dlm-label">
                日期
                <input type="date" value={date} onChange={(e) => set({ date: e.target.value })} />
              </label>
              {historyRecord && (
                <label className="dlm-label">
                  标记
                  <div
                    className={`dlm-marker-badge dlm-marker-${
                      historyRecord.marker === '' ? 'none' : 'op'
                    }`}
                  >
                    {/* 不再区分"问题操作"：跨日挂起只是买卖不在同一天，不代表操作有问题。
                        旧记录里可能还留有历史的"？"标记，一并当作"有操作"展示。 */}
                    {historyRecord.marker === '' ? '— 无操作' : '！有操作'}
                  </div>
                </label>
              )}
            </div>
            {historyLoading && <div className="dlm-empty">加载中…</div>}
            {!historyLoading && !historyRecord && <div className="dlm-empty">该日暂无记录</div>}
            {historyRecord && (
              <>
                {historyRecord.positions?.length > 0 && (
                  <div className="dlm-section">
                    <div className="dlm-section-title">持仓情况</div>
                    {historyRecord.positions.map((p, i) => (
                      <div key={i} className="dlm-history-row">
                        <span>{p.stock}</span>
                        <span className="dlm-muted">成本 {p.cost}</span>
                        <span className="dlm-muted">× {p.shares} 股</span>
                        {p.price > 0 && (
                          <span className={p.price >= p.cost ? 'dlm-positive' : 'dlm-negative'}>
                            现价 {p.price}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {historyRecord.trades?.length > 0 && (
                  <div className="dlm-section">
                    <div className="dlm-section-title">操作记录</div>
                    {historyRecord.trades.map((t, i) => (
                      <div key={i} className="dlm-history-row">
                        <span className="dlm-history-tag">{t.action}</span>
                        <span>{t.stock}</span>
                        <span className="dlm-muted">
                          {t.price} × {t.shares}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {historyRecord.tRecords?.length > 0 && (
                  <div className="dlm-section">
                    <div className="dlm-section-title">做T收益</div>
                    {historyRecord.tRecords.map((r, i) => (
                      <div key={i} className="dlm-history-row">
                        <span>{r.stock}</span>
                        <span className="dlm-muted">{r.desc}</span>
                        <span className={r.netRevenue >= 0 ? 'dlm-positive' : 'dlm-negative'}>
                          净 {r.netRevenue} 元
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {historyRecord.swingRecords?.length > 0 && (
                  <div className="dlm-section">
                    <div className="dlm-section-title">波段收益</div>
                    {historyRecord.swingRecords.map((r, i) => (
                      <div key={i} className="dlm-history-row">
                        <span>{r.stock}</span>
                        <span className="dlm-muted">{r.desc}</span>
                        <span className={r.netRevenue >= 0 ? 'dlm-positive' : 'dlm-negative'}>
                          净 {r.netRevenue} 元
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {(historyRecord.review?.market || historyRecord.review?.nextPlan) && (
                  <div className="dlm-section">
                    <div className="dlm-section-title">复盘</div>
                    {historyRecord.review.market && (
                      <div className="dlm-history-text">市场：{historyRecord.review.market}</div>
                    )}
                    {historyRecord.review.feeling && (
                      <div className="dlm-history-text">感受：{historyRecord.review.feeling}</div>
                    )}
                    {historyRecord.review.nextPlan && (
                      <div className="dlm-history-text">计划：{historyRecord.review.nextPlan}</div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {isToday && (
          <form className="dlm-body" onSubmit={handleSubmit}>
            {/* 日期 + 标记 */}
            <div className="dlm-row">
              <label className="dlm-label">
                日期
                <input
                  type="date"
                  value={date}
                  onChange={(e) => set({ date: e.target.value })}
                  required
                />
              </label>
              <label className="dlm-label">
                标记
                <div className={`dlm-marker-badge dlm-marker-${marker === '' ? 'none' : 'op'}`}>
                  {marker === '' ? '— 无操作' : '！有操作'}
                </div>
              </label>
            </div>

            {/* 持仓情况 */}
            <div className="dlm-section">
              <div className="dlm-section-header">
                <span className="dlm-section-title">持仓情况</span>
                <button type="button" className="dlm-add-btn" onClick={addPositionForm}>
                  + 新建仓
                </button>
              </div>
              {positionForms.map((p, i) => (
                <div key={i} className="dlm-position-row">
                  {p.code && p.stock ? (
                    <span className="dlm-position-name">{p.stock}</span>
                  ) : (
                    <>
                      <input
                        list="dlm-positions-list"
                        placeholder="股票"
                        value={p.stock}
                        onChange={(e) => {
                          const pos = positions.find((x) => x.stock === e.target.value);
                          const next = {
                            ...p,
                            stock: e.target.value,
                            code: pos ? pos.code : p.code,
                          };
                          set({
                            positionForms: positionForms.map((x, idx) => (idx === i ? next : x)),
                          });
                        }}
                        style={{
                          width: 80,
                          fontSize: 13,
                          padding: '5px 6px',
                          border: '1px solid #d9d9d9',
                          borderRadius: 6,
                        }}
                      />
                      <input
                        placeholder="代码"
                        value={p.code}
                        onChange={(e) => updatePosition(i, 'code', e.target.value)}
                        style={{
                          width: 72,
                          fontSize: 12,
                          color: '#8c8c8c',
                          padding: '5px 6px',
                          border: '1px solid #d9d9d9',
                          borderRadius: 6,
                        }}
                      />
                    </>
                  )}
                  <label className="dlm-inline-label">
                    成本
                    <input
                      type="number"
                      step="0.001"
                      value={p.cost}
                      onChange={(e) => updatePosition(i, 'cost', e.target.value)}
                    />
                  </label>
                  <label className="dlm-inline-label">
                    数量
                    <input
                      type="number"
                      value={p.shares}
                      onChange={(e) => updatePosition(i, 'shares', e.target.value)}
                    />
                  </label>
                  <label className="dlm-inline-label">
                    现价
                    <input
                      type="number"
                      step="0.001"
                      value={p.price}
                      placeholder="—"
                      onChange={(e) => updatePosition(i, 'price', e.target.value)}
                    />
                  </label>
                  <button
                    type="button"
                    className="dlm-remove-btn"
                    onClick={() => removePositionForm(i)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* 操作记录 */}
            <div className="dlm-section">
              <div className="dlm-section-header">
                <span className="dlm-section-title">操作记录</span>
                <button type="button" className="dlm-add-btn" onClick={addTrade}>
                  + 添加
                </button>
              </div>
              {trades.map((t, i) => (
                <div key={i} className={`dlm-trade-row ${t.hasIssue ? 'dlm-trade-issue' : ''}`}>
                  <select
                    value={t.action}
                    onChange={(e) => updateTrade(i, 'action', e.target.value)}
                  >
                    <option value="买入">买入</option>
                    <option value="卖出">卖出</option>
                  </select>
                  <input
                    list="dlm-positions-list"
                    placeholder="股票"
                    value={t.stock}
                    onChange={(e) => updateTrade(i, 'stock', e.target.value)}
                  />
                  <input
                    className="dlm-code-input"
                    placeholder="代码"
                    value={t.code.replace(/^(sh|sz)/i, '')}
                    onChange={(e) => updateTrade(i, 'code', e.target.value)}
                  />
                  <input
                    placeholder="价格"
                    type="number"
                    step="0.01"
                    value={t.price}
                    onChange={(e) => updateTrade(i, 'price', e.target.value)}
                  />
                  <input
                    placeholder="数量"
                    type="number"
                    value={t.shares}
                    onChange={(e) => updateTrade(i, 'shares', e.target.value)}
                  />
                  <label className="dlm-issue-label" title="标记为未匹配（跨日再匹配成波段收益）">
                    <input
                      type="checkbox"
                      checked={t.hasIssue}
                      onChange={(e) => updateTrade(i, 'hasIssue', e.target.checked)}
                    />
                    ⚠
                  </label>
                  <button type="button" className="dlm-remove-btn" onClick={() => removeTrade(i)}>
                    ×
                  </button>
                </div>
              ))}
              {trades.length === 0 && <div className="dlm-empty">无操作</div>}
            </div>

            {/* 未匹配做T仓位：历史挂起的买/卖腿，等待反向操作再匹配成波段收益 */}
            {unmatchedLegs.length > 0 && (
              <div className="dlm-section">
                <div className="dlm-section-title">未匹配做T仓位</div>
                {unmatchedLegs.map((leg) => (
                  <div key={leg.id} className="dlm-history-row dlm-unmatched-row">
                    <span className="dlm-history-tag">待匹配</span>
                    <span className="dlm-history-tag">{leg.action}</span>
                    <span>{leg.stock}</span>
                    <span className="dlm-muted">
                      {leg.price} × {leg.remainingShares}
                    </span>
                    <span className="dlm-muted">{leg.date}</span>
                  </div>
                ))}
              </div>
            )}

            {/* 做T收益 */}
            <div className="dlm-section">
              <div className="dlm-section-header">
                <span className="dlm-section-title">做T收益</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  {trades.length > 0 && (
                    <button
                      type="button"
                      className="dlm-add-btn dlm-gen-btn"
                      onClick={generateTRecordsFromTrades}
                    >
                      从操作生成
                    </button>
                  )}
                  <button type="button" className="dlm-add-btn" onClick={addTRecord}>
                    + 手动添加
                  </button>
                </div>
              </div>
              {tRecords.length > 0 && (
                <div className="dlm-trecord-head">
                  <span>股票</span>
                  <span>买入价</span>
                  <span>买入量</span>
                  <span>卖出价</span>
                  <span>卖出量</span>
                  <span className="dlm-calc-col">毛利</span>
                  <span className="dlm-calc-col">手续费</span>
                  <span className="dlm-calc-col">印花税</span>
                  <span className="dlm-calc-col dlm-net">净收益</span>
                  <span />
                </div>
              )}
              {tRecords.map((r, i) => (
                <div key={i} className="dlm-trecord-row">
                  <input
                    list="dlm-positions-list"
                    placeholder="股票"
                    value={r.stock}
                    onChange={(e) => updateTRecord(i, 'stock', e.target.value)}
                  />
                  <input
                    placeholder="买价"
                    type="number"
                    step="0.001"
                    value={r.buyPrice}
                    onChange={(e) => updateTRecord(i, 'buyPrice', e.target.value)}
                  />
                  <input
                    placeholder="买量"
                    type="number"
                    value={r.buyShares}
                    onChange={(e) => updateTRecord(i, 'buyShares', e.target.value)}
                  />
                  <input
                    placeholder="卖价"
                    type="number"
                    step="0.001"
                    value={r.sellPrice}
                    onChange={(e) => updateTRecord(i, 'sellPrice', e.target.value)}
                  />
                  <input
                    placeholder="卖量"
                    type="number"
                    value={r.sellShares}
                    onChange={(e) => updateTRecord(i, 'sellShares', e.target.value)}
                  />
                  <input
                    className={`dlm-calc-input ${
                      Number(r.grossProfit) >= 0 ? 'dlm-positive' : 'dlm-negative'
                    }`}
                    placeholder="毛利"
                    type="number"
                    value={r.grossProfit}
                    onChange={(e) => updateTRecord(i, 'grossProfit', e.target.value)}
                  />
                  <input
                    className="dlm-calc-input dlm-muted"
                    placeholder="手续费"
                    type="number"
                    value={r.fee}
                    onChange={(e) => updateTRecord(i, 'fee', e.target.value)}
                  />
                  <input
                    className="dlm-calc-input dlm-muted"
                    placeholder="印花税"
                    type="number"
                    value={r.tax}
                    onChange={(e) => updateTRecord(i, 'tax', e.target.value)}
                  />
                  <input
                    className={`dlm-calc-input dlm-net ${
                      Number(r.netRevenue) >= 0 ? 'dlm-positive' : 'dlm-negative'
                    }`}
                    placeholder="净收益"
                    type="number"
                    value={r.netRevenue}
                    onChange={(e) => updateTRecord(i, 'netRevenue', e.target.value)}
                  />
                  <button type="button" className="dlm-remove-btn" onClick={() => removeTRecord(i)}>
                    ×
                  </button>
                </div>
              ))}
              {tRecords.length === 0 && <div className="dlm-empty">无做T</div>}
              {tRecords.length > 0 && (
                <div className="dlm-trecord-total">
                  今日T合计净收益：
                  <span className={todayTTotal >= 0 ? 'dlm-positive' : 'dlm-negative'}>
                    {todayTTotal} 元
                  </span>
                </div>
              )}
              <label className="dlm-label dlm-monthly">
                本月T累计（元）
                <input
                  type="number"
                  step="0.01"
                  readOnly
                  placeholder={currentMonth ? String(currentMonth.tRevenue) : '0'}
                  value={monthlyTRevenue}
                  style={{ background: '#fafafa', cursor: 'default' }}
                />
              </label>
            </div>

            {/* 波段收益：买卖跨日撮合，交互和做T收益一致 */}
            <div className="dlm-section">
              <div className="dlm-section-header">
                <span className="dlm-section-title">波段收益</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  {trades.some((t) => t.hasIssue) && (
                    <button
                      type="button"
                      className="dlm-add-btn dlm-gen-btn"
                      onClick={generateSwingRecordsFromTrades}
                    >
                      从操作生成
                    </button>
                  )}
                  <button type="button" className="dlm-add-btn" onClick={addSwingRecord}>
                    + 手动添加
                  </button>
                </div>
              </div>
              {swingRecords.length > 0 && (
                <div className="dlm-trecord-head dlm-swing-head">
                  <span>股票</span>
                  <span>买入日</span>
                  <span>买入价</span>
                  <span>买入量</span>
                  <span>卖出日</span>
                  <span>卖出价</span>
                  <span>卖出量</span>
                  <span className="dlm-calc-col">毛利</span>
                  <span className="dlm-calc-col">手续费</span>
                  <span className="dlm-calc-col">印花税</span>
                  <span className="dlm-calc-col dlm-net">净收益</span>
                  <span />
                </div>
              )}
              {swingRecords.map((r, i) => (
                <div key={i} className="dlm-trecord-row dlm-swing-row">
                  <input
                    list="dlm-positions-list"
                    placeholder="股票"
                    value={r.stock}
                    onChange={(e) => updateSwingRecord(i, 'stock', e.target.value)}
                  />
                  <input
                    type="date"
                    value={r.buyDate}
                    onChange={(e) => updateSwingRecord(i, 'buyDate', e.target.value)}
                  />
                  <input
                    placeholder="买价"
                    type="number"
                    step="0.001"
                    value={r.buyPrice}
                    onChange={(e) => updateSwingRecord(i, 'buyPrice', e.target.value)}
                  />
                  <input
                    placeholder="买量"
                    type="number"
                    value={r.buyShares}
                    onChange={(e) => updateSwingRecord(i, 'buyShares', e.target.value)}
                  />
                  <input
                    type="date"
                    value={r.sellDate}
                    onChange={(e) => updateSwingRecord(i, 'sellDate', e.target.value)}
                  />
                  <input
                    placeholder="卖价"
                    type="number"
                    step="0.001"
                    value={r.sellPrice}
                    onChange={(e) => updateSwingRecord(i, 'sellPrice', e.target.value)}
                  />
                  <input
                    placeholder="卖量"
                    type="number"
                    value={r.sellShares}
                    onChange={(e) => updateSwingRecord(i, 'sellShares', e.target.value)}
                  />
                  <input
                    className={`dlm-calc-input ${
                      Number(r.grossProfit) >= 0 ? 'dlm-positive' : 'dlm-negative'
                    }`}
                    placeholder="毛利"
                    type="number"
                    value={r.grossProfit}
                    onChange={(e) => updateSwingRecord(i, 'grossProfit', e.target.value)}
                  />
                  <input
                    className="dlm-calc-input dlm-muted"
                    placeholder="手续费"
                    type="number"
                    value={r.fee}
                    onChange={(e) => updateSwingRecord(i, 'fee', e.target.value)}
                  />
                  <input
                    className="dlm-calc-input dlm-muted"
                    placeholder="印花税"
                    type="number"
                    value={r.tax}
                    onChange={(e) => updateSwingRecord(i, 'tax', e.target.value)}
                  />
                  <input
                    className={`dlm-calc-input dlm-net ${
                      Number(r.netRevenue) >= 0 ? 'dlm-positive' : 'dlm-negative'
                    }`}
                    placeholder="净收益"
                    type="number"
                    value={r.netRevenue}
                    onChange={(e) => updateSwingRecord(i, 'netRevenue', e.target.value)}
                  />
                  <button
                    type="button"
                    className="dlm-remove-btn"
                    onClick={() => removeSwingRecord(i)}
                  >
                    ×
                  </button>
                </div>
              ))}
              {swingRecords.length === 0 && <div className="dlm-empty">无波段</div>}
              {swingRecords.length > 0 && (
                <div className="dlm-trecord-total">
                  今日波段合计净收益：
                  <span className={todaySwingTotal >= 0 ? 'dlm-positive' : 'dlm-negative'}>
                    {todaySwingTotal} 元
                  </span>
                </div>
              )}
              <label className="dlm-label dlm-monthly">
                本月波段累计（元）
                <input
                  type="number"
                  step="0.01"
                  readOnly
                  placeholder={currentMonth ? String(currentMonth.swingRevenue) : '0'}
                  value={monthlySwingRevenue}
                  style={{ background: '#fafafa', cursor: 'default' }}
                />
              </label>
            </div>

            {/* 今日复盘 */}
            <div className="dlm-section">
              <div className="dlm-section-title">今日复盘</div>
              <label className="dlm-label">
                市场情绪
                <input
                  placeholder="大盘表现、板块动向…"
                  value={market}
                  onChange={(e) => set({ market: e.target.value })}
                />
              </label>
              <label className="dlm-label">
                操作感受
                <input
                  placeholder="执行情况、心态…"
                  value={feeling}
                  onChange={(e) => set({ feeling: e.target.value })}
                />
              </label>
              <label className="dlm-label">
                明日计划
                <textarea
                  placeholder="每行一条计划…"
                  value={nextPlan}
                  onChange={(e) => set({ nextPlan: e.target.value })}
                  rows={3}
                />
              </label>
            </div>

            {error && <div className="dlm-error">{error}</div>}

            <div className="dlm-actions">
              <button type="button" className="dlm-btn-cancel" onClick={onClose}>
                取消
              </button>
              <button type="submit" className="dlm-btn-submit" disabled={loading}>
                {loading ? '提交中…' : '提交记录'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default DailyLogModal;
