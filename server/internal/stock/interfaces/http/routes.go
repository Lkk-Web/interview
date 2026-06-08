package http

import "github.com/gin-gonic/gin"

func RegisterRoutes(group *gin.RouterGroup, handler *Handler) {
	group.GET("/dashboard", handler.GetDashboard)
	group.GET("/asset-history", handler.ListAssetHistory)
	group.GET("/monthly", handler.ListMonthly)
	group.GET("/other-income", handler.ListOtherIncome)
	group.GET("/positions", handler.ListPositions)
	// 写接口通过 admin token middleware 保护，在 bootstrap 里单独挂载
}

// RegisterAdminRoutes 挂载需要 admin token 的写接口。
func RegisterAdminRoutes(group *gin.RouterGroup, handler *Handler) {
	group.POST("/asset-history", handler.CreateAssetHistory)
}
