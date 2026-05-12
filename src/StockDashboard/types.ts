export interface Position {
  stock: string;
  code: string;
  cost: number;
  price: number;
  shares: number;
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
  /** 总资产 = cash + stockValue + loan + other */
  totalAsset: number;
  /** 备注：记录除股票涨跌以外的金钱变更（如还贷、转入资金、提现等） */
  remark?: string;
}

export interface MonthlyRecord {
  month: string;
  tTarget: number;
  revenue: number | null;
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
