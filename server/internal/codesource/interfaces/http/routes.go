package http

import "github.com/gin-gonic/gin"

// RegisterRoutes 挂载 codesource 的所有只读接口。
// 路由设计和前端 useCodeSource 的 pageKey + codeKey 查询逻辑对齐。
func RegisterRoutes(group *gin.RouterGroup, handler *Handler) {
	// 按 pageKey 批量获取，前端可以用来预加载整页数据
	group.GET("/pages/:pageKey", handler.ListByPage)
	// 按 pageKey + codeKey 精确查询单条
	group.GET("/pages/:pageKey/:codeKey", handler.GetByKey)
	// 获取编辑历史版本
	group.GET("/pages/:pageKey/:codeKey/versions", handler.ListVersions)
}
