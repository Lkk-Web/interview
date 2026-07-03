package http

import "github.com/gin-gonic/gin"

func RegisterRoutes(group *gin.RouterGroup, handler *Handler) {
	group.GET("/dashboard", handler.GetDashboard)
	group.GET("/asset-history", handler.ListAssetHistory)
	group.GET("/asset-history/:date", handler.GetAssetHistoryByDate)
	group.GET("/monthly", handler.ListMonthly)
	group.GET("/other-income", handler.ListOtherIncome)
	group.GET("/positions", handler.ListPositions)
	group.GET("/daily-log/:date", handler.GetDailyLog)
	group.GET("/unmatched-positions", handler.ListUnmatchedPositions)
	group.GET("/position-snapshot-as-of/:date", handler.GetPositionSnapshotAsOf)
	group.GET("/position-snapshots", handler.ListPositionSnapshots)
	// 写接口通过 admin token middleware 保护，在 bootstrap 里单独挂载
}

// RegisterAdminRoutes 挂载需要 admin token 的写接口。
func RegisterAdminRoutes(group *gin.RouterGroup, handler *Handler) {
	group.POST("/asset-history", handler.CreateAssetHistory)
	group.POST("/daily-log", handler.CreateDailyLog)
	group.POST("/other-income", handler.UpsertOtherIncome)
}
