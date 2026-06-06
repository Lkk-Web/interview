package http

import (
	"errors"
	nethttp "net/http"

	"github.com/Lkk-Web/interview/server/internal/codesource/application"
	"github.com/Lkk-Web/interview/server/internal/codesource/domain"
	"github.com/Lkk-Web/interview/server/internal/shared/httpx"
	"github.com/gin-gonic/gin"
)

// Handler 是 codesource 领域的 HTTP 入口，只做参数读取和响应转换。
type Handler struct {
	service *application.Service
}

func NewHandler(service *application.Service) *Handler {
	return &Handler{service: service}
}

// GetByKey 按 pageKey + codeKey 查询单条代码内容。
// @Summary     获取代码内容
// @Description 按 pageKey + codeKey 精确查询，找不到返回 404。前端 useCodeSource hook 对接此接口。
// @Tags        code-sources
// @Produce     json
// @Param       pageKey  path      string  true  "页面/业务域 key，如 summary-editor"
// @Param       codeKey  path      string  true  "内容 key，如 demo-mermaid"
// @Success     200      {object}  CodeSourceDTO
// @Failure     404      {object}  httpx.ErrorResponse
// @Failure     500      {object}  httpx.ErrorResponse
// @Router      /code-sources/pages/{pageKey}/{codeKey} [get]
func (h *Handler) GetByKey(c *gin.Context) {
	pageKey := c.Param("pageKey")
	codeKey := c.Param("codeKey")

	source, err := h.service.GetByKey(c.Request.Context(), pageKey, codeKey)
	if err != nil {
		if errors.Is(err, domain.ErrNotFound) {
			httpx.Error(c, nethttp.StatusNotFound, "not_found", "code source not found")
			return
		}
		httpx.Error(c, nethttp.StatusInternalServerError, "get_error", "failed to get code source")
		return
	}
	httpx.OK(c, newCodeSourceDTO(source))
}

// ListByPage 返回某个 pageKey 下的所有公开内容。
// @Summary     批量获取页面代码内容
// @Description 返回指定 pageKey 下的所有公开记录，前端可用来一次性预加载整页数据。
// @Tags        code-sources
// @Produce     json
// @Param       pageKey  path      string  true  "页面/业务域 key，如 expand-mermaid"
// @Success     200      {object}  CodeSourceListResponse
// @Failure     500      {object}  httpx.ErrorResponse
// @Router      /code-sources/pages/{pageKey} [get]
func (h *Handler) ListByPage(c *gin.Context) {
	pageKey := c.Param("pageKey")

	items, err := h.service.ListByPage(c.Request.Context(), pageKey)
	if err != nil {
		httpx.Error(c, nethttp.StatusInternalServerError, "list_error", "failed to list code sources")
		return
	}
	httpx.OK(c, newCodeSourceListResponse(items))
}

// ListVersions 返回某条记录的编辑历史版本。
// @Summary     获取代码内容编辑历史
// @Description 返回指定 pageKey + codeKey 记录的历史版本列表，按版本号倒序排列。
// @Tags        code-sources
// @Produce     json
// @Param       pageKey  path      string  true  "页面/业务域 key"
// @Param       codeKey  path      string  true  "内容 key"
// @Success     200      {array}   CodeSourceVersionDTO
// @Failure     404      {object}  httpx.ErrorResponse
// @Failure     500      {object}  httpx.ErrorResponse
// @Router      /code-sources/pages/{pageKey}/{codeKey}/versions [get]
func (h *Handler) ListVersions(c *gin.Context) {
	pageKey := c.Param("pageKey")
	codeKey := c.Param("codeKey")

	versions, err := h.service.ListVersions(c.Request.Context(), pageKey, codeKey)
	if err != nil {
		if errors.Is(err, domain.ErrNotFound) {
			httpx.Error(c, nethttp.StatusNotFound, "not_found", "code source not found")
			return
		}
		httpx.Error(c, nethttp.StatusInternalServerError, "versions_error", "failed to list versions")
		return
	}
	httpx.OK(c, newVersionDTOs(versions))
}
