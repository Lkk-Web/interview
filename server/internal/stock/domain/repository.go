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
	// GetAssetHistoryByDate 按日期查单条资产快照，不存在时返回 nil。
	GetAssetHistoryByDate(ctx context.Context, date string) (*AssetHistory, error)
	// UpsertOtherIncome 按日期 upsert 一条其他收入记录并同步 JSON 文件。
	UpsertOtherIncome(ctx context.Context, item OtherIncome) (OtherIncome, error)
	// AddDailyLog 写入每日收盘记录，同时更新持仓、月度T收益，并追加 stock.md。
	AddDailyLog(ctx context.Context, log DailyLog) error
	// GetDailyLog 按日期查询当日收盘记录，不存在时返回 nil。
	GetDailyLog(ctx context.Context, date string) (*DailyLog, error)
	// GetPositionSnapshotAsOf 返回小于等于 date 的最近一次收盘持仓快照（不回退到"当前持仓"），
	// 用于 Alpha 曲线：如果指定日期当天没提交每日记录，就用往前最近一次的真实历史持仓，
	// 而不是用当前持仓掺进历史推算。找不到任何快照时返回 nil。
	GetPositionSnapshotAsOf(ctx context.Context, date string) (*PositionSnapshotAsOf, error)
	// ListPositionSnapshotDates 返回所有"当天确实提交过持仓快照"的日期集合，
	// 用于资产曲线 tooltip：只有这些日期才在"股票"那一行后面展示持仓明细，
	// 区别于 GetPositionSnapshotAsOf 那种会往前回退到最近一次的语义。
	ListPositionSnapshotDates(ctx context.Context) (map[string][]PositionSnapshot, error)
	// ImportDailyLogs 批量导入历史记录（不触发文件同步，幂等）。
	ImportDailyLogs(ctx context.Context, logs []DailyLog) error
	// ListUnmatchedLegs 返回当前所有跨日未匹配的买/卖腿（remaining_shares > 0），供前端展示待匹配仓位。
	ListUnmatchedLegs(ctx context.Context) ([]UnmatchedLeg, error)
}

// PositionSnapshotAsOf 是某个实际交易日（≤ 请求日期的最近一次记录）的持仓快照。
// Date 是真正找到快照的那一天，可能早于请求的日期。
type PositionSnapshotAsOf struct {
	Date      string
	Positions []PositionSnapshot
}

// ImportSnapshot 是一次导入所需的完整股票数据快照。
// importer 先把 JSON 转成领域对象，再交给 repository 写入数据库。
type ImportSnapshot struct {
	AssetHistories []AssetHistory
	MonthlyRecords []MonthlyRecord
	OtherIncomes   []OtherIncome
	Positions      []Position
}
