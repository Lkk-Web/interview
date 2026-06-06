package domain

import "context"

// Repository hides persistence details from Mermaid use cases.
// 对 Mermaid 来说，“按 slug 找图”和“查版本”是业务能力，不应该绑定某个数据库库表写法。
type Repository interface {
	ListDiagrams(ctx context.Context, filter DiagramFilter) ([]Diagram, error)
	GetDiagramBySlug(ctx context.Context, slug string) (Diagram, error)
	ListVersions(ctx context.Context, slug string) ([]DiagramVersion, error)
}

type DiagramFilter struct {
	Category string
}
