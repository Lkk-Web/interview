package domain

// AssetHistory 表示某一天的资产快照。
// 这是领域层对象，不带 json/gorm 标签，避免核心业务模型被 HTTP 或数据库细节污染。
type AssetHistory struct {
	// ID 是数据库主键；业务判断通常不要依赖它，更多依赖 Date 这样的稳定业务字段。
	ID uint
	// Date 使用 YYYY-MM-DD 字符串，和现有 JSON/前端保持一致。
	Date string
	// Cash 表示现金余额。
	Cash float64
	// StockValue 表示当天股票总市值。
	StockValue float64
	// Loan 表示贷款/负债；当前数据里负数代表欠款。
	Loan float64
	// Other 表示股票涨跌以外的其他资产变化。
	Other float64
	// Remark 用指针是为了区分“没有备注”和“备注为空字符串”。
	Remark *string
}
