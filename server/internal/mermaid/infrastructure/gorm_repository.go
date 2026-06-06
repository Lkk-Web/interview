package infrastructure

import (
	"context"
	"errors"
	"fmt"

	"github.com/Lkk-Web/interview/server/internal/mermaid/domain"
	"gorm.io/gorm"
)

type GormRepository struct {
	db *gorm.DB
}

func NewGormRepository(db *gorm.DB) *GormRepository {
	return &GormRepository{db: db}
}

func (repository *GormRepository) ListDiagrams(ctx context.Context, filter domain.DiagramFilter) ([]domain.Diagram, error) {
	query := repository.db.WithContext(ctx).Where("visibility = ?", "public")
	if filter.Category != "" {
		query = query.Where("category = ?", filter.Category)
	}

	var models []DiagramModel
	if err := query.Order("category ASC, id ASC").Find(&models).Error; err != nil {
		return nil, fmt.Errorf("list mermaid diagrams: %w", err)
	}
	return toDiagrams(models), nil
}

func (repository *GormRepository) GetDiagramBySlug(ctx context.Context, slug string) (domain.Diagram, error) {
	var model DiagramModel
	if err := repository.db.WithContext(ctx).
		Where("slug = ? AND visibility = ?", slug, "public").
		First(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return domain.Diagram{}, domain.ErrDiagramNotFound
		}
		return domain.Diagram{}, fmt.Errorf("get mermaid diagram %s: %w", slug, err)
	}
	return toDiagram(model), nil
}

func (repository *GormRepository) ListVersions(ctx context.Context, slug string) ([]domain.DiagramVersion, error) {
	diagram, err := repository.GetDiagramBySlug(ctx, slug)
	if err != nil {
		return nil, err
	}

	var models []DiagramVersionModel
	if err := repository.db.WithContext(ctx).
		Where("diagram_id = ?", diagram.ID).
		Order("version DESC").
		Find(&models).Error; err != nil {
		return nil, fmt.Errorf("list mermaid diagram versions %s: %w", slug, err)
	}
	return toVersions(models), nil
}

func toDiagrams(models []DiagramModel) []domain.Diagram {
	result := make([]domain.Diagram, 0, len(models))
	for _, model := range models {
		result = append(result, toDiagram(model))
	}
	return result
}

func toDiagram(model DiagramModel) domain.Diagram {
	return domain.Diagram{
		ID:              model.ID,
		Slug:            model.Slug,
		Title:           model.Title,
		Description:     model.Description,
		Category:        model.Category,
		Chart:           model.Chart,
		DiagramType:     model.DiagramType,
		Theme:           model.Theme,
		Zoomable:        model.Zoomable,
		Editable:        model.Editable,
		CacheKey:        model.CacheKey,
		SourcePath:      model.SourcePath,
		SourceComponent: model.SourceComponent,
		Visibility:      model.Visibility,
		CreatedAt:       model.CreatedAt,
		UpdatedAt:       model.UpdatedAt,
	}
}

func toVersions(models []DiagramVersionModel) []domain.DiagramVersion {
	result := make([]domain.DiagramVersion, 0, len(models))
	for _, model := range models {
		result = append(result, domain.DiagramVersion{
			ID:         model.ID,
			DiagramID:  model.DiagramID,
			Version:    model.Version,
			Chart:      model.Chart,
			ChangeNote: model.ChangeNote,
			CreatedAt:  model.CreatedAt,
		})
	}
	return result
}
