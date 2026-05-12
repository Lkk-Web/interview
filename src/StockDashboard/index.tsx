import React, { useMemo } from 'react';
import type { StockDashboardProps } from './types';
import AssetChart from './AssetChart';
import PositionPie from './PositionPie';
import './index.less';

const StockDashboard: React.FC<StockDashboardProps> = ({
  assetHistory,
  positions,
  monthly,
  otherIncome,
}) => {
  // 统计数据
  const stats = useMemo(() => {
    // 累计做T收益：从 monthly 的 tRevenue 累加
    const totalTProfit = monthly.reduce((sum, m) => sum + (m.tRevenue || 0), 0);

    // 资产变化
    const assetStart = assetHistory[0]?.totalAsset || 0;
    const assetEnd = assetHistory[assetHistory.length - 1]?.totalAsset || 0;
    const assetChange = assetEnd - assetStart;
    const assetChangePercent = assetStart > 0 ? ((assetChange / assetStart) * 100).toFixed(2) : '0';

    // 当月做T
    const currentMonth = monthly[monthly.length - 1];

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
                width: `${Math.min(
                  ((stats.currentMonth?.tRevenue || 0) / (stats.currentMonth?.tTarget || 1)) * 100,
                  100,
                )}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* 资产曲线 */}
      <div className="stock-chart-section">
        <h3 className="stock-section-title">资产曲线</h3>
        <AssetChart data={assetHistory} />
      </div>

      {/* 持仓分布 */}
      <div className="stock-chart-section">
        <h3 className="stock-section-title">当前持仓分布</h3>
        <PositionPie positions={positions} />
      </div>
    </div>
  );
};

export default StockDashboard;
