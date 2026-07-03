import React, { useMemo, useState } from 'react';
import type { PositionWithPrice } from '../../types';
import './index.less';

interface Props {
  /** 当前持仓（带实时价格），用作计算的基础数据 */
  positions: PositionWithPrice[];
  onClose: () => void;
}

type Action = '买入' | '卖出';

const round2 = (n: number) => Math.round(n * 100) / 100;
// 成本精度和持仓成本输入一致（3位小数，见 DailyLogModal 的 step="0.001"）。
// 关键：先四舍五入一次拿到"操作后成本"，后面浮动盈亏也用这个四舍五入后的值去算，
// 保证用户拿卡片上显示的数字手算也能对上，不会出现"显示的成本和用来算盈亏的成本不一致"。
const round3 = (n: number) => Math.round(n * 1000) / 1000;

const TargetCalcModal: React.FC<Props> = ({ positions, onClose }) => {
  const [code, setCode] = useState(positions[0]?.code ?? '');
  const [action, setAction] = useState<Action>('买入');
  const [price, setPrice] = useState('');
  const [shares, setShares] = useState('');

  const position = positions.find((p) => p.code === code);

  // 计算结果：买入按加权平均法算新成本；卖出不改变剩余持仓的成本（只减少股数）。
  // 卖出数量超过持仓时视为清仓，不允许"卖空"，按持仓数量封顶。
  // 浮动盈亏是情景模拟：假设股价到了输入的这个目标价，操作后剩余持仓在该价位下浮盈浮亏多少。
  const result = useMemo(() => {
    if (!position) return null;
    const inputPrice = Number(price);
    const inputShares = Number(shares);
    if (!inputPrice || !inputShares || inputPrice <= 0 || inputShares <= 0) return null;

    let newShares: number;
    let newCost: number;
    if (action === '买入') {
      newShares = position.shares + inputShares;
      newCost = round3((position.cost * position.shares + inputPrice * inputShares) / newShares);
    } else {
      // 摊薄成本法：把这次卖出已实现的盈亏，按"卖出股数 / 卖出前持仓股数"的比例
      // 冲抵到原成本上——卖出赚钱则拉低剩余成本，卖出亏钱则推高剩余成本。
      // 注意：这不是标准券商口径的持仓成本（标准口径下卖出不改变成本），
      // 这里按用户要求实现的是"已实现盈亏摊薄进剩余仓位"的参考成本。
      const soldShares = Math.min(inputShares, position.shares);
      newShares = Math.max(0, position.shares - inputShares);
      newCost = round3(
        position.cost - (inputPrice - position.cost) * (soldShares / position.shares),
      );
    }

    let profitLoss: number;
    let profitPercent: number;
    if (newShares > 0) {
      // 用四舍五入后的 newCost 算浮动盈亏，而不是未四舍五入的原始值，
      // 保证用户拿"操作后成本"这一行显示的数字手算也能对上"持仓浮动盈亏"。
      profitLoss = round2((inputPrice - newCost) * newShares);
      profitPercent = newCost > 0 ? round2(((inputPrice - newCost) / newCost) * 100) : 0;
    } else {
      // 清仓（卖出数量 >= 全部持仓）：摊薄成本公式在这里没有意义（没有"剩余持仓"了），
      // 改成直接算这笔卖出真实实现的盈亏 = (卖出价 - 原成本) × 卖出股数。
      const soldShares = Math.min(inputShares, position.shares);
      profitLoss = round2((inputPrice - position.cost) * soldShares);
      profitPercent =
        position.cost > 0 ? round2(((inputPrice - position.cost) / position.cost) * 100) : 0;
    }

    return { newShares, newCost, profitLoss, profitPercent };
  }, [position, action, price, shares]);

  return (
    <div className="tcm-overlay" onClick={onClose}>
      <div className="tcm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="tcm-header">
          <span>目标计算</span>
          <button className="tcm-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="tcm-body">
          <label className="tcm-label">
            股票
            <select value={code} onChange={(e) => setCode(e.target.value)}>
              {positions.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.stock}
                </option>
              ))}
            </select>
          </label>

          {position && (
            <div className="tcm-current">
              当前：成本¥{position.cost} × {position.shares}股 · 现价¥{position.price}
            </div>
          )}

          <div className="tcm-row">
            <label className="tcm-label">
              操作
              <select value={action} onChange={(e) => setAction(e.target.value as Action)}>
                <option value="买入">买入</option>
                <option value="卖出">卖出</option>
              </select>
            </label>
            <label className="tcm-label">
              价格
              <input
                type="number"
                step="0.01"
                placeholder="价格"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </label>
            <label className="tcm-label">
              数量
              <input
                type="number"
                step="100"
                placeholder="股数"
                value={shares}
                onChange={(e) => setShares(e.target.value)}
              />
            </label>
          </div>

          {position && !result && <div className="tcm-empty">输入价格和数量后查看计算结果</div>}

          {result && (
            <div className="tcm-result">
              <div className="tcm-result-row">
                <span className="tcm-result-label">操作后成本</span>
                <span className="tcm-result-value">¥{result.newCost}</span>
              </div>
              <div className="tcm-result-row">
                <span className="tcm-result-label">操作后持仓</span>
                <span className="tcm-result-value">{result.newShares}股</span>
              </div>
              <div className="tcm-result-row">
                <span className="tcm-result-label">
                  {result.newShares > 0
                    ? `持仓浮动盈亏（按目标价¥${price}）`
                    : `已实现盈亏（清仓，按¥${price}卖出）`}
                </span>
                <span
                  className={`tcm-result-value ${
                    result.profitLoss >= 0 ? 'tcm-positive' : 'tcm-negative'
                  }`}
                >
                  {result.profitLoss >= 0 ? '+' : ''}¥{result.profitLoss.toLocaleString()}（
                  {result.profitLoss >= 0 ? '+' : ''}
                  {result.profitPercent}%）
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TargetCalcModal;
