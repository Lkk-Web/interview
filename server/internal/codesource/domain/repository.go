package domain

import "context"

// Repository 定义 codesource 领域需要的持久化能力。
// 放在 domain 层，让 application 依赖接口而不是 GORM 实现。
type Repository interface {
	// GetByKey 按 pageKey + codeKey 查询单条记录，找不到时返回 ErrNotFound。
	GetByKey(ctx context.Context, pageKey, codeKey string) (CodeSource, error)
	// ListByPage 返回某个 pageKey 下的所有公开记录。
	ListByPage(ctx context.Context, pageKey string) ([]CodeSource, error)
	// ListVersions 返回某条记录的历史版本，按版本号倒序。
	ListVersions(ctx context.Context, pageKey, codeKey string) ([]CodeSourceVersion, error)
}
