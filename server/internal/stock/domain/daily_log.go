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
	// "！"=当日有操作 / ""=无操作。历史数据里可能还留有旧版本的"？"（曾表示"问题操作"，
	// 现已不再区分——跨日挂起只是买卖不在同一天，不代表操作有问题），读到时按"有操作"处理即可。
	Marker string

	// Positions 是当日持仓快照，用于历史查询。
	Positions []PositionSnapshot

	// PositionUpdates 是当日收盘后各持仓的成本和数量，用于同步 positions.json。
	PositionUpdates []PositionUpdate

	Trades   []Trade
	TRecords []TRecord

	// SwingRecords 是当日跨日撮合成功的波段收益明细（买卖发生在不同交易日）。
	// 撮合计算（FIFO、手续费/印花税分摊）由前端完成，后端只负责持久化，
	// 这和现有 TRecords 的做法保持一致（前端算好再提交，避免前后端重复实现同一套计算规则）。
	SwingRecords []SwingRecord

	// ConsumedLegs 是本次提交里被消耗（部分或全部匹配掉）的历史未匹配腿，
	// 后端据此扣减/删除 stock_unmatched_legs 中对应记录。
	ConsumedLegs []ConsumedLeg

	// NewUnmatchedLegs 是当日新产生、仍未被匹配完的腿（hasIssue 操作的剩余数量），
	// 会被写入 stock_unmatched_legs，等待未来某天再匹配。
	NewUnmatchedLegs []UnmatchedLeg

	// MonthlyTRevenue 是本月做T的最新累计净收益，提交后会更新 stock_monthly_records。
	MonthlyTRevenue float64
	// MonthlySwingRevenue 是本月波段收益的最新累计净收益，提交后会更新 stock_monthly_records。
	MonthlySwingRevenue float64

	Review DailyReview
}

// ConsumedLeg 表示本次提交消耗了某个历史未匹配腿的多少数量。
type ConsumedLeg struct {
	LegID          uint
	ConsumedShares float64
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
	// HasIssue 标记该腿不参与当日自动撮合（做T），而是作为跨日未匹配仓位挂起，
	// 等待之后某一天出现反向操作时再撮合成波段收益。
	HasIssue bool
}

// TRecord 是单笔做T的收益明细（买卖发生在同一天）。
type TRecord struct {
	Stock       string
	Desc        string  // 如 "4.24买3800→4.28卖4000"
	BuyPrice    float64 // 买入价，用于历史记录回填时还原编辑表单
	BuyShares   float64 // 买入量
	SellPrice   float64 // 卖出价
	SellShares  float64 // 卖出量
	GrossProfit float64 // 毛利
	Fee         float64 // 手续费
	Tax         float64 // 印花税
	NetRevenue  float64 // 净收益
}

// SwingRecord 是一笔波段收益明细（买卖发生在不同交易日，由跨日 FIFO 撮合产生）。
type SwingRecord struct {
	Stock       string
	Desc        string // 如 "5.10买3800→6.02卖4000"
	BuyDate     string
	SellDate    string
	BuyPrice    float64 // 买入价，用于历史记录回填时还原编辑表单
	BuyShares   float64 // 买入量
	SellPrice   float64 // 卖出价
	SellShares  float64 // 卖出量
	GrossProfit float64
	Fee         float64
	Tax         float64
	NetRevenue  float64
}

// UnmatchedLeg 是跨日买/卖腿，跨日持久化，供后续任意天数后撮合波段收益。
// Status: "pending"=待匹配，"matched"=已完全消耗（软删除，不物理删除）。
type UnmatchedLeg struct {
	ID              uint
	DailyLogID      uint
	Date            string // 该腿产生的交易日
	Stock           string
	Code            string
	Action          string // "买入" 或 "卖出"
	Price           float64
	RemainingShares float64 // 尚未被匹配消耗的数量
	TotalShares     float64 // 该腿原始总数量（用于按比例分摊手续费）
	TotalFee        float64 // 该腿产生时分摊到的手续费（下单当天的佣金）
	Status          string  // "pending" | "matched"
}

// DailyReview 是当日复盘内容。
type DailyReview struct {
	Market   string // 市场情绪
	Feeling  string // 操作感受
	NextPlan string // 明日计划（多行用 \n 分隔）
}
