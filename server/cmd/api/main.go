package main

import (
	"context"
	"log/slog"
	"os"

	"github.com/Lkk-Web/interview/server/internal/bootstrap"
	"github.com/Lkk-Web/interview/server/internal/config"

	// docs 是 swag init 生成的包，导入它是为了把 swagger 文档注册进服务。
	// 如果这行报错，先执行：swag init -g cmd/api/main.go -o docs/swagger
	_ "github.com/Lkk-Web/interview/server/docs/swagger"
)

// @title          Interview Server API
// @version        1.0
// @description    个人知识库后端服务，提供股票仪表盘和代码内容管理接口。
// @host           localhost:8888
// @BasePath       /api
// @schemes        http https
func main() {
	// slog 是 Go 标准库的结构化日志；先统一设置默认 logger，后续所有包都能直接 slog.Info/Error。
	logger := slog.New(slog.NewTextHandler(os.Stdout, nil))
	slog.SetDefault(logger)

	// 配置统一从 internal/config 读取，入口文件不直接散落 os.Getenv。
	cfg, err := config.Load()
	if err != nil {
		slog.Error("load config failed", "error", err)
		os.Exit(1)
	}

	// bootstrap 负责组装数据库、路由、业务服务；main 保持很薄，便于测试和理解启动流程。
	app, err := bootstrap.New(context.Background(), cfg)
	if err != nil {
		slog.Error("bootstrap app failed", "error", err)
		os.Exit(1)
	}
	defer app.Close()

	slog.Info("api server started", "addr", cfg.HTTPAddr)
	if err := app.Router.Run(cfg.HTTPAddr); err != nil {
		slog.Error("api server stopped", "error", err)
		os.Exit(1)
	}
}
