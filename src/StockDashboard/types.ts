export interface Position {
  /** 股票名称 */
  stock: string;
  /** 股票代码（含市场前缀，如 sz000516、sh600860） */
  code: string;
  /** 持仓成本 */
  cost: number;
  /** 持仓数量 */
  shares: number;
}

/** 带实时价格的持仓（组件内部使用） */
export interface PositionWithPrice extends Position {
  /** 实时价格 */
  price: number;
}

export interface AssetPoint {
  date: string;
  /** 现金 */
  cash: number;
  /** 股票市值 */
  stockValue: number;
  /** 贷款（负数） */
  loan: number;
  /** 其他资产 */
  other: number;
  /** 备注：记录除股票涨跌以外的金钱变更（如还贷、转入资金、提现等） */
  remark?: string;
}

export interface MonthlyRecord {
  month: string;
  tTarget: number;
  tRevenue: number;
}

export interface OtherIncome {
  date: string;
  amount: number;
  desc: string;
}

export interface StockDashboardProps {
  /** 资产曲线数据 */
  assetHistory: AssetPoint[];
  /** 当前持仓 */
  positions: Position[];
  /** 月度数据 */
  monthly: MonthlyRecord[];
  /** 其他收入记录 */
  otherIncome: OtherIncome[];
}
