package infrastructure

import (
	"context"
	"errors"
	"fmt"

	"github.com/Lkk-Web/interview/server/internal/stock/domain"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

// defaultMonthlyTTarget 是新月份第一次提交每日记录时，若月度记录尚不存在使用的默认做T目标。
// 需要和前端 DEFAULT_MONTHLY_T_TARGET（src/StockDashboard/index.tsx）保持一致。
const defaultMonthlyTTarget = 2500

type GormRepository struct {
	db             *gorm.DB
	exporter       *JSONExporter
	markdownWriter *MarkdownWriter
	gitCommitter   *GitCommitter
}

func NewGormRepository(db *gorm.DB) *GormRepository {
	return &GormRepository{db: db}
}

// SetExporter 注入 JSON 导出器；用 setter 而不是构造参数，避免循环依赖（exporter 也依赖 repository）。
func (repository *GormRepository) SetExporter(exporter *JSONExporter) {
	repository.exporter = exporter
}

// SetMarkdownWriter 注入 stock.md 写入器。
func (repository *GormRepository) SetMarkdownWriter(writer *MarkdownWriter) {
	repository.markdownWriter = writer
}

// SetGitCommitter 注入 git 自动提交器。
func (repository *GormRepository) SetGitCommitter(committer *GitCommitter) {
	repository.gitCommitter = committer
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
				"stock", "cost", "shares", "remark", "display_order", "active",
				"base_cost", "base_shares", "base_date", "base_remark", "updated_at",
			}),
		}).Create(&model).Error; err != nil {
			return fmt.Errorf("upsert position %s: %w", item.Code, err)
		}

		var saved PositionModel
		if err := tx.Where("code = ?", item.Code).First(&saved).Error; err != nil {
			return fmt.Errorf("reload position %s: %w", item.Code, err)
		}

		if err := replacePositionTargets(tx, saved.ID, item.Targets); err != nil {
			return err
		}
	}
	return nil
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
		if model.BaseCost != nil {
			position.Base = &domain.PositionBase{
				Cost:   *model.BaseCost,
				Shares: func() float64 {
					if model.BaseShares != nil {
						return *model.BaseShares
					}
					return 0
				}(),				Date:   model.BaseDate,
				Remark: model.BaseRemark,
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

// UpsertOtherIncome 按日期 + description 唯一标识 upsert 一条记录，写库后同步 JSON 文件。
func (repository *GormRepository) UpsertOtherIncome(ctx context.Context, item domain.OtherIncome) (domain.OtherIncome, error) {
	model := fromOtherIncome(item)
	// 同一天同一 description 视为同一条记录，更新 amount；否则插入新行。
	result := repository.db.WithContext(ctx).
		Where(OtherIncomeModel{Date: item.Date, Description: item.Description}).
		Assign(OtherIncomeModel{Amount: item.Amount, Remark: item.Remark}).
		FirstOrCreate(&model)
	if result.Error != nil {
		return domain.OtherIncome{}, fmt.Errorf("upsert other income: %w", result.Error)
	}
	// 如果记录已存在（RowsAffected==0），需要手动更新 amount
	if result.RowsAffected == 0 {
		if err := repository.db.WithContext(ctx).Model(&model).
			Updates(map[string]any{"amount": item.Amount, "remark": item.Remark}).Error; err != nil {
			return domain.OtherIncome{}, fmt.Errorf("update other income: %w", err)
		}
	}
	if repository.exporter != nil {
		if err := repository.exporter.ExportOtherIncome(ctx); err != nil {
			return domain.OtherIncome{}, fmt.Errorf("sync other-income.json: %w", err)
		}
	}
	return domain.OtherIncome{
		ID:          model.ID,
		Date:        model.Date,
		Amount:      model.Amount,
		Description: model.Description,
		Remark:      model.Remark,
	}, nil
}

func fromPosition(item domain.Position) PositionModel {
	model := PositionModel{
		Stock:        item.Stock,
		Code:         item.Code,
		Cost:         item.Cost,
		Shares:       item.Shares,
		Remark:       item.Remark,
		DisplayOrder: item.DisplayOrder,
		Active:       item.Active,
	}
	if item.Base != nil {
		model.BaseCost = &item.Base.Cost
		model.BaseShares = &item.Base.Shares
		model.BaseDate = item.Base.Date
		model.BaseRemark = item.Base.Remark
	}
	return model
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

// AddAssetHistory 按日期 upsert 一条资产快照。
// 若其他资产相对前一天有变动（delta != 0），自动写一条"其他资产变动"到 other_incomes，
// 并把 asset-history.json 和 other-income.json 一起 commit；无变动时只提交 asset-history.json。
func (repository *GormRepository) AddAssetHistory(ctx context.Context, item domain.AssetHistory) (domain.AssetHistory, error) {
	model := fromAssetHistory(item)
	result := repository.db.WithContext(ctx).
		Where(AssetHistoryModel{Date: model.Date}).
		FirstOrCreate(&model)
	if result.Error != nil {
		return domain.AssetHistory{}, fmt.Errorf("add asset history: %w", result.Error)
	}
	// 记录已存在时更新各字段
	if result.RowsAffected == 0 {
		if err := repository.db.WithContext(ctx).Model(&model).
			Updates(map[string]any{
				"cash":        item.Cash,
				"stock_value": item.StockValue,
				"loan":        item.Loan,
				"other":       item.Other,
				"remark":      item.Remark,
			}).Error; err != nil {
			return domain.AssetHistory{}, fmt.Errorf("update asset history: %w", err)
		}
		// 读回最新值
		if err := repository.db.WithContext(ctx).First(&model, model.ID).Error; err != nil {
			return domain.AssetHistory{}, fmt.Errorf("reload asset history: %w", err)
		}
	}
	saved := toAssetHistory(model)

	// 自动计算 other 增量：找该日期前一条记录，与本次 other 求差。
	// 只有当差值不为 0（即其他资产相对前一天确实变动）时，才写一条"其他资产变动"。
	// 这样无变动的日子既不会在 other_incomes 表里多出一条 amount=0 的冗余记录，
	// 也不会去改动 other-income.json 文件。
	otherIncomeChanged := false
	var prevModel AssetHistoryModel
	prevErr := repository.db.WithContext(ctx).
		Where("date < ?", item.Date).
		Order("date DESC").
		First(&prevModel).Error
	if prevErr != nil && !errors.Is(prevErr, gorm.ErrRecordNotFound) {
		return saved, fmt.Errorf("find prev asset history: %w", prevErr)
	}
	delta := item.Other - prevModel.Other
	if delta != 0 {
		// 按 日期+description 唯一 upsert，description 固定为"其他资产变动"
		otherModel := OtherIncomeModel{Date: item.Date, Description: "其他资产变动"}
		if err := repository.db.WithContext(ctx).
			Where(OtherIncomeModel{Date: item.Date, Description: "其他资产变动"}).
			FirstOrCreate(&otherModel).Error; err != nil {
			return saved, fmt.Errorf("upsert other income: %w", err)
		}
		if err := repository.db.WithContext(ctx).Model(&otherModel).
			Update("amount", delta).Error; err != nil {
			return saved, fmt.Errorf("update other income amount: %w", err)
		}
		otherIncomeChanged = true
	}

	// 写入成功后同步 JSON，exporter 可选（测试或未配置 dataDir 时为 nil）。
	if repository.exporter != nil {
		if err := repository.exporter.ExportAssetHistory(ctx); err != nil {
			return saved, fmt.Errorf("sync json after add: %w", err)
		}
		// asset-history.json 一定变了，先放进待提交列表。
		changedFiles := []string{"data/stock/asset-history.json"}

		// 只有其他资产真有变动时，才同步并把 other-income.json 一起带进同一次 commit。
		if otherIncomeChanged {
			if err := repository.exporter.ExportOtherIncome(ctx); err != nil {
				return saved, fmt.Errorf("sync other-income.json: %w", err)
			}
			changedFiles = append(changedFiles, "data/stock/other-income.json")
		}

		// 文件同步完成后自动 git commit + push（两个文件在同一次提交里）
		if repository.gitCommitter != nil {
			repository.gitCommitter.CommitAndPush(saved.Date, "asset", changedFiles)
		}
	}
	return saved, nil
}

func (repository *GormRepository) GetAssetHistoryByDate(ctx context.Context, date string) (*domain.AssetHistory, error) {
	var model AssetHistoryModel
	err := repository.db.WithContext(ctx).Where("date = ?", date).First(&model).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("get asset history by date: %w", err)
	}
	item := toAssetHistory(model)
	return &item, nil
}

func toAssetHistory(model AssetHistoryModel) domain.AssetHistory {
	return domain.AssetHistory{
		ID:         model.ID,
		Date:       model.Date,
		Cash:       model.Cash,
		StockValue: model.StockValue,
		Loan:       model.Loan,
		Other:      model.Other,
		Remark:     model.Remark,
	}
}

// AddDailyLog 在一个事务里完成：写 daily_log + trades + t_records，
// 更新持仓成本/数量，更新月度T收益，提交后同步文件和 stock.md。
func (repository *GormRepository) AddDailyLog(ctx context.Context, log domain.DailyLog) error {
	var savedLogID uint

	err := repository.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		// upsert daily_log 头记录
		logModel := DailyLogModel{
			Date:            log.Date,
			Marker:          log.Marker,
			ReviewMarket:    log.Review.Market,
			ReviewFeeling:   log.Review.Feeling,
			ReviewNextPlan:  log.Review.NextPlan,
			MonthlyTRevenue: log.MonthlyTRevenue,
		}
		if err := tx.Where(DailyLogModel{Date: log.Date}).
			Assign(DailyLogModel{
				Marker:          log.Marker,
				ReviewMarket:    log.Review.Market,
				ReviewFeeling:   log.Review.Feeling,
				ReviewNextPlan:  log.Review.NextPlan,
				MonthlyTRevenue: log.MonthlyTRevenue,
			}).
			FirstOrCreate(&logModel).Error; err != nil {
			return fmt.Errorf("upsert daily log: %w", err)
		}
		savedLogID = logModel.ID

		// 先删旧的 trades / t_records，再全量重插（幂等）
		if err := tx.Where("daily_log_id = ?", savedLogID).Delete(&TradeModel{}).Error; err != nil {
			return fmt.Errorf("clear trades: %w", err)
		}
		if err := tx.Where("daily_log_id = ?", savedLogID).Delete(&TRecordModel{}).Error; err != nil {
			return fmt.Errorf("clear t_records: %w", err)
		}

		tradeModels := make([]TradeModel, 0, len(log.Trades))
		for i, t := range log.Trades {
			tradeModels = append(tradeModels, TradeModel{
				DailyLogID:   savedLogID,
				Action:       t.Action,
				Stock:        t.Stock,
				Code:         t.Code,
				Price:        t.Price,
				Shares:       t.Shares,
				DisplayOrder: i,
			})
		}
		if len(tradeModels) > 0 {
			if err := tx.Create(&tradeModels).Error; err != nil {
				return fmt.Errorf("insert trades: %w", err)
			}
		}

		tRecordModels := make([]TRecordModel, 0, len(log.TRecords))
		for i, r := range log.TRecords {
			tRecordModels = append(tRecordModels, TRecordModel{
				DailyLogID:   savedLogID,
				Stock:        r.Stock,
				Description:  r.Desc,
				GrossProfit:  r.GrossProfit,
				Fee:          r.Fee,
				Tax:          r.Tax,
				NetRevenue:   r.NetRevenue,
				DisplayOrder: i,
			})
		}
		if len(tRecordModels) > 0 {
			if err := tx.Create(&tRecordModels).Error; err != nil {
				return fmt.Errorf("insert t_records: %w", err)
			}
		}

		// 更新持仓成本和数量，同时保存当日持仓快照
		if err := tx.Where("daily_log_id = ?", savedLogID).Delete(&DailyLogPositionModel{}).Error; err != nil {
			return fmt.Errorf("clear position snapshots: %w", err)
		}
		for _, p := range log.PositionUpdates {
			if err := tx.Model(&PositionModel{}).
				Where("code = ?", p.Code).
				Updates(map[string]any{"cost": p.Cost, "shares": p.Shares}).Error; err != nil {
				return fmt.Errorf("update position %s: %w", p.Code, err)
			}
			if p.Shares > 0 {
				if err := tx.Create(&DailyLogPositionModel{DailyLogID: savedLogID, Stock: p.Stock, Code: p.Code, Cost: p.Cost, Shares: p.Shares, Price: p.Price}).Error; err != nil {
					return fmt.Errorf("insert position snapshot %s: %w", p.Code, err)
				}
			}
		}

		// 更新月度T收益：跨月第一天提交时，当月记录还不存在，
		// 需要先按默认目标创建，否则下面的 Update 会静默地什么都不改（RowsAffected=0）
		if log.MonthlyTRevenue != 0 {
			month := log.Date[:7] // "2026-07"
			var monthlyModel MonthlyRecordModel
			if err := tx.Where(MonthlyRecordModel{Month: month}).
				Attrs(MonthlyRecordModel{TTarget: defaultMonthlyTTarget}).
				FirstOrCreate(&monthlyModel).Error; err != nil {
				return fmt.Errorf("find or create monthly record: %w", err)
			}
			if err := tx.Model(&monthlyModel).Update("t_revenue", log.MonthlyTRevenue).Error; err != nil {
				return fmt.Errorf("update monthly t_revenue: %w", err)
			}
		}

		return nil
	})
	if err != nil {
		return err
	}

	// 事务提交后同步文件（非事务，尽力而为）
	if repository.exporter != nil {
		var changedFiles []string
		if err := repository.exporter.ExportPositions(ctx); err != nil {
			return fmt.Errorf("sync positions.json: %w", err)
		}
		changedFiles = append(changedFiles, "data/stock/positions.json")

		// monthlyTRevenue 不为 0 时才可能改过 stock_monthly_records，才需要同步 monthly.json
		if log.MonthlyTRevenue != 0 {
			if err := repository.exporter.ExportMonthly(ctx); err != nil {
				return fmt.Errorf("sync monthly.json: %w", err)
			}
			changedFiles = append(changedFiles, "data/stock/monthly.json")
		}

		if repository.markdownWriter != nil {
			if err := repository.markdownWriter.AppendDailyLog(log); err != nil {
				return fmt.Errorf("append stock.md: %w", err)
			}
			changedFiles = append(changedFiles, "docs/summary/stock/stock.md")
		}
		// 只提交实际被修改的文件
		if repository.gitCommitter != nil {
			repository.gitCommitter.CommitAndPush(log.Date, "stock", changedFiles)
		}
	}
	return nil
}

// GetDailyLog 按日期查询当日收盘记录，不存在时返回 nil。
func (repository *GormRepository) GetDailyLog(ctx context.Context, date string) (*domain.DailyLog, error) {
	var model DailyLogModel
	err := repository.db.WithContext(ctx).
		Preload("Trades", func(db *gorm.DB) *gorm.DB { return db.Order("display_order ASC") }).
		Preload("TRecords", func(db *gorm.DB) *gorm.DB { return db.Order("display_order ASC") }).
		Preload("Positions").
		Where("date = ?", date).
		First(&model).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, fmt.Errorf("get daily log %s: %w", date, err)
	}

	trades := make([]domain.Trade, 0, len(model.Trades))
	for _, t := range model.Trades {
		trades = append(trades, domain.Trade{
			Action: t.Action, Stock: t.Stock, Code: t.Code, Price: t.Price, Shares: t.Shares,
		})
	}
	tRecords := make([]domain.TRecord, 0, len(model.TRecords))
	for _, r := range model.TRecords {
		tRecords = append(tRecords, domain.TRecord{
			Stock: r.Stock, Desc: r.Description,
			GrossProfit: r.GrossProfit, Fee: r.Fee, Tax: r.Tax, NetRevenue: r.NetRevenue,
		})
	}
	positions := make([]domain.PositionSnapshot, 0, len(model.Positions))
	for _, p := range model.Positions {
		positions = append(positions, domain.PositionSnapshot{Stock: p.Stock, Code: p.Code, Cost: p.Cost, Shares: p.Shares, Price: p.Price})
	}
	return &domain.DailyLog{
		Date:            model.Date,
		Marker:          model.Marker,
		Positions:       positions,
		Trades:          trades,
		TRecords:        tRecords,
		MonthlyTRevenue: model.MonthlyTRevenue,
		Review: domain.DailyReview{
			Market:   model.ReviewMarket,
			Feeling:  model.ReviewFeeling,
			NextPlan: model.ReviewNextPlan,
		},
	}, nil
}

// ImportDailyLogs 批量导入历史记录，不触发文件同步，幂等（重复导入安全）。
func (repository *GormRepository) ImportDailyLogs(ctx context.Context, logs []domain.DailyLog) error {
	return repository.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		for _, log := range logs {
			model := DailyLogModel{
				Date:            log.Date,
				Marker:          log.Marker,
				ReviewMarket:    log.Review.Market,
				ReviewFeeling:   log.Review.Feeling,
				ReviewNextPlan:  log.Review.NextPlan,
				MonthlyTRevenue: log.MonthlyTRevenue,
			}
			if err := tx.Where(DailyLogModel{Date: log.Date}).
				Assign(DailyLogModel{Marker: log.Marker, ReviewMarket: log.Review.Market,
					ReviewFeeling: log.Review.Feeling, ReviewNextPlan: log.Review.NextPlan,
					MonthlyTRevenue: log.MonthlyTRevenue}).
				FirstOrCreate(&model).Error; err != nil {
				return fmt.Errorf("upsert daily log %s: %w", log.Date, err)
			}

			if err := tx.Where("daily_log_id = ?", model.ID).Delete(&TradeModel{}).Error; err != nil {
				return fmt.Errorf("clear trades %s: %w", log.Date, err)
			}
			if err := tx.Where("daily_log_id = ?", model.ID).Delete(&TRecordModel{}).Error; err != nil {
				return fmt.Errorf("clear t_records %s: %w", log.Date, err)
			}
			if err := tx.Where("daily_log_id = ?", model.ID).Delete(&DailyLogPositionModel{}).Error; err != nil {
				return fmt.Errorf("clear positions %s: %w", log.Date, err)
			}

			for i, t := range log.Trades {
				if err := tx.Create(&TradeModel{DailyLogID: model.ID, Action: t.Action, Stock: t.Stock, Code: t.Code, Price: t.Price, Shares: t.Shares, DisplayOrder: i}).Error; err != nil {
					return fmt.Errorf("insert trade %s: %w", log.Date, err)
				}
			}
			for i, r := range log.TRecords {
				if err := tx.Create(&TRecordModel{DailyLogID: model.ID, Stock: r.Stock, Description: r.Desc, GrossProfit: r.GrossProfit, Fee: r.Fee, Tax: r.Tax, NetRevenue: r.NetRevenue, DisplayOrder: i}).Error; err != nil {
					return fmt.Errorf("insert t_record %s: %w", log.Date, err)
				}
			}
			for _, p := range log.Positions {
				if err := tx.Create(&DailyLogPositionModel{DailyLogID: model.ID, Stock: p.Stock, Code: p.Code, Cost: p.Cost, Shares: p.Shares, Price: p.Price}).Error; err != nil {
					return fmt.Errorf("insert position %s: %w", log.Date, err)
				}
			}
		}
		return nil
	})
}
