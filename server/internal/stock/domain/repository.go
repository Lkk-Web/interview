package domain

import "context"

// Repository 是 stock 领域需要的持久化能力清单。
// 它放在 domain 层，是为了让业务代码依赖”能力”，而不是依赖 GORM/PostgreSQL 这些具体工具。
type Repository interface {
	ListAssetHistories(ctx context.Context) ([]AssetHistory, error)
	ListMonthlyRecords(ctx context.Context) ([]MonthlyRecord, error)
	ListOtherIncomes(ctx context.Context) ([]OtherIncome, error)
	ListActivePositions(ctx context.Context) ([]Position, error)
	ImportSnapshot(ctx context.Context, snapshot ImportSnapshot) error
	// AddAssetHistory 新增一条资产快照并同步 JSON 文件。
	AddAssetHistory(ctx context.Context, item AssetHistory) (AssetHistory, error)
	// AddDailyLog 写入每日收盘记录，同时更新持仓、月度T收益，并追加 stock.md。
	AddDailyLog(ctx context.Context, log DailyLog) error
	// GetDailyLog 按日期查询当日收盘记录，不存在时返回 nil。
	GetDailyLog(ctx context.Context, date string) (*DailyLog, error)
	// ImportDailyLogs 批量导入历史记录（不触发文件同步，幂等）。
	ImportDailyLogs(ctx context.Context, logs []DailyLog) error
}

// ImportSnapshot 是一次导入所需的完整股票数据快照。
// importer 先把 JSON 转成领域对象，再交给 repository 写入数据库。
type ImportSnapshot struct {
	AssetHistories []AssetHistory
	MonthlyRecords []MonthlyRecord
	OtherIncomes   []OtherIncome
	Positions      []Position
}
