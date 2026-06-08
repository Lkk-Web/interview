/**
 * title: 股票仪表盘
 * description: 个人资产曲线与持仓分布可视化
 */
import React from 'react';
import { StockDashboard, useStockData } from 'interview';
import type { AssetPoint, MonthlyRecord, OtherIncome, Position } from 'interview';
import assetHistoryFallback from '../../../data/stock/asset-history.json';
import positionsFallback from '../../../data/stock/positions.json';
import monthlyFallback from '../../../data/stock/monthly.json';
import otherIncomeFallback from '../../../data/stock/other-income.json';

export default () => {
  const data = useStockData({
    fallback: {
      assetHistory: assetHistoryFallback as AssetPoint[],
      positions: positionsFallback as Position[],
      monthly: monthlyFallback as MonthlyRecord[],
      otherIncome: otherIncomeFallback as OtherIncome[],
    },
  });

  return <StockDashboard {...data} />;
};
