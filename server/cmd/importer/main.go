package main

import (
	"context"
	"flag"
	"log/slog"
	"os"

	"github.com/Lkk-Web/interview/server/internal/config"
	"github.com/Lkk-Web/interview/server/internal/shared/database"
	"github.com/Lkk-Web/interview/server/internal/stock/application"
	"github.com/Lkk-Web/interview/server/internal/stock/infrastructure"
)

func main() {
	dataDir := flag.String("data-dir", "../data/stock", "path to the frontend stock JSON directory")
	flag.Parse()

	// nil 表示不传自定义 HandlerOptions，slog 会使用默认日志配置。

	logger := slog.New(slog.NewTextHandler(os.Stdout, nil))
	slog.SetDefault(logger)

	cfg, err := config.Load()
	if err != nil {
		slog.Error("load config failed", "error", err)
		os.Exit(1)
	}

	ctx := context.Background()
	db, err := database.Open(ctx, cfg)
	if err != nil {
		slog.Error("open database failed", "error", err)
		os.Exit(1)
	}
	defer func() { _ = database.Close(db) }()

	if err := database.RunMigrations(db, cfg.MigrationsDir); err != nil {
		slog.Error("run migrations failed", "error", err)
		os.Exit(1)
	}

	loader := infrastructure.NewJSONSnapshotLoader(*dataDir)
	snapshot, err := loader.Load()
	if err != nil {
		slog.Error("load stock json failed", "error", err)
		os.Exit(1)
	}

	repository := infrastructure.NewGormRepository(db)
	service := application.NewImportService(repository)
	if err := service.ImportSnapshot(ctx, snapshot); err != nil {
		slog.Error("import stock json failed", "error", err)
		os.Exit(1)
	}

	slog.Info("stock json imported",
		"assetHistories", len(snapshot.AssetHistories),
		"monthlyRecords", len(snapshot.MonthlyRecords),
		"otherIncomes", len(snapshot.OtherIncomes),
		"positions", len(snapshot.Positions),
	)
}
