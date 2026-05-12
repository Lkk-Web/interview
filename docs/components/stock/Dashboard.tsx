/**
 * title: 股票仪表盘
 * description: 个人资产曲线与持仓分布可视化
 */
import React from 'react';
import { StockDashboard } from 'interview';
import assetHistory from '../../../data/stock/asset-history.json';
import positions from '../../../data/stock/positions.json';
import monthly from '../../../data/stock/monthly.json';
import otherIncome from '../../../data/stock/other-income.json';

export default () => (
  <StockDashboard
    assetHistory={assetHistory as any}
    positions={positions}
    monthly={monthly as any}
    otherIncome={otherIncome}
  />
);
