package application

import (
	"context"

	"github.com/Lkk-Web/interview/server/internal/mermaid/domain"
)

// Service 是 Mermaid 领域的应用服务。
// 第一阶段只做读取；后续新增保存/发布/回滚时也放在这里编排。
type Service struct {
	repository domain.Repository
}

func NewService(repository domain.Repository) *Service {
	return &Service{repository: repository}
}

// ListDiagrams 返回公开 Mermaid 图列表，可按 category 过滤。
func (service *Service) ListDiagrams(ctx context.Context, category string) ([]domain.Diagram, error) {
	return service.repository.ListDiagrams(ctx, domain.DiagramFilter{Category: category})
}

// GetDiagram 按 slug 查询单张 Mermaid 图。
func (service *Service) GetDiagram(ctx context.Context, slug string) (domain.Diagram, error) {
	return service.repository.GetDiagramBySlug(ctx, slug)
}

// ListVersions 查询 Mermaid 图历史版本。
func (service *Service) ListVersions(ctx context.Context, slug string) ([]domain.DiagramVersion, error) {
	return service.repository.ListVersions(ctx, slug)
}
