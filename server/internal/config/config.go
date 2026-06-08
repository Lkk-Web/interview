package config

import (
	"errors"
	"os"
	"strings"

	"github.com/joho/godotenv"
)

// Config 是服务启动需要的配置集合。
// 它是唯一知道环境变量名字的地方，业务代码只接收 Config，不直接读取 os.Getenv。
type Config struct {
	// AppEnv 控制运行环境，例如 development/production。
	AppEnv string
	// HTTPAddr 是 Gin HTTP 服务监听地址，例如 :8080。
	HTTPAddr string
	// DatabaseDSN 是 PostgreSQL 连接串，包含密码，必须来自 .env 或部署环境变量。
	DatabaseDSN string
	// AdminToken 用于保护 /api/admin/* 管理接口。
	AdminToken string
	// AllowedOrigins 是允许跨域访问 API 的前端地址列表。
	AllowedOrigins []string
	// MigrationsDir 是 SQL migration 文件目录。
	MigrationsDir string
	// DataDir 是本地 stock JSON 文件目录，写接口成功后会同步更新这里的文件。
	DataDir string
}

// Load 读取配置并做最基本的必填校验。
func Load() (Config, error) {
	// 开发环境用 .env 更方便；线上通常由 Docker/K8s/平台注入环境变量。
	_ = godotenv.Load()

	cfg := Config{
		AppEnv:         valueOrDefault("APP_ENV", "development"),
		HTTPAddr:       valueOrDefault("HTTP_ADDR", ":8080"),
		DatabaseDSN:    os.Getenv("DATABASE_DSN"),
		AdminToken:     os.Getenv("ADMIN_TOKEN"),
		AllowedOrigins: splitCSV(valueOrDefault("ALLOWED_ORIGINS", "http://localhost:8000,http://localhost:8080")),
		MigrationsDir:  valueOrDefault("MIGRATIONS_DIR", "./migrations"),
		DataDir:        valueOrDefault("DATA_DIR", "../data/stock"),
	}

	if cfg.DatabaseDSN == "" {
		return Config{}, errors.New("DATABASE_DSN is required")
	}

	return cfg, nil
}

func valueOrDefault(key string, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}

func splitCSV(value string) []string {
	items := strings.Split(value, ",")
	result := make([]string, 0, len(items))
	for _, item := range items {
		trimmed := strings.TrimSpace(item)
		if trimmed != "" {
			result = append(result, trimmed)
		}
	}
	return result
}
