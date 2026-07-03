import React, { useMemo, useState } from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  DataZoomComponent,
  LegendComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { AssetPoint } from '../../types';
import { useAlphaCurves, getDefaultAlphaStartDates } from '../../hooks/useAlphaCurves';
import './index.less';

echarts.use([
  LineChart,
  GridComponent,
  TooltipComponent,
  DataZoomComponent,
  LegendComponent,
  CanvasRenderer,
]);

interface AlphaChartProps {
  assetHistory: AssetPoint[];
}

const formatMoney = (val: number) => {
  const prefix = val >= 0 ? '' : '-';
  return `${prefix}¥${Math.abs(val).toLocaleString()}`;
};

// 对比曲线颜色：各条之间足够区分，与主线蓝色（#4facfe）保持视觉层级
const ALPHA_COLORS = ['#9254de', '#f5a623', '#13c2c2', '#f5222d', '#52c41a'];

const AlphaChart: React.FC<AlphaChartProps> = ({ assetHistory }) => {
  // 默认近 3 个月月初，用户可以再手动追加自定义起点（纯前端分析，不落库）
  const [startDates, setStartDates] = useState<string[]>(() => getDefaultAlphaStartDates());
  const [customDate, setCustomDate] = useState('');

  const { curves, loading } = useAlphaCurves(startDates, assetHistory);

  const addCustomStart = () => {
    if (!customDate || startDates.includes(customDate)) return;
    setStartDates([...startDates, customDate]);
    setCustomDate('');
  };
  const removeStart = (d: string) => setStartDates(startDates.filter((s) => s !== d));

  const option = useMemo(() => {
    const dates = assetHistory.map((a) => a.date);
    const stockValueData = assetHistory.map((a) => a.stockValue);

    // 持仓明细/收盘价明细按日期存一份，供 tooltip 里查——不放进图例，避免文字堆一起看不清
    const positionsDescByLabel: Record<string, string> = {};
    const breakdownByLabelDate: Record<
      string,
      Record<string, { stock: string; shares: number; close: number }[]>
    > = {};

    const alphaSeries = curves.map((curve, i) => {
      positionsDescByLabel[curve.label] = curve.positionsDesc;
      const breakdownByDate: Record<string, { stock: string; shares: number; close: number }[]> =
        {};
      const valueByDate: Record<string, number> = {};
      curve.points.forEach((p) => {
        valueByDate[p.date] = p.value;
        breakdownByDate[p.date] = p.breakdown;
      });
      breakdownByLabelDate[curve.label] = breakdownByDate;

      // Alpha 曲线的起点早于图表整体范围时，前面用 null 占位，保持 x 轴对齐
      const data = dates.map((d) => (d in valueByDate ? valueByDate[d] : null));
      return {
        name: curve.label,
        type: 'line' as const,
        data,
        smooth: true,
        symbol: 'none',
        connectNulls: false,
        lineStyle: {
          width: 1.5,
          type: 'dashed' as const,
          color: ALPHA_COLORS[i % ALPHA_COLORS.length],
        },
        itemStyle: { color: ALPHA_COLORS[i % ALPHA_COLORS.length] },
      };
    });

    return {
      tooltip: {
        trigger: 'axis',
        confine: true,
        backgroundColor: 'rgba(255,255,255,0.96)',
        borderColor: '#e8e8e8',
        borderWidth: 1,
        textStyle: { color: '#333', fontSize: 13 },
        formatter: (params: any[]) => {
          if (params.length === 0) return '';
          const date = params[0].axisValue;
          const lines = params
            .filter((p) => p.data !== null && p.data !== undefined)
            .map((p) => {
              const breakdown = breakdownByLabelDate[p.seriesName]?.[date];
              // Alpha 曲线额外带上当天每只股票的收盘价，方便直接核对"股数×收盘价"算得对不对；
              // 主线（股票市值）没有 breakdown，走普通展示
              const detail = breakdown?.length
                ? `<div style="font-size:11px;color:#999;margin-left:16px">${breakdown
                    .map((b) => `${b.stock} ${b.close}元×${b.shares.toLocaleString()}股`)
                    .join('<br/>')}</div>`
                : '';
              return `${p.marker}${p.seriesName}：${formatMoney(p.data)}${detail}`;
            });
          return `<div style="font-weight:600;margin-bottom:6px">${date}</div>${lines.join(
            '<br/>',
          )}`;
        },
      },
      legend: {
        data: ['股票市值', ...curves.map((c) => c.label)],
        top: 0,
        textStyle: { fontSize: 12 },
      },
      grid: { left: 60, right: 20, top: 40, bottom: 50 },
      xAxis: {
        type: 'category',
        data: dates,
        axisLabel: {
          fontSize: 11,
          rotate: 30,
          interval: 'auto', // ECharts 自动跳过重叠标签
          formatter: (val: string) => val.slice(5), // 只显示 MM-DD，省掉年份减少宽度
        },
        axisTick: { alignWithLabel: true },
      },
      yAxis: {
        type: 'value',
        scale: true, // 不强制从 0 开始，按实际数据范围自动缩放，避免曲线因量级压缩挤成一条直线
        axisLabel: {
          formatter: (val: number) => `¥${(val / 10000).toFixed(1)}万`,
          fontSize: 11,
        },
        splitLine: { lineStyle: { type: 'dashed' } },
      },
      dataZoom: [
        { type: 'inside', start: 0, end: 100 },
        { type: 'slider', start: 0, end: 100, height: 20, bottom: 8 },
      ],
      series: [
        {
          name: '股票市值',
          type: 'line',
          data: stockValueData,
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          lineStyle: { width: 2.5, color: '#4facfe' },
          itemStyle: { color: '#4facfe' },
        },
        ...alphaSeries,
      ],
    };
  }, [assetHistory, curves]);

  return (
    <div className="alpha-chart">
      <div className="alpha-chart-controls">
        {startDates.map((d) => (
          <span key={d} className="alpha-chart-tag">
            {d}
            <button type="button" onClick={() => removeStart(d)} title="移除该起点曲线">
              ×
            </button>
          </span>
        ))}
        <input
          type="date"
          value={customDate}
          onChange={(e) => setCustomDate(e.target.value)}
          className="alpha-chart-date-input"
        />
        <button type="button" className="alpha-chart-add-btn" onClick={addCustomStart}>
          + 添加起点
        </button>
        {loading && <span className="alpha-chart-loading">计算中…</span>}
      </div>
      <ReactEChartsCore
        echarts={echarts}
        option={option}
        notMerge // 起点曲线数量变化时（增删）必须整体替换，否则 ECharts 默认合并模式
        // 会按 series 索引合并，数量变少时旧曲线不会被移除，导致叉掉后线还留着
        style={{ height: 380, width: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
};

export default AlphaChart;
