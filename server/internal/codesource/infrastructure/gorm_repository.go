package infrastructure

import (
	"context"
	"errors"
	"fmt"

	"github.com/Lkk-Web/interview/server/internal/codesource/domain"
	"gorm.io/gorm"
)

// GormRepository 是 codesource domain.Repository 的 PostgreSQL 实现。
type GormRepository struct {
	db *gorm.DB
}

func NewGormRepository(db *gorm.DB) *GormRepository {
	return &GormRepository{db: db}
}

func (r *GormRepository) GetByKey(ctx context.Context, pageKey, codeKey string) (domain.CodeSource, error) {
	var model CodeSourceModel
	err := r.db.WithContext(ctx).
		Where("page_key = ? AND code_key = ? AND visibility = ?", pageKey, codeKey, "public").
		First(&model).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return domain.CodeSource{}, domain.ErrNotFound
		}
		return domain.CodeSource{}, fmt.Errorf("get code source %s:%s: %w", pageKey, codeKey, err)
	}
	return toCodeSource(model), nil
}

func (r *GormRepository) ListByPage(ctx context.Context, pageKey string) ([]domain.CodeSource, error) {
	var models []CodeSourceModel
	err := r.db.WithContext(ctx).
		Where("page_key = ? AND visibility = ?", pageKey, "public").
		Order("id ASC").
		Find(&models).Error
	if err != nil {
		return nil, fmt.Errorf("list code sources by page %s: %w", pageKey, err)
	}
	return toCodeSources(models), nil
}

func (r *GormRepository) ListVersions(ctx context.Context, pageKey, codeKey string) ([]domain.CodeSourceVersion, error) {
	// 先找到记录 ID，再查版本表；避免直接 JOIN 增加理解难度。
	source, err := r.GetByKey(ctx, pageKey, codeKey)
	if err != nil {
		return nil, err
	}

	var models []CodeSourceVersionModel
	err = r.db.WithContext(ctx).
		Where("code_source_id = ?", source.ID).
		Order("version DESC").
		Find(&models).Error
	if err != nil {
		return nil, fmt.Errorf("list versions %s:%s: %w", pageKey, codeKey, err)
	}
	return toVersions(models), nil
}

func toCodeSource(m CodeSourceModel) domain.CodeSource {
	return domain.CodeSource{
		ID:           m.ID,
		PageKey:      m.PageKey,
		CodeKey:      m.CodeKey,
		Lang:         m.Lang,
		Code:         m.Code,
		CacheKey:     m.CacheKey,
		Title:        m.Title,
		Description:  m.Description,
		Theme:        m.Theme,
		Zoomable:     m.Zoomable,
		DefaultOpen:  m.DefaultOpen,
		EditorHeight: m.EditorHeight,
		Visibility:   m.Visibility,
		CreatedAt:    m.CreatedAt,
		UpdatedAt:    m.UpdatedAt,
	}
}

func toCodeSources(models []CodeSourceModel) []domain.CodeSource {
	result := make([]domain.CodeSource, 0, len(models))
	for _, m := range models {
		result = append(result, toCodeSource(m))
	}
	return result
}

func toVersions(models []CodeSourceVersionModel) []domain.CodeSourceVersion {
	result := make([]domain.CodeSourceVersion, 0, len(models))
	for _, m := range models {
		result = append(result, domain.CodeSourceVersion{
			ID:           m.ID,
			CodeSourceID: m.CodeSourceID,
			Version:      m.Version,
			Code:         m.Code,
			ChangeNote:   m.ChangeNote,
			CreatedAt:    m.CreatedAt,
		})
	}
	return result
}
