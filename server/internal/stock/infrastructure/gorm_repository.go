package infrastructure

import (
	"context"
	"fmt"

	"github.com/Lkk-Web/interview/server/internal/stock/domain"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type GormRepository struct {
	db *gorm.DB
}

func NewGormRepository(db *gorm.DB) *GormRepository {
	return &GormRepository{db: db}
}

func (repository *GormRepository) ListAssetHistories(ctx context.Context) ([]domain.AssetHistory, error) {
	var models []AssetHistoryModel
	if err := repository.db.WithContext(ctx).Order("date ASC").Find(&models).Error; err != nil {
		return nil, fmt.Errorf("list asset histories: %w", err)
	}
	return toAssetHistories(models), nil
}

func (repository *GormRepository) ListMonthlyRecords(ctx context.Context) ([]domain.MonthlyRecord, error) {
	var models []MonthlyRecordModel
	if err := repository.db.WithContext(ctx).Order("month ASC").Find(&models).Error; err != nil {
		return nil, fmt.Errorf("list monthly records: %w", err)
	}
	return toMonthlyRecords(models), nil
}

func (repository *GormRepository) ListOtherIncomes(ctx context.Context) ([]domain.OtherIncome, error) {
	var models []OtherIncomeModel
	if err := repository.db.WithContext(ctx).Order("date ASC, id ASC").Find(&models).Error; err != nil {
		return nil, fmt.Errorf("list other incomes: %w", err)
	}
	return toOtherIncomes(models), nil
}

func (repository *GormRepository) ListActivePositions(ctx context.Context) ([]domain.Position, error) {
	var models []PositionModel
	if err := repository.db.WithContext(ctx).
		Preload("Base").
		Preload("Targets", func(db *gorm.DB) *gorm.DB {
			return db.Order("display_order ASC, id ASC")
		}).
		Where("active = ?", true).
		Order("display_order ASC, id ASC").
		Find(&models).Error; err != nil {
		return nil, fmt.Errorf("list active positions: %w", err)
	}
	return toPositions(models), nil
}

// ImportSnapshot 把一次完整的股票 JSON 快照导入数据库。
// Transaction 表示这些写入要么全部成功，要么任何一步失败就全部回滚，避免只导入一半数据。
func (repository *GormRepository) ImportSnapshot(ctx context.Context, snapshot domain.ImportSnapshot) error {
	// ctx 是 Go 的上下文对象，用来把取消、超时等信号传给数据库操作。
	return repository.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		// 每个 helper 都使用同一个 tx，确保它们属于同一个数据库事务。
		if err := upsertAssetHistories(tx, snapshot.AssetHistories); err != nil {
			return err
		}
		if err := upsertMonthlyRecords(tx, snapshot.MonthlyRecords); err != nil {
			return err
		}
		if err := replaceOtherIncomes(tx, snapshot.OtherIncomes); err != nil {
			return err
		}
		if err := upsertPositions(tx, snapshot.Positions); err != nil {
			return err
		}
		return nil
	})
}

func upsertAssetHistories(tx *gorm.DB, items []domain.AssetHistory) error {
	models := make([]AssetHistoryModel, 0, len(items))
	for _, item := range items {
		models = append(models, fromAssetHistory(item))
	}
	if len(models) == 0 {
		return nil
	}
	return tx.Clauses(clause.OnConflict{
		Columns: []clause.Column{{Name: "date"}},
		DoUpdates: clause.AssignmentColumns([]string{
			"cash", "stock_value", "loan", "other", "remark", "updated_at",
		}),
	}).Create(&models).Error
}

func upsertMonthlyRecords(tx *gorm.DB, items []domain.MonthlyRecord) error {
	models := make([]MonthlyRecordModel, 0, len(items))
	for _, item := range items {
		models = append(models, fromMonthlyRecord(item))
	}
	if len(models) == 0 {
		return nil
	}
	return tx.Clauses(clause.OnConflict{
		Columns: []clause.Column{{Name: "month"}},
		DoUpdates: clause.AssignmentColumns([]string{
			"t_target", "t_revenue", "remark", "updated_at",
		}),
	}).Create(&models).Error
}

func replaceOtherIncomes(tx *gorm.DB, items []domain.OtherIncome) error {
	// other-income.json 目前没有稳定 ID，导入时整体替换最容易理解，也避免重复插入。
	if err := tx.Session(&gorm.Session{AllowGlobalUpdate: true}).Delete(&OtherIncomeModel{}).Error; err != nil {
		return fmt.Errorf("clear other incomes: %w", err)
	}

	models := make([]OtherIncomeModel, 0, len(items))
	for _, item := range items {
		models = append(models, fromOtherIncome(item))
	}
	if len(models) == 0 {
		return nil
	}
	return tx.Create(&models).Error
}

func upsertPositions(tx *gorm.DB, items []domain.Position) error {
	for index, item := range items {
		model := fromPosition(item)
		model.DisplayOrder = index
		model.Active = true

		if err := tx.Clauses(clause.OnConflict{
			Columns: []clause.Column{{Name: "code"}},
			DoUpdates: clause.AssignmentColumns([]string{
				"stock", "cost", "shares", "remark", "display_order", "active", "updated_at",
			}),
		}).Create(&model).Error; err != nil {
			return fmt.Errorf("upsert position %s: %w", item.Code, err)
		}

		var saved PositionModel
		if err := tx.Where("code = ?", item.Code).First(&saved).Error; err != nil {
			return fmt.Errorf("reload position %s: %w", item.Code, err)
		}

		if err := replacePositionBase(tx, saved.ID, item.Base); err != nil {
			return err
		}
		if err := replacePositionTargets(tx, saved.ID, item.Targets); err != nil {
			return err
		}
	}
	return nil
}

func replacePositionBase(tx *gorm.DB, positionID uint, base *domain.PositionBase) error {
	if base == nil {
		return tx.Where("position_id = ?", positionID).Delete(&PositionBaseModel{}).Error
	}

	model := fromPositionBase(positionID, *base)
	return tx.Clauses(clause.OnConflict{
		Columns: []clause.Column{{Name: "position_id"}},
		DoUpdates: clause.AssignmentColumns([]string{
			"cost", "shares", "date", "remark", "updated_at",
		}),
	}).Create(&model).Error
}

func replacePositionTargets(tx *gorm.DB, positionID uint, targets []domain.PositionTarget) error {
	if err := tx.Where("position_id = ?", positionID).Delete(&PositionTargetModel{}).Error; err != nil {
		return fmt.Errorf("clear position targets: %w", err)
	}

	models := make([]PositionTargetModel, 0, len(targets))
	for index, target := range targets {
		model := fromPositionTarget(positionID, target)
		model.DisplayOrder = index
		if model.Status == "" {
			model.Status = "planned"
		}
		models = append(models, model)
	}
	if len(models) == 0 {
		return nil
	}
	return tx.Create(&models).Error
}

func toAssetHistories(models []AssetHistoryModel) []domain.AssetHistory {
	result := make([]domain.AssetHistory, 0, len(models))
	for _, model := range models {
		result = append(result, domain.AssetHistory{
			ID:         model.ID,
			Date:       model.Date,
			Cash:       model.Cash,
			StockValue: model.StockValue,
			Loan:       model.Loan,
			Other:      model.Other,
			Remark:     model.Remark,
		})
	}
	return result
}

func toMonthlyRecords(models []MonthlyRecordModel) []domain.MonthlyRecord {
	result := make([]domain.MonthlyRecord, 0, len(models))
	for _, model := range models {
		result = append(result, domain.MonthlyRecord{
			ID:       model.ID,
			Month:    model.Month,
			TTarget:  model.TTarget,
			TRevenue: model.TRevenue,
			Remark:   model.Remark,
		})
	}
	return result
}

func toOtherIncomes(models []OtherIncomeModel) []domain.OtherIncome {
	result := make([]domain.OtherIncome, 0, len(models))
	for _, model := range models {
		result = append(result, domain.OtherIncome{
			ID:          model.ID,
			Date:        model.Date,
			Amount:      model.Amount,
			Description: model.Description,
			Remark:      model.Remark,
		})
	}
	return result
}

func toPositions(models []PositionModel) []domain.Position {
	result := make([]domain.Position, 0, len(models))
	for _, model := range models {
		position := domain.Position{
			ID:           model.ID,
			Stock:        model.Stock,
			Code:         model.Code,
			Cost:         model.Cost,
			Shares:       model.Shares,
			Remark:       model.Remark,
			DisplayOrder: model.DisplayOrder,
			Active:       model.Active,
			Targets:      toPositionTargets(model.Targets),
		}
		if model.Base != nil {
			position.Base = &domain.PositionBase{
				ID:     model.Base.ID,
				Cost:   model.Base.Cost,
				Shares: model.Base.Shares,
				Date:   model.Base.Date,
				Remark: model.Base.Remark,
			}
		}
		result = append(result, position)
	}
	return result
}

func toPositionTargets(models []PositionTargetModel) []domain.PositionTarget {
	result := make([]domain.PositionTarget, 0, len(models))
	for _, model := range models {
		result = append(result, domain.PositionTarget{
			ID:           model.ID,
			Cost:         model.Cost,
			Price:        model.Price,
			Shares:       model.Shares,
			Date:         model.Date,
			Remark:       model.Remark,
			Status:       model.Status,
			DisplayOrder: model.DisplayOrder,
		})
	}
	return result
}

func fromAssetHistory(item domain.AssetHistory) AssetHistoryModel {
	return AssetHistoryModel{
		Date:       item.Date,
		Cash:       item.Cash,
		StockValue: item.StockValue,
		Loan:       item.Loan,
		Other:      item.Other,
		Remark:     item.Remark,
	}
}

func fromMonthlyRecord(item domain.MonthlyRecord) MonthlyRecordModel {
	return MonthlyRecordModel{
		Month:    item.Month,
		TTarget:  item.TTarget,
		TRevenue: item.TRevenue,
		Remark:   item.Remark,
	}
}

func fromOtherIncome(item domain.OtherIncome) OtherIncomeModel {
	return OtherIncomeModel{
		Date:        item.Date,
		Amount:      item.Amount,
		Description: item.Description,
		Remark:      item.Remark,
	}
}

func fromPosition(item domain.Position) PositionModel {
	return PositionModel{
		Stock:        item.Stock,
		Code:         item.Code,
		Cost:         item.Cost,
		Shares:       item.Shares,
		Remark:       item.Remark,
		DisplayOrder: item.DisplayOrder,
		Active:       item.Active,
	}
}

func fromPositionBase(positionID uint, base domain.PositionBase) PositionBaseModel {
	return PositionBaseModel{
		PositionID: positionID,
		Cost:       base.Cost,
		Shares:     base.Shares,
		Date:       base.Date,
		Remark:     base.Remark,
	}
}

func fromPositionTarget(positionID uint, target domain.PositionTarget) PositionTargetModel {
	return PositionTargetModel{
		PositionID:   positionID,
		Cost:         target.Cost,
		Price:        target.Price,
		Shares:       target.Shares,
		Date:         target.Date,
		Remark:       target.Remark,
		Status:       target.Status,
		DisplayOrder: target.DisplayOrder,
	}
}
