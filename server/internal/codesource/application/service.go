package application

import (
	"context"

	"github.com/Lkk-Web/interview/server/internal/codesource/domain"
)

// Service 是 codesource 领域的应用服务，编排所有代码内容相关用例。
type Service struct {
	repository domain.Repository
}

func NewService(repository domain.Repository) *Service {
	return &Service{repository: repository}
}

// GetByKey 按 pageKey + codeKey 查询单条代码内容。
func (service *Service) GetByKey(ctx context.Context, pageKey, codeKey string) (domain.CodeSource, error) {
	return service.repository.GetByKey(ctx, pageKey, codeKey)
}

// ListByPage 返回某个 pageKey 下的所有公开内容，前端可用来初始化页面的全量数据。
func (service *Service) ListByPage(ctx context.Context, pageKey string) ([]domain.CodeSource, error) {
	return service.repository.ListByPage(ctx, pageKey)
}

// ListVersions 返回某条记录的编辑历史。
func (service *Service) ListVersions(ctx context.Context, pageKey, codeKey string) ([]domain.CodeSourceVersion, error) {
	return service.repository.ListVersions(ctx, pageKey, codeKey)
}
