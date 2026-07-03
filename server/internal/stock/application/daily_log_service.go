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

// GetByDate 按日期查询当日收盘记录，不存在时返回 nil。
func (service *DailyLogService) GetByDate(ctx context.Context, date string) (*domain.DailyLog, error) {
	return service.repository.GetDailyLog(ctx, date)
}

// ListUnmatchedLegs 返回当前所有跨日未匹配的买/卖腿，供前端展示待匹配仓位。
func (service *DailyLogService) ListUnmatchedLegs(ctx context.Context) ([]domain.UnmatchedLeg, error) {
	return service.repository.ListUnmatchedLegs(ctx)
}

// GetPositionSnapshotAsOf 找 date 当天或之前最近一次收盘记录的持仓快照，供 Alpha 曲线使用。
func (service *DailyLogService) GetPositionSnapshotAsOf(ctx context.Context, date string) (*domain.PositionSnapshotAsOf, error) {
	return service.repository.GetPositionSnapshotAsOf(ctx, date)
}

// ListPositionSnapshotDates 返回所有实际提交过持仓快照的日期，供资产曲线 tooltip 使用。
func (service *DailyLogService) ListPositionSnapshotDates(ctx context.Context) (map[string][]domain.PositionSnapshot, error) {
	return service.repository.ListPositionSnapshotDates(ctx)
}
