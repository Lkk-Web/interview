package application

import (
	"context"

	"github.com/Lkk-Web/interview/server/internal/stock/domain"
)

// DailyLogService 处理每日收盘记录的提交用例。
type DailyLogService struct {
	repository domain.Repository
}

func NewDailyLogService(repository domain.Repository) *DailyLogService {
	return &DailyLogService{repository: repository}
}

// Submit 写库、同步文件、追加 stock.md，三步由 repository 统一协调。
func (service *DailyLogService) Submit(ctx context.Context, log domain.DailyLog) error {
	return service.repository.AddDailyLog(ctx, log)
}
