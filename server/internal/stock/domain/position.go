package domain

// Position 表示当前持仓。
// 它保留了 JSON 中原本没有被前端类型声明覆盖的 base/target，避免迁移到数据库时丢数据。
type Position struct {
	ID uint
	// Stock 是股票名称，例如“国际医学”。
	Stock string
	// Code 是带市场前缀的代码，例如 sz000516；实时价格接口也依赖这个字段。
	Code string
	// Cost 是当前持仓成本。
	Cost float64
	// Shares 是当前持仓数量。
	Shares float64
	Remark *string
	// DisplayOrder 用于保持 JSON 中原本的展示顺序。
	DisplayOrder int
	// Active 让以后可以软隐藏某个持仓，而不是直接删除历史信息。
	Active bool
	// Base 表示底仓计划；当前每个持仓最多一个底仓记录。
	Base *PositionBase
	// Targets 表示目标价/目标仓位计划，一个持仓可以有多个目标。
	Targets []PositionTarget
}

// PositionBase 表示底仓信息。
type PositionBase struct {
	ID     uint
	Cost   float64
	Shares float64
	Date   *string
	Remark *string
}

// PositionTarget 表示一个持仓目标。
type PositionTarget struct {
	ID     uint
	Cost   float64
	Price  float64
	Shares float64
	Date   *string
	Remark *string
	// Status 预留 planned/hit/cancelled 等状态，第一阶段默认 planned。
	Status string
	// DisplayOrder 保持目标数组原有顺序。
	DisplayOrder int
}
