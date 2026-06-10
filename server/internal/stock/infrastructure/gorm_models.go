package infrastructure

import "time"

// AssetHistoryModel 是 GORM 使用的数据库模型，对应 stock_asset_histories 表。
// 它只负责“Go 字段 <-> 数据库列”的映射，业务层会使用 domain.AssetHistory。
type AssetHistoryModel struct {
	// primaryKey 表示 ID 是这张表的主键。
	ID uint `gorm:"primaryKey"`
	// column 指定数据库列名；uniqueIndex 表示同一天只能有一条资产快照。
	Date       string    `gorm:"column:date;uniqueIndex"`
	Cash       float64   `gorm:"column:cash"`
	StockValue float64   `gorm:"column:stock_value"`
	Loan       float64   `gorm:"column:loan"`
	Other      float64   `gorm:"column:other"`
	Remark     *string   `gorm:"column:remark"`
	CreatedAt  time.Time `gorm:"column:created_at"`
	UpdatedAt  time.Time `gorm:"column:updated_at"`
}

// TableName 告诉 GORM 使用已有表名 stock_asset_histories，避免它按结构体名自动推导错表名。
func (AssetHistoryModel) TableName() string { return "stock_asset_histories" }

type MonthlyRecordModel struct {
	ID        uint      `gorm:"primaryKey"`
	Month     string    `gorm:"column:month;uniqueIndex"`
	TTarget   float64   `gorm:"column:t_target"`
	TRevenue  float64   `gorm:"column:t_revenue"`
	Remark    *string   `gorm:"column:remark"`
	CreatedAt time.Time `gorm:"column:created_at"`
	UpdatedAt time.Time `gorm:"column:updated_at"`
}

func (MonthlyRecordModel) TableName() string { return "stock_monthly_records" }

type OtherIncomeModel struct {
	ID          uint      `gorm:"primaryKey"`
	Date        string    `gorm:"column:date"`
	Amount      float64   `gorm:"column:amount"`
	Description string    `gorm:"column:description"`
	Remark      *string   `gorm:"column:remark"`
	CreatedAt   time.Time `gorm:"column:created_at"`
	UpdatedAt   time.Time `gorm:"column:updated_at"`
}

func (OtherIncomeModel) TableName() string { return "stock_other_incomes" }

type PositionModel struct {
	ID           uint                  `gorm:"primaryKey"`
	Stock        string                `gorm:"column:stock"`
	Code         string                `gorm:"column:code;uniqueIndex"`
	Cost         float64               `gorm:"column:cost"`
	Shares       float64               `gorm:"column:shares"`
	Remark       *string               `gorm:"column:remark"`
	DisplayOrder int                   `gorm:"column:display_order"`
	Active       bool                  `gorm:"column:active"`
	BaseCost     *float64              `gorm:"column:base_cost"`
	BaseShares   *float64              `gorm:"column:base_shares"`
	BaseDate     *string               `gorm:"column:base_date"`
	BaseRemark   *string               `gorm:"column:base_remark"`
	Targets      []PositionTargetModel `gorm:"foreignKey:PositionID"`
	CreatedAt    time.Time             `gorm:"column:created_at"`
	UpdatedAt    time.Time             `gorm:"column:updated_at"`
}

func (PositionModel) TableName() string { return "stock_positions" }

type PositionTargetModel struct {
	ID           uint      `gorm:"primaryKey"`
	PositionID   uint      `gorm:"column:position_id"`
	Cost         float64   `gorm:"column:cost"`
	Price        float64   `gorm:"column:price"`
	Shares       float64   `gorm:"column:shares"`
	Date         *string   `gorm:"column:date"`
	Remark       *string   `gorm:"column:remark"`
	Status       string    `gorm:"column:status"`
	DisplayOrder int       `gorm:"column:display_order"`
	CreatedAt    time.Time `gorm:"column:created_at"`
	UpdatedAt    time.Time `gorm:"column:updated_at"`
}

func (PositionTargetModel) TableName() string { return "stock_position_targets" }

// DailyLogModel 对应 stock_daily_logs 表，存储每日收盘记录的头信息和复盘。
type DailyLogModel struct {
	ID               uint             `gorm:"primaryKey"`
	Date             string           `gorm:"column:date;uniqueIndex"`
	Marker           string           `gorm:"column:marker"`
	ReviewMarket     string           `gorm:"column:review_market"`
	ReviewFeeling    string           `gorm:"column:review_feeling"`
	ReviewNextPlan   string           `gorm:"column:review_next_plan"`
	MonthlyTRevenue  float64          `gorm:"column:monthly_t_revenue"`
	Trades           []TradeModel     `gorm:"foreignKey:DailyLogID"`
	TRecords         []TRecordModel   `gorm:"foreignKey:DailyLogID"`
	CreatedAt        time.Time        `gorm:"column:created_at"`
	UpdatedAt        time.Time        `gorm:"column:updated_at"`
}

func (DailyLogModel) TableName() string { return "stock_daily_logs" }

// TradeModel 对应 stock_trades 表，每行是一笔买入或卖出操作。
type TradeModel struct {
	ID           uint      `gorm:"primaryKey"`
	DailyLogID   uint      `gorm:"column:daily_log_id;index"`
	Action       string    `gorm:"column:action"`
	Stock        string    `gorm:"column:stock"`
	Code         string    `gorm:"column:code"`
	Price        float64   `gorm:"column:price"`
	Shares       float64   `gorm:"column:shares"`
	DisplayOrder int       `gorm:"column:display_order"`
	CreatedAt    time.Time `gorm:"column:created_at"`
	UpdatedAt    time.Time `gorm:"column:updated_at"`
}

func (TradeModel) TableName() string { return "stock_trades" }

// TRecordModel 对应 stock_t_records 表，每行是一笔做T的收益明细。
type TRecordModel struct {
	ID           uint      `gorm:"primaryKey"`
	DailyLogID   uint      `gorm:"column:daily_log_id;index"`
	Stock        string    `gorm:"column:stock"`
	Description  string    `gorm:"column:description"`
	GrossProfit  float64   `gorm:"column:gross_profit"`
	Fee          float64   `gorm:"column:fee"`
	Tax          float64   `gorm:"column:tax"`
	NetRevenue   float64   `gorm:"column:net_revenue"`
	DisplayOrder int       `gorm:"column:display_order"`
	CreatedAt    time.Time `gorm:"column:created_at"`
	UpdatedAt    time.Time `gorm:"column:updated_at"`
}

func (TRecordModel) TableName() string { return "stock_t_records" }
