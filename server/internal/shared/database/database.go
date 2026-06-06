package database

import (
	"context"
	"database/sql"
	"fmt"
	"log/slog"
	"time"

	"github.com/Lkk-Web/interview/server/internal/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// Open 创建 GORM 数据库连接。
// 这里属于 infrastructure/shared 层，因为数据库是技术细节，不应该出现在 domain/application 里。
func Open(ctx context.Context, cfg config.Config) (*gorm.DB, error) {
	db, err := gorm.Open(postgres.Open(cfg.DatabaseDSN), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("open postgres: %w", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("get sql db: %w", err)
	}

	// 连接池参数放在基础设施层，避免业务代码关心数据库连接细节。
	sqlDB.SetMaxOpenConns(20)
	sqlDB.SetMaxIdleConns(5)
	sqlDB.SetConnMaxLifetime(30 * time.Minute)

	// 启动时 ping 一次，能尽早发现密码、端口、数据库名配置错误。
	pingCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()
	if err := sqlDB.PingContext(pingCtx); err != nil {
		return nil, fmt.Errorf("ping postgres: %w", err)
	}

	slog.Info("postgres connected")
	return db, nil
}

// Close 关闭底层数据库连接池。
func Close(db *gorm.DB) error {
	if db == nil {
		return nil
	}
	sqlDB, err := db.DB()
	if err != nil {
		return err
	}
	return sqlDB.Close()
}

// SQLDB 暴露底层 *sql.DB，主要给需要直接使用 database/sql 的场景预留。
func SQLDB(db *gorm.DB) (*sql.DB, error) {
	return db.DB()
}
