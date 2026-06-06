package domain

// MonthlyRecord 表示某个月的 T 操作目标和实际收益。
// 这个结构对应 data/stock/monthly.json，同时也是数据库读取后的业务对象。
type MonthlyRecord struct {
	ID uint
	// Month 使用 YYYY-MM 字符串，排序和展示都比较直观。
	Month string
	// TTarget 是当月 T 操作收益目标。
	TTarget float64
	// TRevenue 是当月已实现 T 操作收益。
	TRevenue float64
	Remark   *string
}
