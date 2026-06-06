package http

import "time"

import "github.com/Lkk-Web/interview/server/internal/codesource/domain"

// CodeSourceDTO 对应前端 CodeSource 接口，字段名和前端保持一致降低对接成本。
type CodeSourceDTO struct {
	PageKey      string    `json:"pageKey"`
	CodeKey      string    `json:"codeKey"`
	Lang         string    `json:"lang"`
	Code         string    `json:"code"`
	CacheKey     *string   `json:"cacheKey,omitempty"`
	Title        *string   `json:"title,omitempty"`
	Description  *string   `json:"description,omitempty"`
	Theme        string    `json:"theme,omitempty"`
	Zoomable     bool      `json:"zoomable,omitempty"`
	DefaultOpen  bool      `json:"defaultOpen,omitempty"`
	EditorHeight *int      `json:"editorHeight,omitempty"`
	UpdatedAt    time.Time `json:"updatedAt"`
}

// CodeSourceListResponse 是列表接口的外壳，预留后续加分页字段。
type CodeSourceListResponse struct {
	Items []CodeSourceDTO `json:"items"`
}

// CodeSourceVersionDTO 是编辑历史版本的响应结构。
type CodeSourceVersionDTO struct {
	Version    int       `json:"version"`
	Code       string    `json:"code"`
	ChangeNote *string   `json:"changeNote,omitempty"`
	CreatedAt  time.Time `json:"createdAt"`
}

func newCodeSourceDTO(s domain.CodeSource) CodeSourceDTO {
	return CodeSourceDTO{
		PageKey:      s.PageKey,
		CodeKey:      s.CodeKey,
		Lang:         s.Lang,
		Code:         s.Code,
		CacheKey:     s.CacheKey,
		Title:        s.Title,
		Description:  s.Description,
		Theme:        s.Theme,
		Zoomable:     s.Zoomable,
		DefaultOpen:  s.DefaultOpen,
		EditorHeight: s.EditorHeight,
		UpdatedAt:    s.UpdatedAt,
	}
}

func newCodeSourceListResponse(items []domain.CodeSource) CodeSourceListResponse {
	dtos := make([]CodeSourceDTO, 0, len(items))
	for _, item := range items {
		dtos = append(dtos, newCodeSourceDTO(item))
	}
	return CodeSourceListResponse{Items: dtos}
}

func newVersionDTOs(items []domain.CodeSourceVersion) []CodeSourceVersionDTO {
	result := make([]CodeSourceVersionDTO, 0, len(items))
	for _, item := range items {
		result = append(result, CodeSourceVersionDTO{
			Version:    item.Version,
			Code:       item.Code,
			ChangeNote: item.ChangeNote,
			CreatedAt:  item.CreatedAt,
		})
	}
	return result
}
