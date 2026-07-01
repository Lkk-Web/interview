import React, { useMemo, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import type { StockDashboardProps, MonthlyRecord } from './types';
import { useStockPrice } from './hooks/useStockPrice';
import AssetChart from './components/AssetChart';
import PositionPie from './components/PositionPie';
import AddAssetHistoryModal from './components/AddAssetHistoryModal';
import DailyLogModal from './components/DailyLogModal';
import { useDraftStore, setDraft } from '../store';
import './index.less';

// 新月份还没有提交任何记录时的默认做T目标（与后端 AddDailyLog 的默认值保持一致）
const DEFAULT_MONTHLY_T_TARGET = 2500;

const StockDashboard: React.FC<StockDashboardProps> = ({
  assetHistory,
  positions: rawPositions,
  monthly,
  otherIncome,
  onDailyLogSubmitted,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDailyLogModal, setShowDailyLogModal] = useState(false);
  const dailyLogDraft = useDraftStore();

  // 获取实时股价
  const { positions, loading, error, refresh, updatedAt } = useStockPrice(rawPositions);

  // 统计数据
  const stats = useMemo(() => {
    // 累计做T收益：从 monthly 的 tRevenue 累加
    const totalTProfit = monthly.reduce((sum, m) => sum + (m.tRevenue || 0), 0);

    // 资产变化（自动计算 totalAsset）
    const calcTotal = (d: any) => (d.cash || 0) + (d.stockValue || 0) + (d.loan || 0);
    const assetStart = assetHistory.length > 0 ? calcTotal(assetHistory[0]) : 0;
    const assetEnd = assetHistory.length > 0 ? calcTotal(assetHistory[assetHistory.length - 1]) : 0;
    const assetChange = assetEnd - assetStart;
    const assetChangePercent = assetStart > 0 ? ((assetChange / assetStart) * 100).toFixed(2) : '0';

    // 当月做T：按“今天所在的年月”匹配，而不是数组最后一项
    // （monthly 只在提交过记录后才会新增当月数据，跨月第一天时数组最后一项还是上月）
    const currentMonthKey = new Date().toLocaleDateString('sv').slice(0, 7); // "2026-07"
    const currentMonth =
      monthly.find((m) => m.month === currentMonthKey) ??
      ({ month: currentMonthKey, tTarget: DEFAULT_MONTHLY_T_TARGET, tRevenue: 0 } as MonthlyRecord);

    // 累计其他收入
    const totalOtherIncome = otherIncome.reduce((sum, d) => sum + d.amount, 0);

    return {
      totalTProfit,
      assetEnd,
      assetChange,
      assetChangePercent,
      currentMonth,
      totalOtherIncome,
    };
  }, [assetHistory, monthly, otherIncome]);

  return (
    <div className="stock-dashboard">
      <Toaster position="top-center" />
      {/* 统计卡片 */}
      <div className="stock-stats-grid">
        <div className="stock-stat-card">
          <div className="stock-stat-label">总资产</div>
          <div className="stock-stat-value">¥{stats.assetEnd.toLocaleString()}</div>
          <div className={`stock-stat-change ${stats.assetChange >= 0 ? 'positive' : 'negative'}`}>
            {stats.assetChange >= 0 ? '+' : ''}¥{stats.assetChange.toLocaleString()}(
            {stats.assetChange >= 0 ? '+' : ''}
            {stats.assetChangePercent}%)
          </div>
        </div>
        <div className="stock-stat-card">
          <div className="stock-stat-label">累计做T收益</div>
          <div className="stock-stat-value positive">¥{stats.totalTProfit.toFixed(2)}</div>
          <div className="stock-stat-sub">累计{monthly.length}个月</div>
        </div>
        <div className="stock-stat-card">
          <div className="stock-stat-label">累计其他收入</div>
          <div className="stock-stat-value">¥{stats.totalOtherIncome.toLocaleString()}</div>
          <div className="stock-stat-sub">共{otherIncome.length}笔</div>
        </div>
        <div className="stock-stat-card">
          <div className="stock-stat-label">本月做T进度</div>
          <div className="stock-stat-value">
            ¥{stats.currentMonth?.tRevenue || 0}
            <span className="stock-stat-target"> / ¥{stats.currentMonth?.tTarget || 0}</span>
          </div>
          <div className="stock-stat-progress">
            <div
              className="stock-stat-progress-bar"
              style={{
                // 做T为负时 tRevenue/tTarget 会算出负百分比，CSS 里负宽度无效会被忽略，
                // 需要下限 clamp 到 0，否则条看起来和实际负收益不符
                width: `${Math.max(
                  0,
                  Math.min(
                    ((stats.currentMonth?.tRevenue || 0) / (stats.currentMonth?.tTarget || 1)) *
                      100,
                    100,
                  ),
                )}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* 资产曲线 */}
      <div className="stock-chart-section">
        <div className="stock-section-header">
          <h3 className="stock-section-title">资产曲线</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="stock-record-btn"
              onClick={() => {
                // positionForms 为空时（首次打开或提交后重置），用当前持仓初始化
                if (dailyLogDraft.positionForms.length === 0 && rawPositions.length > 0) {
                  setDraft({
                    ...dailyLogDraft,
                    positionForms: rawPositions.map((p) => ({
                      code: p.code,
                      stock: p.stock,
                      cost: String(p.cost),
                      shares: String(p.shares),
                      price: '',
                    })),
                  });
                }
                setShowDailyLogModal(true);
              }}
            >
              每日记录
            </button>
            <button className="stock-record-btn" onClick={() => setShowAddModal(true)}>
              + 记录
            </button>
          </div>
        </div>
        <AssetChart data={assetHistory} />
      </div>

      {/* 持仓分布 */}
      <div className="stock-chart-section">
        <div className="stock-section-header">
          <h3 className="stock-section-title">当前持仓分布</h3>
          <div className="stock-price-status">
            {loading && <span className="stock-loading">加载行情中...</span>}
            {error && <span className="stock-error">{error}</span>}
            {updatedAt && !loading && (
              <span className="stock-updated">
                实时行情 · {updatedAt}
                <button className="stock-refresh-btn" onClick={refresh} title="刷新行情">
                  ↻
                </button>
              </span>
            )}
          </div>
        </div>
        {!loading && positions.some((p) => p.price > 0) ? (
          <PositionPie positions={positions} />
        ) : !loading && error ? (
          <div className="stock-error-tip">行情获取失败，请刷新重试</div>
        ) : null}
      </div>

      {showAddModal && (
        <AddAssetHistoryModal
          assetHistory={assetHistory}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            onDailyLogSubmitted?.();
          }}
        />
      )}
      {showDailyLogModal && (
        <DailyLogModal
          positions={rawPositions}
          currentMonth={stats.currentMonth}
          draft={dailyLogDraft}
          onDraftChange={setDraft}
          onClose={() => setShowDailyLogModal(false)}
          onSubmitted={onDailyLogSubmitted}
        />
      )}
    </div>
  );
};

export default StockDashboard;
