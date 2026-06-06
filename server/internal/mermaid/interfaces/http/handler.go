package http

import (
	"errors"
	nethttp "net/http"

	"github.com/Lkk-Web/interview/server/internal/mermaid/application"
	"github.com/Lkk-Web/interview/server/internal/mermaid/domain"
	"github.com/Lkk-Web/interview/server/internal/shared/httpx"
	"github.com/gin-gonic/gin"
)

type Handler struct {
	service *application.Service
}

func NewHandler(service *application.Service) *Handler {
	return &Handler{service: service}
}

func (handler *Handler) ListDiagrams(c *gin.Context) {
	items, err := handler.service.ListDiagrams(c.Request.Context(), c.Query("category"))
	if err != nil {
		httpx.Error(c, nethttp.StatusInternalServerError, "mermaid_list_error", "failed to load mermaid diagrams")
		return
	}
	httpx.OK(c, NewDiagramListResponse(items))
}

func (handler *Handler) GetDiagram(c *gin.Context) {
	item, err := handler.service.GetDiagram(c.Request.Context(), c.Param("slug"))
	if err != nil {
		if errors.Is(err, domain.ErrDiagramNotFound) {
			httpx.Error(c, nethttp.StatusNotFound, "mermaid_not_found", "mermaid diagram not found")
			return
		}
		httpx.Error(c, nethttp.StatusInternalServerError, "mermaid_detail_error", "failed to load mermaid diagram")
		return
	}
	httpx.OK(c, NewDiagramDetailDTO(item))
}

func (handler *Handler) ListVersions(c *gin.Context) {
	items, err := handler.service.ListVersions(c.Request.Context(), c.Param("slug"))
	if err != nil {
		if errors.Is(err, domain.ErrDiagramNotFound) {
			httpx.Error(c, nethttp.StatusNotFound, "mermaid_not_found", "mermaid diagram not found")
			return
		}
		httpx.Error(c, nethttp.StatusInternalServerError, "mermaid_versions_error", "failed to load mermaid versions")
		return
	}
	httpx.OK(c, NewDiagramVersionDTOs(items))
}
