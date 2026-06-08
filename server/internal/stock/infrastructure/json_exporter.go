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
