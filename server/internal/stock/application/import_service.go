package application

import (
	"context"

	"github.com/Lkk-Web/interview/server/internal/stock/domain"
)

type ImportService struct {
	repository domain.Repository
}

func NewImportService(repository domain.Repository) *ImportService {
	return &ImportService{repository: repository}
}

func (service *ImportService) ImportSnapshot(ctx context.Context, snapshot domain.ImportSnapshot) error {
	return service.repository.ImportSnapshot(ctx, snapshot)
}
