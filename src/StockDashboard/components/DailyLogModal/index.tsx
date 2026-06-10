import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { API_BASE, ADMIN_TOKEN } from '../../../constants';
import type { Position, MonthlyRecord } from '../../types';
import './index.less';

interface Props {
  positions: Position[];
  currentMonth?: MonthlyRecord;
  draft: DailyLogDraft;
  onDraftChange: (draft: DailyLogDraft) => void;
  onClose: () => void;
}

// 草稿类型导出供父组件持有
export interface DailyLogDraft {
  date: string;
  positionForms: PositionForm[];
  trades: TradeRow[];
  tRecords: TRecordRow[];
  monthlyTRevenue: string;
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
    })),
    trades: [],
    tRecords: [],
    monthlyTRevenue: String(currentMonth?.tRevenue ?? ''),
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
}

interface TradeRow {
  action: string;
  stock: string;
  code: string;
  price: string;
  shares: string;
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

const today = () => new Date().toISOString().slice(0, 10);

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
}) => {
  const { date, positionForms, trades, tRecords, monthlyTRevenue, market, feeling, nextPlan } =
    draft;
  const set = (partial: Partial<DailyLogDraft>) => onDraftChange({ ...draft, ...partial });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const marker = trades.length === 0 ? '' : trades.some((t) => t.hasIssue) ? '？' : '！';

  const addPositionForm = () =>
    set({ positionForms: [...positionForms, { code: '', stock: '', cost: '', shares: '' }] });
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
    const sells = trades.filter((t) => t.action === '卖出' && t.stock && t.price && t.shares);
    const buys = trades.filter((t) => t.action === '买入' && t.stock && t.price && t.shares);
    const generated: TRecordRow[] = [];

    for (const sell of sells) {
      const matchingBuys = buys.filter((b) => b.stock === sell.stock);
      if (matchingBuys.length === 0) continue;

      const totalBuyShares = matchingBuys.reduce((s, b) => s + Number(b.shares), 0);
      const totalBuyCost = matchingBuys.reduce((s, b) => s + Number(b.price) * Number(b.shares), 0);
      const avgBuyPrice = round2(totalBuyCost / totalBuyShares);
      const sellAmount = Number(sell.price) * Number(sell.shares);
      const matched = Math.min(totalBuyShares, Number(sell.shares));
      const grossProfit = round2((Number(sell.price) - avgBuyPrice) * matched);

      // 每笔买入各自计一次佣金，合并后只算一笔会少收
      const buyFees = matchingBuys.reduce(
        (sum, b) =>
          sum + Math.max(Number(b.price) * Number(b.shares) * COMMISSION_RATE, COMMISSION_MIN),
        0,
      );
      const fee = round2(buyFees + Math.max(sellAmount * COMMISSION_RATE, COMMISSION_MIN));
      const tax = round2(sellAmount * STAMP_TAX_RATE);

      generated.push({
        stock: sell.stock,
        buyPrice: String(avgBuyPrice),
        buyShares: String(totalBuyShares),
        sellPrice: sell.price,
        sellShares: sell.shares,
        grossProfit: String(grossProfit),
        fee: String(fee),
        tax: String(tax),
        netRevenue: String(round2(grossProfit - fee - tax)),
      });
    }
    if (generated.length > 0) set({ tRecords: generated });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const body = {
      date,
      marker,
      positions: positionForms.map((p) => ({
        code: p.code,
        cost: Number(p.cost) || 0,
        shares: Number(p.shares) || 0,
      })),
      trades: trades.map((t) => ({
        action: t.action,
        stock: t.stock,
        code: t.code,
        price: Number(t.price) || 0,
        shares: Number(t.shares) || 0,
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
      monthlyTRevenue: Number(monthlyTRevenue) || 0,
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
              <div
                className={`dlm-marker-badge dlm-marker-${
                  marker === '' ? 'none' : marker === '！' ? 'op' : 'warn'
                }`}
              >
                {marker === '' && '— 无操作'}
                {marker === '！' && '！有操作'}
                {marker === '？' && '⚠ 问题操作'}
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
                        const next = { ...p, stock: e.target.value, code: pos ? pos.code : p.code };
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
                <select value={t.action} onChange={(e) => updateTrade(i, 'action', e.target.value)}>
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
                <label className="dlm-issue-label" title="标记为问题操作">
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
                placeholder={currentMonth ? String(currentMonth.tRevenue) : ''}
                value={monthlyTRevenue}
                onChange={(e) => set({ monthlyTRevenue: e.target.value })}
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
      </div>
    </div>
  );
};

export default DailyLogModal;
