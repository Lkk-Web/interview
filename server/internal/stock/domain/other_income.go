package domain

// OtherIncome 表示股票价格变化之外的收入或支出。
// 例如转入现金、还款、旅游支出等，都可以记录在这里。
type OtherIncome struct {
	ID uint
	// Date 使用 YYYY-MM-DD，方便和资产快照按日期对齐。
	Date string
	// Amount 正数代表收入，负数代表支出。
	Amount float64
	// Description 对应前端 JSON 里的 desc；领域层使用更清晰的命名。
	Description string
	Remark      *string
}
