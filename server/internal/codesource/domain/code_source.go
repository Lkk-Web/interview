package domain

import "time"

// CodeSource 是代码/图表内容的核心业务对象。
// 它对应前端 CodeGateway 的 CodeSource 类型，支持 mermaid/markdown/html/json 等多种语言。
type CodeSource struct {
	ID uint
	// PageKey 是页面或业务域的隔离 key，例如 "summary-editor"、"expand-mermaid"。
	PageKey string
	// CodeKey 是同一 PageKey 下的内容标识符，例如 "demo-mermaid"。
	// PageKey + CodeKey 组合唯一，对应前端的 pageKey:codeKey 组合查找。
	CodeKey string
	// Lang 是代码语言，决定前端用 Mermaid 还是 CodeEditor 渲染。
	Lang string
	// Code 是实际代码或 Mermaid 图表内容。
	Code string
	// CacheKey 兼容前端 CodeEditor 的 localStorage 草稿 key。
	CacheKey    *string
	Title       *string
	Description *string
	// Theme/Zoomable 是 Mermaid 专属展示配置。
	Theme    string
	Zoomable bool
	// DefaultOpen/EditorHeight 是 CodeEditor 专属配置。
	DefaultOpen  bool
	EditorHeight *int
	Visibility   string
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

// CodeSourceVersion 是一次编辑历史快照，后续加"保存到服务端"时用于回滚。
type CodeSourceVersion struct {
	ID           uint
	CodeSourceID uint
	Version      int
	Code         string
	ChangeNote   *string
	CreatedAt    time.Time
}
