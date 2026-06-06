package http

import (
	"time"

	"github.com/Lkk-Web/interview/server/internal/mermaid/domain"
)

// DiagramListResponse 是列表接口的响应外壳。
// 包一层 items 是为了以后加分页字段时不破坏前端结构。
type DiagramListResponse struct {
	Items []DiagramSummaryDTO `json:"items"`
}

// DiagramSummaryDTO 是列表页用的轻量数据，不返回完整 chart，避免列表接口太重。
type DiagramSummaryDTO struct {
	Slug        string    `json:"slug"`
	Title       string    `json:"title"`
	Description *string   `json:"description,omitempty"`
	Category    *string   `json:"category,omitempty"`
	DiagramType string    `json:"diagramType"`
	Theme       string    `json:"theme"`
	Zoomable    bool      `json:"zoomable"`
	Editable    bool      `json:"editable"`
	CacheKey    *string   `json:"cacheKey,omitempty"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

// DiagramDetailDTO 是详情接口数据，包含 Mermaid 源码 chart。
// 前端拿到 chart 后仍然用现有 Mermaid 组件渲染，不需要后端生成 SVG。
type DiagramDetailDTO struct {
	Slug            string    `json:"slug"`
	Title           string    `json:"title"`
	Description     *string   `json:"description,omitempty"`
	Category        *string   `json:"category,omitempty"`
	Chart           string    `json:"chart"`
	DiagramType     string    `json:"diagramType"`
	Theme           string    `json:"theme"`
	Zoomable        bool      `json:"zoomable"`
	Editable        bool      `json:"editable"`
	CacheKey        *string   `json:"cacheKey,omitempty"`
	SourcePath      *string   `json:"sourcePath,omitempty"`
	SourceComponent *string   `json:"sourceComponent,omitempty"`
	UpdatedAt       time.Time `json:"updatedAt"`
}

// DiagramVersionDTO 表示一次 Mermaid 图的历史版本。
// 后续加“保存到服务端”时，可以用它做回滚能力。
type DiagramVersionDTO struct {
	Version    int       `json:"version"`
	Chart      string    `json:"chart"`
	ChangeNote *string   `json:"changeNote,omitempty"`
	CreatedAt  time.Time `json:"createdAt"`
}

// NewDiagramListResponse 把领域对象转换成 HTTP DTO。
// DTO 的意义是隔离前端 JSON 字段和后端领域模型，避免数据库字段名直接暴露给前端。
func NewDiagramListResponse(items []domain.Diagram) DiagramListResponse {
	result := make([]DiagramSummaryDTO, 0, len(items))
	for _, item := range items {
		result = append(result, DiagramSummaryDTO{
			Slug:        item.Slug,
			Title:       item.Title,
			Description: item.Description,
			Category:    item.Category,
			DiagramType: item.DiagramType,
			Theme:       item.Theme,
			Zoomable:    item.Zoomable,
			Editable:    item.Editable,
			CacheKey:    item.CacheKey,
			UpdatedAt:   item.UpdatedAt,
		})
	}
	return DiagramListResponse{Items: result}
}

// NewDiagramDetailDTO 转换单个 Mermaid 图详情。
func NewDiagramDetailDTO(item domain.Diagram) DiagramDetailDTO {
	return DiagramDetailDTO{
		Slug:            item.Slug,
		Title:           item.Title,
		Description:     item.Description,
		Category:        item.Category,
		Chart:           item.Chart,
		DiagramType:     item.DiagramType,
		Theme:           item.Theme,
		Zoomable:        item.Zoomable,
		Editable:        item.Editable,
		CacheKey:        item.CacheKey,
		SourcePath:      item.SourcePath,
		SourceComponent: item.SourceComponent,
		UpdatedAt:       item.UpdatedAt,
	}
}

// NewDiagramVersionDTOs 转换 Mermaid 历史版本列表。
func NewDiagramVersionDTOs(items []domain.DiagramVersion) []DiagramVersionDTO {
	result := make([]DiagramVersionDTO, 0, len(items))
	for _, item := range items {
		result = append(result, DiagramVersionDTO{
			Version:    item.Version,
			Chart:      item.Chart,
			ChangeNote: item.ChangeNote,
			CreatedAt:  item.CreatedAt,
		})
	}
	return result
}
