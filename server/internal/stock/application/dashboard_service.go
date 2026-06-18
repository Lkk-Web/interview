package application

import (
	"context"

	"github.com/Lkk-Web/interview/server/internal/stock/domain"
)

// Dashboard 是前端股票仪表盘需要的一次性聚合数据。
// 它刻意保持和当前 React 组件 props 接近，替换 JSON 时前端改动最少。
type Dashboard struct {
	AssetHistory []domain.AssetHistory
	Positions    []domain.Position
	Monthly      []domain.MonthlyRecord
	OtherIncome  []domain.OtherIncome
}

// DashboardService 是 stock 领域的应用服务。
// application 层负责“怎么完成一个用例”，比如这里要同时读取资产、持仓、月度和其他收入。
type DashboardService struct {
	repository domain.Repository
}

// NewDashboardService 通过接口接收 repository，避免 application 层绑定 GORM。
func NewDashboardService(repository domain.Repository) *DashboardService {
	return &DashboardService{repository: repository}
}

// GetDashboard 聚合仪表盘数据。
// 这里不做复杂计算，是因为前端已有图表计算逻辑；后端第一阶段先稳定替换数据源。
func (service *DashboardService) GetDashboard(ctx context.Context) (Dashboard, error) {
	assetHistory, err := service.GetAssetHistory(ctx)
	if err != nil {
		return Dashboard{}, err
	}
	positions, err := service.GetPositions(ctx)
	if err != nil {
		return Dashboard{}, err
	}
	monthly, err := service.GetMonthly(ctx)
	if err != nil {
		return Dashboard{}, err
	}
	otherIncome, err := service.GetOtherIncome(ctx)
	if err != nil {
		return Dashboard{}, err
	}

	return Dashboard{
		AssetHistory: assetHistory,
		Positions:    positions,
		Monthly:      monthly,
		OtherIncome:  otherIncome,
	}, nil
}

// GetAssetHistory 单独暴露资产曲线数据，方便后续管理页或调试接口复用。
func (service *DashboardService) GetAssetHistory(ctx context.Context) ([]domain.AssetHistory, error) {
	return service.repository.ListAssetHistories(ctx)
}

// GetMonthly 单独暴露月度 T 收益数据。
func (service *DashboardService) GetMonthly(ctx context.Context) ([]domain.MonthlyRecord, error) {
	return service.repository.ListMonthlyRecords(ctx)
}

// GetOtherIncome 单独暴露其他收入/支出数据。
func (service *DashboardService) GetOtherIncome(ctx context.Context) ([]domain.OtherIncome, error) {
	return service.repository.ListOtherIncomes(ctx)
}

// GetPositions 单独暴露当前有效持仓数据。
func (service *DashboardService) GetPositions(ctx context.Context) ([]domain.Position, error) {
	return service.repository.ListActivePositions(ctx)
}

// AddAssetHistory 新增一条资产快照，写库后自动同步 JSON 文件。
func (service *DashboardService) AddAssetHistory(ctx context.Context, item domain.AssetHistory) (domain.AssetHistory, error) {
	return service.repository.AddAssetHistory(ctx, item)
}

// GetAssetHistoryByDate 按日期查单条资产快照，不存在时返回 nil。
func (service *DashboardService) GetAssetHistoryByDate(ctx context.Context, date string) (*domain.AssetHistory, error) {
	return service.repository.GetAssetHistoryByDate(ctx, date)
}

// UpsertOtherIncome 按日期+描述 upsert 一条其他收入记录，写库后同步 JSON 文件。
func (service *DashboardService) UpsertOtherIncome(ctx context.Context, item domain.OtherIncome) (domain.OtherIncome, error) {
	return service.repository.UpsertOtherIncome(ctx, item)
}
