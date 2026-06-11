package http

import "github.com/Lkk-Web/interview/server/internal/stock/domain"

// DailyLogResponse 是 GET /stock/daily-log/:date 的响应体。
type DailyLogResponse struct {
	Date            string                `json:"date"`
	Marker          string                `json:"marker"`
	Positions       []PositionSnapshotDTO `json:"positions"`
	Trades          []TradeDTO            `json:"trades"`
	TRecords        []TRecordDTO          `json:"tRecords"`
	MonthlyTRevenue float64               `json:"monthlyTRevenue"`
	Review          DailyReviewDTO        `json:"review"`
}

type PositionSnapshotDTO struct {
	Stock  string  `json:"stock"`
	Code   string  `json:"code"`
	Cost   float64 `json:"cost"`
	Shares float64 `json:"shares"`
	Price  float64 `json:"price"`
}

type TradeDTO struct {
	Action string  `json:"action"`
	Stock  string  `json:"stock"`
	Code   string  `json:"code"`
	Price  float64 `json:"price"`
	Shares float64 `json:"shares"`
}

type TRecordDTO struct {
	Stock       string  `json:"stock"`
	Desc        string  `json:"desc"`
	GrossProfit float64 `json:"grossProfit"`
	Fee         float64 `json:"fee"`
	Tax         float64 `json:"tax"`
	NetRevenue  float64 `json:"netRevenue"`
}

type DailyReviewDTO struct {
	Market   string `json:"market"`
	Feeling  string `json:"feeling"`
	NextPlan string `json:"nextPlan"`
}

func newDailyLogResponse(log *domain.DailyLog) DailyLogResponse {
	positions := make([]PositionSnapshotDTO, 0, len(log.Positions))
	for _, p := range log.Positions {
		positions = append(positions, PositionSnapshotDTO{Stock: p.Stock, Code: p.Code, Cost: p.Cost, Shares: p.Shares, Price: p.Price})
	}
	trades := make([]TradeDTO, 0, len(log.Trades))
	for _, t := range log.Trades {
		trades = append(trades, TradeDTO{Action: t.Action, Stock: t.Stock, Code: t.Code, Price: t.Price, Shares: t.Shares})
	}
	tRecords := make([]TRecordDTO, 0, len(log.TRecords))
	for _, r := range log.TRecords {
		tRecords = append(tRecords, TRecordDTO{Stock: r.Stock, Desc: r.Desc, GrossProfit: r.GrossProfit, Fee: r.Fee, Tax: r.Tax, NetRevenue: r.NetRevenue})
	}
	return DailyLogResponse{
		Date: log.Date, Marker: log.Marker, Positions: positions, Trades: trades, TRecords: tRecords,
		MonthlyTRevenue: log.MonthlyTRevenue,
		Review:          DailyReviewDTO{Market: log.Review.Market, Feeling: log.Review.Feeling, NextPlan: log.Review.NextPlan},
	}
}

// DashboardResponse 对应前端 StockDashboard 当前需要的整体数据结构。
// 字段名保持 camelCase，是为了兼容 React 侧已有 JSON 使用方式。
type DashboardResponse struct {
	AssetHistory []AssetHistoryDTO `json:"assetHistory"`
	Positions    []PositionDTO     `json:"positions"`
	Monthly      []MonthlyDTO      `json:"monthly"`
	OtherIncome  []OtherIncomeDTO  `json:"otherIncome"`
}

// AssetHistoryDTO 是 HTTP 响应里的资产快照。
// DTO 可以使用 json 标签，而 domain 对象不需要知道自己怎么被 HTTP 序列化。
type AssetHistoryDTO struct {
	Date       string  `json:"date"`
	Cash       float64 `json:"cash"`
	StockValue float64 `json:"stockValue"`
	Loan       float64 `json:"loan"`
	Other      float64 `json:"other"`
	Remark     *string `json:"remark,omitempty"`
}

// CreateAssetHistoryRequest 是新增资产快照的请求体。
type CreateAssetHistoryRequest struct {
	Date       string  `json:"date" binding:"required"`
	Cash       float64 `json:"cash"`
	StockValue float64 `json:"stockValue"`
	Loan       float64 `json:"loan"`
	Other      float64 `json:"other"`
	Remark     *string `json:"remark"`
}

// CreateDailyLogRequest 是每日收盘记录的请求体，一次提交四类数据。
type CreateDailyLogRequest struct {
	Date    string `json:"date" binding:"required"`
	Marker  string `json:"marker"` // "！" / "？" / ""
	// Positions 是当日收盘后的最新持仓成本和数量。
	Positions []PositionUpdateRequest `json:"positions"`
	Trades    []TradeRequest          `json:"trades"`
	TRecords  []TRecordRequest        `json:"tRecords"`
	// MonthlyTRevenue 是本月做T的最新累计净收益（由前端基于历史值+当日增量计算后传入）。
	MonthlyTRevenue float64    `json:"monthlyTRevenue"`
	Review          ReviewRequest `json:"review"`
}

type PositionUpdateRequest struct {
	Stock  string  `json:"stock"`
	Code   string  `json:"code" binding:"required"`
	Cost   float64 `json:"cost"`
	Shares float64 `json:"shares"`
	Price  float64 `json:"price"`
}

type TradeRequest struct {
	Action string  `json:"action"`
	Stock  string  `json:"stock"`
	Code   string  `json:"code"`
	Price  float64 `json:"price"`
	Shares float64 `json:"shares"`
}

type TRecordRequest struct {
	Stock       string  `json:"stock"`
	Desc        string  `json:"desc"`
	GrossProfit float64 `json:"grossProfit"`
	Fee         float64 `json:"fee"`
	Tax         float64 `json:"tax"`
	NetRevenue  float64 `json:"netRevenue"`
}

type ReviewRequest struct {
	Market   string `json:"market"`
	Feeling  string `json:"feeling"`
	NextPlan string `json:"nextPlan"`
}

// MonthlyDTO 保持当前 monthly.json 的字段命名。
type MonthlyDTO struct {
	Month    string  `json:"month"`
	TTarget  float64 `json:"tTarget"`
	TRevenue float64 `json:"tRevenue"`
	Remark   *string `json:"remark,omitempty"`
}

// OtherIncomeDTO 中 desc 是为了兼容现有前端字段；domain 层使用 Description 更易懂。
type OtherIncomeDTO struct {
	Date   string  `json:"date"`
	Amount float64 `json:"amount"`
	Desc   string  `json:"desc"`
	Remark *string `json:"remark,omitempty"`
}

// PositionDTO 是持仓响应；target 保持当前 JSON 的单数命名，减少迁移成本。
type PositionDTO struct {
	Stock  string              `json:"stock"`
	Code   string              `json:"code"`
	Cost   float64             `json:"cost"`
	Shares float64             `json:"shares"`
	Remark *string             `json:"remark,omitempty"`
	Base   *PositionBaseDTO    `json:"base,omitempty"`
	Target []PositionTargetDTO `json:"target,omitempty"`
}

type PositionBaseDTO struct {
	Cost   float64 `json:"cost"`
	Shares float64 `json:"shares"`
	Date   *string `json:"date,omitempty"`
	Remark *string `json:"remark,omitempty"`
}

type PositionTargetDTO struct {
	Cost   float64 `json:"cost"`
	Price  float64 `json:"price"`
	Shares float64 `json:"shares"`
	Date   *string `json:"date,omitempty"`
	Remark *string `json:"remark,omitempty"`
	Status string  `json:"status,omitempty"`
}

// NewDashboardResponse 把 application 返回的领域对象转换成前端 API 响应。
func NewDashboardResponse(assetHistory []domain.AssetHistory, positions []domain.Position, monthly []domain.MonthlyRecord, otherIncome []domain.OtherIncome) DashboardResponse {
	return DashboardResponse{
		AssetHistory: newAssetHistoryDTOs(assetHistory),
		Positions:    newPositionDTOs(positions),
		Monthly:      newMonthlyDTOs(monthly),
		OtherIncome:  newOtherIncomeDTOs(otherIncome),
	}
}

func newAssetHistoryDTOs(items []domain.AssetHistory) []AssetHistoryDTO {
	result := make([]AssetHistoryDTO, 0, len(items))
	for _, item := range items {
		result = append(result, AssetHistoryDTO{
			Date:       item.Date,
			Cash:       item.Cash,
			StockValue: item.StockValue,
			Loan:       item.Loan,
			Other:      item.Other,
			Remark:     item.Remark,
		})
	}
	return result
}

func newMonthlyDTOs(items []domain.MonthlyRecord) []MonthlyDTO {
	result := make([]MonthlyDTO, 0, len(items))
	for _, item := range items {
		result = append(result, MonthlyDTO{
			Month:    item.Month,
			TTarget:  item.TTarget,
			TRevenue: item.TRevenue,
			Remark:   item.Remark,
		})
	}
	return result
}

func newOtherIncomeDTOs(items []domain.OtherIncome) []OtherIncomeDTO {
	result := make([]OtherIncomeDTO, 0, len(items))
	for _, item := range items {
		result = append(result, OtherIncomeDTO{
			Date:   item.Date,
			Amount: item.Amount,
			Desc:   item.Description,
			Remark: item.Remark,
		})
	}
	return result
}

func newPositionDTOs(items []domain.Position) []PositionDTO {
	result := make([]PositionDTO, 0, len(items))
	for _, item := range items {
		position := PositionDTO{
			Stock:  item.Stock,
			Code:   item.Code,
			Cost:   item.Cost,
			Shares: item.Shares,
			Remark: item.Remark,
			Target: newPositionTargetDTOs(item.Targets),
		}
		if item.Base != nil {
			position.Base = &PositionBaseDTO{
				Cost:   item.Base.Cost,
				Shares: item.Base.Shares,
				Date:   item.Base.Date,
				Remark: item.Base.Remark,
			}
		}
		result = append(result, position)
	}
	return result
}

func newPositionTargetDTOs(items []domain.PositionTarget) []PositionTargetDTO {
	result := make([]PositionTargetDTO, 0, len(items))
	for _, item := range items {
		result = append(result, PositionTargetDTO{
			Cost:   item.Cost,
			Price:  item.Price,
			Shares: item.Shares,
			Date:   item.Date,
			Remark: item.Remark,
			Status: item.Status,
		})
	}
	return result
}
