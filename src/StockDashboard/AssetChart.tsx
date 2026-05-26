import React, { useMemo } from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  DataZoomComponent,
  MarkLineComponent,
  LegendComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { AssetPoint } from './types';

echarts.use([
  LineChart,
  GridComponent,
  TooltipComponent,
  DataZoomComponent,
  MarkLineComponent,
  LegendComponent,
  CanvasRenderer,
]);

interface AssetChartProps {
  data: AssetPoint[];
}

const formatMoney = (val: number) => {
  const prefix = val >= 0 ? '' : '-';
  return `${prefix}¥${Math.abs(val).toLocaleString()}`;
};

const AssetChart: React.FC<AssetChartProps> = ({ data }) => {
  const option = useMemo(() => {
    const calcTotal = (d: AssetPoint) => d.cash + d.stockValue + d.loan;

    const dates = data.map((d) => d.date);
    const totalAssets = data.map((d) => calcTotal(d));
    const cashData = data.map((d) => d.cash);
    const stockData = data.map((d) => d.stockValue);
    const loanData = data.map((d) => d.loan);
    const otherData = data.map((d) => d.other);

    const startValue = totalAssets[0] || 0;

    // 按月分组，找到每月第一天的值
    const monthFirstMap: Record<string, number> = {};
    data.forEach((d, i) => {
      const month = d.date.slice(0, 7); // "2026-05"
      if (!(month in monthFirstMap)) {
        monthFirstMap[month] = totalAssets[i];
      }
    });

    return {
      tooltip: {
        trigger: 'axis',
        confine: true,
        backgroundColor: 'rgba(255,255,255,0.96)',
        borderColor: '#e8e8e8',
        borderWidth: 1,
        textStyle: { color: '#333', fontSize: 12 },
        formatter: (params: any) => {
          const idx = params[0]?.dataIndex;
          if (idx === undefined) return '';
          const point = data[idx];
          const total = calcTotal(point);
          const change = total - startValue;
          const changePercent = startValue ? ((change / startValue) * 100).toFixed(2) : '0';
          const changeColor = change >= 0 ? '#c23531' : '#2f4554';

          const currentMonth = point.date.slice(0, 7);
          const monthStart = monthFirstMap[currentMonth] || total;
          const monthChange = total - monthStart;
          const monthPercent = monthStart ? ((monthChange / monthStart) * 100).toFixed(2) : '0';
          const monthColor = monthChange >= 0 ? '#c23531' : '#2f4554';

          const prevTotal = idx > 0 ? totalAssets[idx - 1] : total;
          const dayChange = total - prevTotal;
          const dayPercent = prevTotal ? ((dayChange / prevTotal) * 100).toFixed(2) : '0';
          const dayColor = dayChange >= 0 ? '#c23531' : '#2f4554';

          return `
            <div style="padding:2px 0;max-width:200px;word-break:break-all">
              <div style="font-weight:600;font-size:12px">${point.date}</div>
              <div style="font-size:12px;font-weight:600;margin:2px 0">总资产：${formatMoney(total)}</div>
              <div style="color:#666;font-size:11px;line-height:1.5">
                现金：${formatMoney(point.cash)}<br/>
                股票：${formatMoney(point.stockValue)}<br/>
                贷款：${formatMoney(point.loan)}<br/>
                其他：${formatMoney(point.other)}
              </div>
              <div style="font-size:11px;margin-top:3px;line-height:1.5">
                <div style="color:${dayColor}">日：${dayChange >= 0 ? '+' : ''}${dayPercent}%</div>
                <div style="color:${monthColor}">月：${monthChange >= 0 ? '+' : ''}${monthPercent}%</div>
                <div style="color:${changeColor}">累：${change >= 0 ? '+' : ''}${changePercent}%</div>
              </div>
              ${point.remark ? `<div style="margin-top:3px;font-size:10px;color:#8c6e00;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">📝 ${point.remark}</div>` : ''}
            </div>
          `;
        },
      },
      legend: {
        data: ['总资产', '现金', '股票市值', '贷款', '其他'],
        top: 0,
        textStyle: { fontSize: 12 },
        // 默认只显示总资产
        selected: {
          总资产: true,
          现金: false,
          股票市值: false,
          贷款: false,
          其他: false,
        },
      },
      grid: {
        left: 60,
        right: 20,
        top: 40,
        bottom: 60,
      },
      xAxis: {
        type: 'category',
        data: dates,
        axisLabel: {
          fontSize: 11,
          rotate: 45,
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (val: number) => `¥${(val / 10000).toFixed(1)}万`,
          fontSize: 11,
        },
        splitLine: {
          lineStyle: { type: 'dashed' },
        },
      },
      dataZoom: [
        { type: 'inside', start: 0, end: 100 },
        { type: 'slider', start: 0, end: 100, height: 20, bottom: 8 },
      ],
      series: [
        {
          name: '总资产',
          type: 'line',
          data: totalAssets,
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            width: 2.5,
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#667eea' },
              { offset: 1, color: '#764ba2' },
            ]),
          },
          itemStyle: { color: '#667eea' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(102, 126, 234, 0.25)' },
              { offset: 1, color: 'rgba(102, 126, 234, 0.02)' },
            ]),
          },
          markLine: {
            silent: true,
            data: [
              {
                yAxis: startValue,
                label: {
                  formatter: `初始 ¥${(startValue / 10000).toFixed(2)}万`,
                  fontSize: 10,
                },
                lineStyle: { type: 'dashed', color: '#999' },
              },
            ],
          },
        },
        {
          name: '现金',
          type: 'line',
          data: cashData,
          smooth: true,
          symbol: 'circle',
          symbolSize: 4,
          lineStyle: { width: 1.5, color: '#43e97b' },
          itemStyle: { color: '#43e97b' },
        },
        {
          name: '股票市值',
          type: 'line',
          data: stockData,
          smooth: true,
          symbol: 'circle',
          symbolSize: 4,
          lineStyle: { width: 1.5, color: '#4facfe' },
          itemStyle: { color: '#4facfe' },
        },
        {
          name: '贷款',
          type: 'line',
          data: loanData,
          smooth: true,
          symbol: 'circle',
          symbolSize: 4,
          lineStyle: { width: 1.5, type: 'dashed', color: '#fa709a' },
          itemStyle: { color: '#fa709a' },
        },
        {
          name: '其他',
          type: 'line',
          data: otherData,
          smooth: true,
          symbol: 'circle',
          symbolSize: 4,
          lineStyle: { width: 1.5, color: '#fee140' },
          itemStyle: { color: '#fee140' },
        },
      ],
    };
  }, [data]);

  return (
    <ReactEChartsCore
      echarts={echarts}
      option={option}
      style={{ height: 380, width: '100%' }}
      opts={{ renderer: 'canvas' }}
    />
  );
};

export default AssetChart;
