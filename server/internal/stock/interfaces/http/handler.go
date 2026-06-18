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
			Action: t.Action,
			Stock:  t.Stock,
			Code:   t.Code,
			Price:  t.Price,
			Shares: t.Shares,
		})
	}

	tRecords := make([]domain.TRecord, 0, len(req.TRecords))
	for _, r := range req.TRecords {
		tRecords = append(tRecords, domain.TRecord{
			Stock:       r.Stock,
			Desc:        r.Desc,
			GrossProfit: r.GrossProfit,
			Fee:         r.Fee,
			Tax:         r.Tax,
			NetRevenue:  r.NetRevenue,
		})
	}

	log := domain.DailyLog{
		Date:            req.Date,
		Marker:          req.Marker,
		PositionUpdates: positions,
		Trades:          trades,
		TRecords:        tRecords,
		MonthlyTRevenue: req.MonthlyTRevenue,
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
