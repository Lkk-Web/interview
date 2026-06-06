package database

import (
	"fmt"
	"log/slog"
	"os"
	"path/filepath"
	"sort"
	"strings"

	"gorm.io/gorm"
)

func RunMigrations(db *gorm.DB, migrationsDir string) error {
	if err := db.Exec(`
CREATE TABLE IF NOT EXISTS schema_migrations (
  version TEXT PRIMARY KEY,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`).Error; err != nil {
		return fmt.Errorf("ensure schema_migrations: %w", err)
	}

	files, err := filepath.Glob(filepath.Join(migrationsDir, "*.sql"))
	if err != nil {
		return fmt.Errorf("find migration files: %w", err)
	}
	sort.Strings(files)

	for _, file := range files {
		version := filepath.Base(file)
		applied, err := migrationApplied(db, version)
		if err != nil {
			return err
		}
		if applied {
			continue
		}

		sqlBytes, err := os.ReadFile(file)
		if err != nil {
			return fmt.Errorf("read migration %s: %w", version, err)
		}

		if err := db.Transaction(func(tx *gorm.DB) error {
			// 每个 SQL 文件是一组原子变更；拆成单条执行是为了兼容 PostgreSQL 驱动的 prepared statement 限制。
			for _, statement := range splitStatements(string(sqlBytes)) {
				if err := tx.Exec(statement).Error; err != nil {
					return fmt.Errorf("execute migration %s: %w", version, err)
				}
			}
			return tx.Exec("INSERT INTO schema_migrations(version) VALUES (?)", version).Error
		}); err != nil {
			return err
		}

		slog.Info("migration applied", "version", version)
	}

	return nil
}

func migrationApplied(db *gorm.DB, version string) (bool, error) {
	var count int64
	if err := db.Raw("SELECT COUNT(1) FROM schema_migrations WHERE version = ?", version).Scan(&count).Error; err != nil {
		return false, fmt.Errorf("check migration %s: %w", version, err)
	}
	return count > 0, nil
}

func splitStatements(sql string) []string {
	parts := strings.Split(sql, ";")
	statements := make([]string, 0, len(parts))
	for _, part := range parts {
		statement := strings.TrimSpace(part)
		if statement != "" {
			statements = append(statements, statement)
		}
	}
	return statements
}
