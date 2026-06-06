package http

import (
	nethttp "net/http"

	"github.com/Lkk-Web/interview/server/internal/shared/httpx"
	"github.com/Lkk-Web/interview/server/internal/stock/application"
	"github.com/gin-gonic/gin"
)

// Handler 是 stock 领域的 HTTP 入口。
// 它只负责读取请求、调用 application service、返回响应，不直接写 SQL。
type Handler struct {
	dashboardService *application.DashboardService
}

func NewHandler(dashboardService *application.DashboardService) *Handler {
	return &Handler{dashboardService: dashboardService}
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
