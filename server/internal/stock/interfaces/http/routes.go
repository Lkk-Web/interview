package http

import "github.com/gin-gonic/gin"

func RegisterRoutes(group *gin.RouterGroup, handler *Handler) {
	group.GET("/dashboard", handler.GetDashboard)
	group.GET("/asset-history", handler.ListAssetHistory)
	group.GET("/monthly", handler.ListMonthly)
	group.GET("/other-income", handler.ListOtherIncome)
	group.GET("/positions", handler.ListPositions)
}
