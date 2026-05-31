import React, { useMemo } from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { PositionWithPrice } from './types';

echarts.use([PieChart, TooltipComponent, LegendComponent, CanvasRenderer]);

interface PositionPieProps {
  positions: PositionWithPrice[];
}

const COLORS = ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#fee140'];

const PositionPie: React.FC<PositionPieProps> = ({ positions }) => {
  const option = useMemo(() => {
    const pieData = positions.map((p, i) => {
      const marketValue = p.price * p.shares;
      const profitLoss = (p.price - p.cost) * p.shares;
      const profitPercent = (((p.price - p.cost) / p.cost) * 100).toFixed(2);
      return {
        name: p.stock,
        value: Math.round(marketValue),
        itemStyle: { color: COLORS[i % COLORS.length] },
        profitLoss: Math.round(profitLoss),
        profitPercent,
        shares: p.shares,
        cost: p.cost,
        price: p.price,
      };
    });

    const totalValue = pieData.reduce((sum, d) => sum + d.value, 0);

    return {
      tooltip: {
        trigger: 'item',
        confine: true,
        formatter: (params: any) => {
          const d = params.data;
          const plColor = d.profitLoss >= 0 ? '#c23531' : '#2f4554';
          return `
            <div style="font-size:12px;max-width:220px">
              <div style="margin-bottom:4px"><b>${d.name}</b></div>
              <div>市值：¥${d.value.toLocaleString()} · ${d.shares}股</div>
              <div>成本¥${d.cost} → 现价¥${d.price}</div>
              <div style="color:${plColor}">
                盈亏：${d.profitLoss >= 0 ? '+' : ''}¥${d.profitLoss.toLocaleString()}(${
            d.profitLoss >= 0 ? '+' : ''
          }${d.profitPercent}%)
              </div>
              <div>占比：${params.percent}%</div>
            </div>
          `;
        },
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center',
        textStyle: { fontSize: 12 },
      },
      series: [
        {
          type: 'pie',
          radius: ['45%', '70%'],
          center: ['40%', '50%'],
          avoidLabelOverlap: true,
          label: {
            show: true,
            formatter: '{b}\n¥{c}',
            fontSize: 11,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold',
            },
          },
          data: pieData,
        },
        // 中心文字
        {
          type: 'pie',
          radius: ['0%', '0%'],
          center: ['40%', '50%'],
          label: {
            show: true,
            position: 'center',
            formatter: `总市值\n¥${totalValue.toLocaleString()}`,
            fontSize: 14,
            fontWeight: 'bold',
            lineHeight: 22,
            color: '#333',
          },
          data: [{ value: 0, name: '' }],
          silent: true,
        },
      ],
    };
  }, [positions]);

  return (
    <ReactEChartsCore
      echarts={echarts}
      option={option}
      style={{ height: 300, width: '100%' }}
      opts={{ renderer: 'canvas' }}
    />
  );
};

export default PositionPie;
