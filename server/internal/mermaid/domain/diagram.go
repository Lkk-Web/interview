package domain

import "time"

// Diagram 是 Mermaid 图表的核心业务对象。
// 这里保存 Mermaid 源码 chart，而不是 SVG，因为源码更适合编辑、版本管理和重新渲染。
type Diagram struct {
	ID uint
	// Slug 是稳定业务 ID，前端可以用它请求某一张图，例如 architecture-open-claw。
	Slug string
	// Title/Description/Category 来自现在 TSX demo 注释里的元信息。
	Title       string
	Description *string
	Category    *string
	// Chart 是 Mermaid DSL 原文。
	Chart string
	// DiagramType 记录 flowchart/sequenceDiagram/mindmap 等类型，方便筛选和校验。
	DiagramType string
	Theme       string
	Zoomable    bool
	Editable    bool
	// CacheKey 用来兼容现有 CodeEditor 的 localStorage key。
	CacheKey        *string
	SourcePath      *string
	SourceComponent *string
	Visibility      string
	CreatedAt       time.Time
	UpdatedAt       time.Time
}

// DiagramVersion 是 Mermaid 图的一次历史版本。
// 后续新增保存接口时，每次保存可以写一条版本记录，方便回滚。
type DiagramVersion struct {
	ID         uint
	DiagramID  uint
	Version    int
	Chart      string
	ChangeNote *string
	CreatedAt  time.Time
}
