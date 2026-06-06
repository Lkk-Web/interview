package infrastructure

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"

	"github.com/Lkk-Web/interview/server/internal/stock/domain"
)

// JSONSnapshotLoader 负责读取旧的 data/stock/*.json。
// 它属于 infrastructure，因为 JSON 文件只是数据来源的一种技术实现。
type JSONSnapshotLoader struct {
	dataDir string
}

func NewJSONSnapshotLoader(dataDir string) *JSONSnapshotLoader {
	return &JSONSnapshotLoader{dataDir: dataDir}
}

// Load 把四份 JSON 一次性读成领域层 ImportSnapshot。
// importer 再把这个快照交给 application service 写入数据库。
func (loader *JSONSnapshotLoader) Load() (domain.ImportSnapshot, error) {
	assetHistories, err := readJSON[[]assetHistoryJSON](loader.filePath("asset-history.json"))
	if err != nil {
		return domain.ImportSnapshot{}, err
	}
	monthlyRecords, err := readJSON[[]monthlyRecordJSON](loader.filePath("monthly.json"))
	if err != nil {
		return domain.ImportSnapshot{}, err
	}
	otherIncomes, err := readJSON[[]otherIncomeJSON](loader.filePath("other-income.json"))
	if err != nil {
		return domain.ImportSnapshot{}, err
	}
	positions, err := readJSON[[]positionJSON](loader.filePath("positions.json"))
	if err != nil {
		return domain.ImportSnapshot{}, err
	}

	return domain.ImportSnapshot{
		AssetHistories: toDomainAssetHistories(assetHistories),
		MonthlyRecords: toDomainMonthlyRecords(monthlyRecords),
		OtherIncomes:   toDomainOtherIncomes(otherIncomes),
		Positions:      toDomainPositions(positions),
	}, nil
}

func (loader *JSONSnapshotLoader) filePath(name string) string {
	return filepath.Join(loader.dataDir, name)
}

func readJSON[T any](path string) (T, error) {
	var value T
	data, err := os.ReadFile(path)
	if err != nil {
		return value, fmt.Errorf("read %s: %w", path, err)
	}
	if err := json.Unmarshal(data, &value); err != nil {
		return value, fmt.Errorf("parse %s: %w", path, err)
	}
	return value, nil
}

// 以下 *JSON 结构只描述旧 JSON 的字段名。
// 读取后会转换成 domain 对象，避免旧字段名影响后续业务模型命名。
type assetHistoryJSON struct {
	Date       string  `json:"date"`
	Cash       float64 `json:"cash"`
	StockValue float64 `json:"stockValue"`
	Loan       float64 `json:"loan"`
	Other      float64 `json:"other"`
	Remark     *string `json:"remark"`
}

type monthlyRecordJSON struct {
	Month    string  `json:"month"`
	TTarget  float64 `json:"tTarget"`
	TRevenue float64 `json:"tRevenue"`
	Remark   *string `json:"remark"`
}

type otherIncomeJSON struct {
	Date   string  `json:"date"`
	Amount float64 `json:"amount"`
	Desc   string  `json:"desc"`
	Remark *string `json:"remark"`
}

type positionJSON struct {
	Stock  string               `json:"stock"`
	Code   string               `json:"code"`
	Cost   float64              `json:"cost"`
	Shares float64              `json:"shares"`
	Remark *string              `json:"remark"`
	Base   *positionBaseJSON    `json:"base"`
	Target []positionTargetJSON `json:"target"`
}

type positionBaseJSON struct {
	Cost   float64 `json:"cost"`
	Shares float64 `json:"shares"`
	Date   *string `json:"date"`
	Remark *string `json:"remark"`
}

type positionTargetJSON struct {
	Cost   float64 `json:"cost"`
	Price  float64 `json:"price"`
	Shares float64 `json:"shares"`
	Date   *string `json:"date"`
	Remark *string `json:"remark"`
	Status string  `json:"status"`
}

func toDomainAssetHistories(items []assetHistoryJSON) []domain.AssetHistory {
	result := make([]domain.AssetHistory, 0, len(items))
	for _, item := range items {
		result = append(result, domain.AssetHistory{
			Date:       item.Date,
			Cash:       item.Cash,
			StockValue: item.StockValue,
			Loan:       item.Loan,
			Other:      item.Other,
			Remark:     item.Remark,
		})
	}
	return result
}

func toDomainMonthlyRecords(items []monthlyRecordJSON) []domain.MonthlyRecord {
	result := make([]domain.MonthlyRecord, 0, len(items))
	for _, item := range items {
		result = append(result, domain.MonthlyRecord{
			Month:    item.Month,
			TTarget:  item.TTarget,
			TRevenue: item.TRevenue,
			Remark:   item.Remark,
		})
	}
	return result
}

func toDomainOtherIncomes(items []otherIncomeJSON) []domain.OtherIncome {
	result := make([]domain.OtherIncome, 0, len(items))
	for _, item := range items {
		result = append(result, domain.OtherIncome{
			Date:        item.Date,
			Amount:      item.Amount,
			Description: item.Desc,
			Remark:      item.Remark,
		})
	}
	return result
}

func toDomainPositions(items []positionJSON) []domain.Position {
	result := make([]domain.Position, 0, len(items))
	for index, item := range items {
		position := domain.Position{
			Stock:        item.Stock,
			Code:         item.Code,
			Cost:         item.Cost,
			Shares:       item.Shares,
			Remark:       item.Remark,
			DisplayOrder: index,
			Active:       true,
			Targets:      toDomainPositionTargets(item.Target),
		}
		if item.Base != nil {
			position.Base = &domain.PositionBase{
				Cost:   item.Base.Cost,
				Shares: item.Base.Shares,
				Date:   item.Base.Date,
				Remark: item.Base.Remark,
			}
		}
		result = append(result, position)
	}
	return result
}

func toDomainPositionTargets(items []positionTargetJSON) []domain.PositionTarget {
	result := make([]domain.PositionTarget, 0, len(items))
	for index, item := range items {
		status := item.Status
		if status == "" {
			status = "planned"
		}
		result = append(result, domain.PositionTarget{
			Cost:         item.Cost,
			Price:        item.Price,
			Shares:       item.Shares,
			Date:         item.Date,
			Remark:       item.Remark,
			Status:       status,
			DisplayOrder: index,
		})
	}
	return result
}
