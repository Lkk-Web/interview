package http

import "github.com/gin-gonic/gin"

func RegisterRoutes(group *gin.RouterGroup, handler *Handler) {
	group.GET("/diagrams", handler.ListDiagrams)
	group.GET("/diagrams/:slug", handler.GetDiagram)
	group.GET("/diagrams/:slug/versions", handler.ListVersions)
}
