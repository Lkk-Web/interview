package infrastructure

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"

	"github.com/Lkk-Web/interview/server/internal/stock/domain"
)

// JSONExporter 把数据库数据同步回 data/stock/*.json 文件。
// 这让静态构建 (dumi build) 和 iOS 离线包始终拿到最新数据。
type JSONExporter struct {
	dataDir    string
	repository domain.Repository
}

func NewJSONExporter(dataDir string, repository domain.Repository) *JSONExporter {
	return &JSONExporter{dataDir: dataDir, repository: repository}
}

// ExportAssetHistory 把 asset-history.json 更新为当前数据库内容。
// 每次写入新记录后调用，保持文件和数据库同步。
func (e *JSONExporter) ExportAssetHistory(ctx context.Context) error {
	items, err := e.repository.ListAssetHistories(ctx)
	if err != nil {
		return fmt.Errorf("export asset history: %w", err)
	}
	return writeJSON(filepath.Join(e.dataDir, "asset-history.json"), toAssetHistoryJSONSlice(items))
}

func writeJSON(path string, v any) error {
	data, err := json.MarshalIndent(v, "", "  ")
	if err != nil {
		return fmt.Errorf("marshal json %s: %w", path, err)
	}
	return os.WriteFile(path, data, 0644)
}

// assetHistoryJSON 对应文件格式，字段名和前端保持一致。
type assetHistoryExportJSON struct {
	Date       string  `json:"date"`
	Cash       float64 `json:"cash"`
	StockValue float64 `json:"stockValue"`
	Loan       float64 `json:"loan"`
	Other      float64 `json:"other"`
	Remark     *string `json:"remark,omitempty"`
}

func toAssetHistoryJSONSlice(items []domain.AssetHistory) []assetHistoryExportJSON {
	result := make([]assetHistoryExportJSON, 0, len(items))
	for _, item := range items {
		result = append(result, assetHistoryExportJSON{
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

// ExportMonthly 把 monthly.json 更新为当前数据库内容。
func (e *JSONExporter) ExportMonthly(ctx context.Context) error {
	items, err := e.repository.ListMonthlyRecords(ctx)
	if err != nil {
		return fmt.Errorf("export monthly: %w", err)
	}
	return writeJSON(filepath.Join(e.dataDir, "monthly.json"), toMonthlyJSONSlice(items))
}

type monthlyExportJSON struct {
	Month    string   `json:"month"`
	TTarget  float64  `json:"tTarget"`
	TRevenue float64  `json:"tRevenue"`
	Remark   *string  `json:"remark,omitempty"`
}

func toMonthlyJSONSlice(items []domain.MonthlyRecord) []monthlyExportJSON {
	result := make([]monthlyExportJSON, 0, len(items))
	for _, item := range items {
		result = append(result, monthlyExportJSON{
			Month:    item.Month,
			TTarget:  item.TTarget,
			TRevenue: item.TRevenue,
			Remark:   item.Remark,
		})
	}
	return result
}

// ExportOtherIncome 把 other-income.json 更新为当前数据库内容。
func (e *JSONExporter) ExportOtherIncome(ctx context.Context) error {
	items, err := e.repository.ListOtherIncomes(ctx)
	if err != nil {
		return fmt.Errorf("export other income: %w", err)
	}
	return writeJSON(filepath.Join(e.dataDir, "other-income.json"), toOtherIncomeJSONSlice(items))
}

type otherIncomeExportJSON struct {
	Date   string  `json:"date"`
	Amount float64 `json:"amount"`
	Desc   string  `json:"desc"`
}

func toOtherIncomeJSONSlice(items []domain.OtherIncome) []otherIncomeExportJSON {
	result := make([]otherIncomeExportJSON, 0, len(items))
	for _, item := range items {
		result = append(result, otherIncomeExportJSON{
			Date:   item.Date,
			Amount: item.Amount,
			Desc:   item.Description,
		})
	}
	return result
}
func (e *JSONExporter) ExportPositions(ctx context.Context) error {
	items, err := e.repository.ListActivePositions(ctx)
	if err != nil {
		return fmt.Errorf("export positions: %w", err)
	}
	return writeJSON(filepath.Join(e.dataDir, "positions.json"), toPositionsJSONSlice(items))
}

type positionExportJSON struct {
	Stock  string                    `json:"stock"`
	Code   string                    `json:"code"`
	Cost   float64                   `json:"cost"`
	Shares float64                   `json:"shares"`
	Remark *string                   `json:"remark,omitempty"`
	Base   *positionBaseExportJSON   `json:"base,omitempty"`
	Target []positionTargetExportJSON `json:"target,omitempty"`
}

type positionBaseExportJSON struct {
	Cost   float64 `json:"cost"`
	Shares float64 `json:"shares"`
	Date   *string `json:"date,omitempty"`
	Remark *string `json:"remark,omitempty"`
}

type positionTargetExportJSON struct {
	Cost   float64 `json:"cost"`
	Price  float64 `json:"price"`
	Shares float64 `json:"shares"`
	Date   *string `json:"date,omitempty"`
	Remark *string `json:"remark,omitempty"`
	Status string  `json:"status,omitempty"`
}

func toPositionsJSONSlice(items []domain.Position) []positionExportJSON {
	result := make([]positionExportJSON, 0, len(items))
	for _, item := range items {
		p := positionExportJSON{
			Stock:  item.Stock,
			Code:   item.Code,
			Cost:   item.Cost,
			Shares: item.Shares,
			Remark: item.Remark,
		}
		if item.Base != nil {
			p.Base = &positionBaseExportJSON{
				Cost:   item.Base.Cost,
				Shares: item.Base.Shares,
				Date:   item.Base.Date,
				Remark: item.Base.Remark,
			}
		}
		targets := make([]positionTargetExportJSON, 0, len(item.Targets))
		for _, t := range item.Targets {
			targets = append(targets, positionTargetExportJSON{
				Cost:   t.Cost,
				Price:  t.Price,
				Shares: t.Shares,
				Date:   t.Date,
				Remark: t.Remark,
				Status: t.Status,
			})
		}
		p.Target = targets
		result = append(result, p)
	}
	return result
}
