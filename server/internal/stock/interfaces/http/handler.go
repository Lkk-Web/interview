package http

import (
	nethttp "net/http"

	"github.com/Lkk-Web/interview/server/internal/shared/httpx"
	"github.com/Lkk-Web/interview/server/internal/stock/application"
	"github.com/Lkk-Web/interview/server/internal/stock/domain"
	"github.com/gin-gonic/gin"
)

// Handler 是 stock 领域的 HTTP 入口。
// 它只负责读取请求、调用 application service、返回响应，不直接写 SQL。
type Handler struct {
	dashboardService *application.DashboardService
	dailyLogService  *application.DailyLogService
}

func NewHandler(dashboardService *application.DashboardService, dailyLogService *application.DailyLogService) *Handler {
	return &Handler{dashboardService: dashboardService, dailyLogService: dailyLogService}
}

// GetDashboard 返回仪表盘聚合数据。
// @Summary     获取股票仪表盘聚合数据
// @Description 一次返回资产历史、持仓、月度收益、其他收入，前端 StockDashboard 直接消费。
// @Tags        stock
// @Produce     json
// @Success     200  {object}  DashboardResponse
// @Failure     500  {object}  httpx.ErrorResponse
// @Router      /stock/dashboard [get]
func (handler *Handler) GetDashboard(c *gin.Context) {
	dashboard, err := handler.dashboardService.GetDashboard(c.Request.Context())
	if err != nil {
		httpx.Error(c, nethttp.StatusInternalServerError, "stock_dashboard_error", "failed to load stock dashboard")
		return
	}

	httpx.OK(c, NewDashboardResponse(
		dashboard.AssetHistory,
		dashboard.Positions,
		dashboard.Monthly,
		dashboard.OtherIncome,
	))
}

// ListAssetHistory 返回资产曲线明细。
// @Summary     获取资产历史曲线
// @Tags        stock
// @Produce     json
// @Success     200  {array}   AssetHistoryDTO
// @Failure     500  {object}  httpx.ErrorResponse
// @Router      /stock/asset-history [get]
func (handler *Handler) ListAssetHistory(c *gin.Context) {
	items, err := handler.dashboardService.GetAssetHistory(c.Request.Context())
	if err != nil {
		httpx.Error(c, nethttp.StatusInternalServerError, "stock_asset_history_error", "failed to load asset history")
		return
	}
	httpx.OK(c, newAssetHistoryDTOs(items))
}

// ListMonthly 返回月度 T 收益记录。
// @Summary     获取月度 T 收益
// @Tags        stock
// @Produce     json
// @Success     200  {array}   MonthlyDTO
// @Failure     500  {object}  httpx.ErrorResponse
// @Router      /stock/monthly [get]
func (handler *Handler) ListMonthly(c *gin.Context) {
	items, err := handler.dashboardService.GetMonthly(c.Request.Context())
	if err != nil {
		httpx.Error(c, nethttp.StatusInternalServerError, "stock_monthly_error", "failed to load monthly records")
		return
	}
	httpx.OK(c, newMonthlyDTOs(items))
}

// ListOtherIncome 返回其他收入/支出记录。
// @Summary     获取其他收入/支出
// @Tags        stock
// @Produce     json
// @Success     200  {array}   OtherIncomeDTO
// @Failure     500  {object}  httpx.ErrorResponse
// @Router      /stock/other-income [get]
func (handler *Handler) ListOtherIncome(c *gin.Context) {
	items, err := handler.dashboardService.GetOtherIncome(c.Request.Context())
	if err != nil {
		httpx.Error(c, nethttp.StatusInternalServerError, "stock_other_income_error", "failed to load other income")
		return
	}
	httpx.OK(c, newOtherIncomeDTOs(items))
}

// ListPositions 返回当前有效持仓。
// @Summary     获取当前持仓
// @Tags        stock
// @Produce     json
// @Success     200  {array}   PositionDTO
// @Failure     500  {object}  httpx.ErrorResponse
// @Router      /stock/positions [get]
func (handler *Handler) ListPositions(c *gin.Context) {
	items, err := handler.dashboardService.GetPositions(c.Request.Context())
	if err != nil {
		httpx.Error(c, nethttp.StatusInternalServerError, "stock_positions_error", "failed to load positions")
		return
	}
	httpx.OK(c, newPositionDTOs(items))
}

// GetAssetHistoryByDate 按日期查单条资产快照，供前端回填表单。
func (handler *Handler) GetAssetHistoryByDate(c *gin.Context) {
	date := c.Param("date")
	item, err := handler.dashboardService.GetAssetHistoryByDate(c.Request.Context(), date)
	if err != nil {
		httpx.Error(c, nethttp.StatusInternalServerError, "asset_history_error", err.Error())
		return
	}
	if item == nil {
		httpx.Error(c, nethttp.StatusNotFound, "not_found", "no record for "+date)
		return
	}
	httpx.OK(c, AssetHistoryDTO{
		Date:       item.Date,
		Cash:       item.Cash,
		StockValue: item.StockValue,
		Loan:       item.Loan,
		Other:      item.Other,
		Remark:     item.Remark,
	})
}

// CreateAssetHistory 新增一条资产快照，写库成功后自动同步 JSON 文件。
// @Summary     新增资产快照
// @Tags        stock
// @Accept      json
// @Produce     json
// @Param       body  body      CreateAssetHistoryRequest  true  "资产快照数据"
// @Success     201   {object}  AssetHistoryDTO
// @Failure     400   {object}  httpx.ErrorResponse
// @Failure     500   {object}  httpx.ErrorResponse
// @Router      /admin/stock/asset-history [post]
func (handler *Handler) CreateAssetHistory(c *gin.Context) {
	var req CreateAssetHistoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		httpx.Error(c, nethttp.StatusBadRequest, "invalid_request", err.Error())
		return
	}

	item, err := handler.dashboardService.AddAssetHistory(c.Request.Context(), domain.AssetHistory{
		Date:       req.Date,
		Cash:       req.Cash,
		StockValue: req.StockValue,
		Loan:       req.Loan,
		Other:      req.Other,
		Remark:     req.Remark,
	})
	if err != nil {
		httpx.Error(c, nethttp.StatusInternalServerError, "create_error", err.Error())
		return
	}

	httpx.Created(c, AssetHistoryDTO{
		Date:       item.Date,
		Cash:       item.Cash,
		StockValue: item.StockValue,
		Loan:       item.Loan,
		Other:      item.Other,
		Remark:     item.Remark,
	})
}

// GetDailyLog 按日期查询当日收盘记录。
func (handler *Handler) GetDailyLog(c *gin.Context) {
	date := c.Param("date")
	log, err := handler.dailyLogService.GetByDate(c.Request.Context(), date)
	if err != nil {
		httpx.Error(c, nethttp.StatusInternalServerError, "daily_log_error", err.Error())
		return
	}
	if log == nil {
		httpx.Error(c, nethttp.StatusNotFound, "not_found", "no record for "+date)
		return
	}
	httpx.OK(c, newDailyLogResponse(log))
}

// CreateDailyLog 提交每日收盘记录。
// @Summary     提交每日收盘记录
// @Tags        stock
// @Accept      json
// @Produce     json
// @Param       body  body  CreateDailyLogRequest  true  "每日收盘数据"
// @Success     201   {object}  map[string]string
// @Failure     400   {object}  httpx.ErrorResponse
// @Failure     500   {object}  httpx.ErrorResponse
// @Router      /admin/stock/daily-log [post]
func (handler *Handler) CreateDailyLog(c *gin.Context) {
	var req CreateDailyLogRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		httpx.Error(c, nethttp.StatusBadRequest, "invalid_request", err.Error())
		return
	}

	positions := make([]domain.PositionUpdate, 0, len(req.Positions))
	for _, p := range req.Positions {
		positions = append(positions, domain.PositionUpdate{
			Stock: p.Stock, Code: p.Code, Cost: p.Cost, Shares: p.Shares, Price: p.Price,
		})
	}

	trades := make([]domain.Trade, 0, len(req.Trades))
	for _, t := range req.Trades {
		trades = append(trades, domain.Trade{
			Action:   t.Action,
			Stock:    t.Stock,
			Code:     t.Code,
			Price:    t.Price,
			Shares:   t.Shares,
			HasIssue: t.HasIssue,
		})
	}

	tRecords := make([]domain.TRecord, 0, len(req.TRecords))
	for _, r := range req.TRecords {
		tRecords = append(tRecords, domain.TRecord{
			Stock:       r.Stock,
			Desc:        r.Desc,
			BuyPrice:    r.BuyPrice,
			BuyShares:   r.BuyShares,
			SellPrice:   r.SellPrice,
			SellShares:  r.SellShares,
			GrossProfit: r.GrossProfit,
			Fee:         r.Fee,
			Tax:         r.Tax,
			NetRevenue:  r.NetRevenue,
		})
	}

	swingRecords := make([]domain.SwingRecord, 0, len(req.SwingRecords))
	for _, r := range req.SwingRecords {
		swingRecords = append(swingRecords, domain.SwingRecord{
			Stock: r.Stock, Desc: r.Desc, BuyDate: r.BuyDate, SellDate: r.SellDate,
			BuyPrice: r.BuyPrice, BuyShares: r.BuyShares, SellPrice: r.SellPrice, SellShares: r.SellShares,
			GrossProfit: r.GrossProfit, Fee: r.Fee, Tax: r.Tax, NetRevenue: r.NetRevenue,
		})
	}

	consumedLegs := make([]domain.ConsumedLeg, 0, len(req.ConsumedLegs))
	for _, c := range req.ConsumedLegs {
		consumedLegs = append(consumedLegs, domain.ConsumedLeg{LegID: c.LegID, ConsumedShares: c.ConsumedShares})
	}

	newUnmatchedLegs := make([]domain.UnmatchedLeg, 0, len(req.NewUnmatchedLegs))
	for _, l := range req.NewUnmatchedLegs {
		newUnmatchedLegs = append(newUnmatchedLegs, domain.UnmatchedLeg{
			Stock: l.Stock, Code: l.Code, Action: l.Action, Price: l.Price,
			RemainingShares: l.RemainingShares, TotalShares: l.TotalShares, TotalFee: l.TotalFee,
		})
	}

	log := domain.DailyLog{
		Date:                req.Date,
		Marker:              req.Marker,
		PositionUpdates:     positions,
		Trades:              trades,
		TRecords:            tRecords,
		SwingRecords:        swingRecords,
		ConsumedLegs:        consumedLegs,
		NewUnmatchedLegs:    newUnmatchedLegs,
		MonthlyTRevenue:     req.MonthlyTRevenue,
		MonthlySwingRevenue: req.MonthlySwingRevenue,
		Review: domain.DailyReview{
			Market:   req.Review.Market,
			Feeling:  req.Review.Feeling,
			NextPlan: req.Review.NextPlan,
		},
	}

	if err := handler.dailyLogService.Submit(c.Request.Context(), log); err != nil {
		httpx.Error(c, nethttp.StatusInternalServerError, "daily_log_error", err.Error())
		return
	}

	httpx.Created(c, gin.H{"date": req.Date})
}

// ListUnmatchedPositions 返回当前所有跨日未匹配的买/卖腿，供前端「未匹配做T仓位」区块展示。
// @Summary     获取未匹配做T仓位
// @Tags        stock
// @Produce     json
// @Success     200  {array}   UnmatchedLegDTO
// @Failure     500  {object}  httpx.ErrorResponse
// @Router      /stock/unmatched-positions [get]
func (handler *Handler) ListUnmatchedPositions(c *gin.Context) {
	items, err := handler.dailyLogService.ListUnmatchedLegs(c.Request.Context())
	if err != nil {
		httpx.Error(c, nethttp.StatusInternalServerError, "unmatched_positions_error", err.Error())
		return
	}
	result := make([]UnmatchedLegDTO, 0, len(items))
	for _, item := range items {
		result = append(result, UnmatchedLegDTO{
			ID: item.ID, Date: item.Date, Stock: item.Stock, Code: item.Code,
			Action: item.Action, Price: item.Price, RemainingShares: item.RemainingShares,
			TotalShares: item.TotalShares, TotalFee: item.TotalFee,
		})
	}
	httpx.OK(c, result)
}

// GetPositionSnapshotAsOf 返回 date 当天或之前最近一次收盘记录的持仓快照，供 Alpha 曲线使用。
// 绝不回退到"当前持仓"：找不到任何历史快照时返回 404，交给前端决定怎么处理缺失。
// @Summary     获取某天或之前最近一次的持仓快照
// @Tags        stock
// @Produce     json
// @Param       date  path      string  true  "YYYY-MM-DD"
// @Success     200   {object}  PositionSnapshotAsOfDTO
// @Failure     404   {object}  httpx.ErrorResponse
// @Failure     500   {object}  httpx.ErrorResponse
// @Router      /stock/position-snapshot-as-of/{date} [get]
func (handler *Handler) GetPositionSnapshotAsOf(c *gin.Context) {
	date := c.Param("date")
	snapshot, err := handler.dailyLogService.GetPositionSnapshotAsOf(c.Request.Context(), date)
	if err != nil {
		httpx.Error(c, nethttp.StatusInternalServerError, "position_snapshot_error", err.Error())
		return
	}
	if snapshot == nil {
		httpx.Error(c, nethttp.StatusNotFound, "not_found", "no position snapshot on or before "+date)
		return
	}
	positions := make([]PositionSnapshotDTO, 0, len(snapshot.Positions))
	for _, p := range snapshot.Positions {
		positions = append(positions, PositionSnapshotDTO{Stock: p.Stock, Code: p.Code, Cost: p.Cost, Shares: p.Shares, Price: p.Price})
	}
	httpx.OK(c, PositionSnapshotAsOfDTO{Date: snapshot.Date, Positions: positions})
}

// ListPositionSnapshots 返回所有实际提交过持仓快照的日期（date -> positions）。
// 供资产曲线 tooltip 使用：只有这些日期才在"股票"那一行后面追加持仓明细。
// @Summary     获取所有有持仓快照的日期明细
// @Tags        stock
// @Produce     json
// @Success     200  {object}  PositionSnapshotDatesDTO
// @Failure     500  {object}  httpx.ErrorResponse
// @Router      /stock/position-snapshots [get]
func (handler *Handler) ListPositionSnapshots(c *gin.Context) {
	snapshots, err := handler.dailyLogService.ListPositionSnapshotDates(c.Request.Context())
	if err != nil {
		httpx.Error(c, nethttp.StatusInternalServerError, "position_snapshots_error", err.Error())
		return
	}
	result := make(PositionSnapshotDatesDTO, len(snapshots))
	for date, positions := range snapshots {
		dtos := make([]PositionSnapshotDTO, 0, len(positions))
		for _, p := range positions {
			dtos = append(dtos, PositionSnapshotDTO{Stock: p.Stock, Code: p.Code, Cost: p.Cost, Shares: p.Shares, Price: p.Price})
		}
		result[date] = dtos
	}
	httpx.OK(c, result)
}

// UpsertOtherIncome 按日期 upsert 一条其他收入记录。
func (handler *Handler) UpsertOtherIncome(c *gin.Context) {
	var req struct {
		Date   string  `json:"date" binding:"required"`
		Amount float64 `json:"amount"`
		Desc   string  `json:"desc"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		httpx.Error(c, nethttp.StatusBadRequest, "invalid_request", err.Error())
		return
	}
	item, err := handler.dashboardService.UpsertOtherIncome(c.Request.Context(), domain.OtherIncome{
		Date:        req.Date,
		Amount:      req.Amount,
		Description: req.Desc,
	})
	if err != nil {
		httpx.Error(c, nethttp.StatusInternalServerError, "upsert_other_income_error", err.Error())
		return
	}
	httpx.OK(c, gin.H{"id": item.ID, "date": item.Date, "amount": item.Amount, "desc": item.Description})
}
