package domain

// PositionSnapshot 是某一天的持仓快照，与当日持仓变更一起存档。
type PositionSnapshot struct {
	Stock  string
	Code   string
	Cost   float64
	Shares float64
	Price  float64 // 当日收盘价（记录时填入）
}

// DailyLog 是每日收盘记录的聚合根，包含持仓更新、操作记录、做T收益和复盘。
type DailyLog struct {
	ID     uint
	Date   string // YYYY-MM-DD
	Marker string // "！" / "？" / ""

	// Positions 是当日持仓快照，用于历史查询。
	Positions []PositionSnapshot

	// PositionUpdates 是当日收盘后各持仓的成本和数量，用于同步 positions.json。
	PositionUpdates []PositionUpdate

	Trades   []Trade
	TRecords []TRecord

	// MonthlyTRevenue 是本月做T的最新累计净收益，提交后会更新 stock_monthly_records。
	MonthlyTRevenue float64

	Review DailyReview
}

// PositionUpdate 仅包含更新持仓所需的字段，避免和完整 Position 混用。
type PositionUpdate struct {
	Stock  string
	Code   string
	Cost   float64
	Shares float64
	Price  float64 // 当日收盘价，随快照一起存档
}

// Trade 是单笔买卖操作记录。
type Trade struct {
	Action string // "买入" 或 "卖出"
	Stock  string
	Code   string
	Price  float64
	Shares float64
}

// TRecord 是单笔做T的收益明细。
type TRecord struct {
	Stock       string
	Desc        string  // 如 "4.24买3800→4.28卖4000"
	GrossProfit float64 // 毛利
	Fee         float64 // 手续费
	Tax         float64 // 印花税
	NetRevenue  float64 // 净收益
}

// DailyReview 是当日复盘内容。
type DailyReview struct {
	Market   string // 市场情绪
	Feeling  string // 操作感受
	NextPlan string // 明日计划（多行用 \n 分隔）
}
