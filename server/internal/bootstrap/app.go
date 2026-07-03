package bootstrap

import (
	"context"
	"net/http"

	csapp "github.com/Lkk-Web/interview/server/internal/codesource/application"
	csinfra "github.com/Lkk-Web/interview/server/internal/codesource/infrastructure"
	cshttp "github.com/Lkk-Web/interview/server/internal/codesource/interfaces/http"
	"github.com/Lkk-Web/interview/server/internal/config"
	"github.com/Lkk-Web/interview/server/internal/shared/database"
	"github.com/Lkk-Web/interview/server/internal/shared/httpx"
	"github.com/Lkk-Web/interview/server/internal/shared/middleware"
	stockapp "github.com/Lkk-Web/interview/server/internal/stock/application"
	stockinfra "github.com/Lkk-Web/interview/server/internal/stock/infrastructure"
	stockhttp "github.com/Lkk-Web/interview/server/internal/stock/interfaces/http"
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"gorm.io/gorm"
)

// App 保存服务运行期间需要被关闭的资源。
// 现在只有数据库连接，未来加消息队列、缓存连接也可以放在这里统一关闭。
type App struct {
	Router *gin.Engine
	db     *gorm.DB
}

// New 是应用的组装入口，也叫 composition root。
// DDD 项目里通常在这里把"接口"和"实现"接起来，业务包内部不需要知道具体用 Gin 还是 GORM。
func New(ctx context.Context, cfg config.Config) (*App, error) {
	if cfg.AppEnv == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	// 数据库连接属于基础设施能力，先建立连接，再把它注入到各个 repository。
	db, err := database.Open(ctx, cfg)
	if err != nil {
		return nil, err
	}

	// migration 放在启动阶段执行，能保证本地和部署环境的表结构自动对齐。
	if err := database.RunMigrations(db, cfg.MigrationsDir); err != nil {
		_ = database.Close(db)
		return nil, err
	}

	router := gin.New()
	router.Use(gin.Logger(), gin.Recovery(), middleware.CORS(cfg.AllowedOrigins))

	registerRoutes(router, db, cfg)

	return &App{Router: router, db: db}, nil
}

// Close 集中释放资源，让 main 只需要 defer app.Close()。
func (app *App) Close() {
	_ = database.Close(app.db)
}

func registerRoutes(router *gin.Engine, db *gorm.DB, cfg config.Config) {
	// Swagger UI 只在非生产环境开放，避免泄露接口信息。
	if cfg.AppEnv != "production" {
		router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	}

	api := router.Group("/api")
	api.GET("/health", func(c *gin.Context) {
		httpx.OK(c, gin.H{"ok": true})
	})

	// stock 领域的依赖链：PostgreSQL 实现 -> application service -> HTTP handler。
	// 这样 handler 不接触数据库，repository 不接触 HTTP，职责更清晰。
	stockRepository := stockinfra.NewGormRepository(db)
	// 注入 JSON 导出器：写接口成功后自动同步 data/stock/*.json 文件。
	stockRepository.SetExporter(stockinfra.NewJSONExporter(cfg.DataDir, stockRepository))
	// 注入 markdown 写入器：AddDailyLog 后追加 stock.md。
	stockRepository.SetMarkdownWriter(stockinfra.NewMarkdownWriter(cfg.StockMDPath))
	// 注入 git 自动提交器：文件同步后自动 commit + push。
	stockRepository.SetGitCommitter(stockinfra.NewGitCommitter(cfg.RepoDir, cfg.GitAutoCommit))
	stockService := stockapp.NewDashboardService(stockRepository)
	dailyLogService := stockapp.NewDailyLogService(stockRepository)
	// Alpha 曲线的历史收盘价改由前端直接请求腾讯接口（CORS 开放），不再经过后端代理。
	stockHandler := stockhttp.NewHandler(stockService, dailyLogService)
	stockhttp.RegisterRoutes(api.Group("/stock"), stockHandler)

	// 写接口挂在 /api/admin/stock，统一经过 admin token middleware。
	stockhttp.RegisterAdminRoutes(
		api.Group("/admin/stock", middleware.RequireAdminToken(cfg.AdminToken)),
		stockHandler,
	)

	// codesource 领域替代原来的 mermaid 域，支持所有语言类型。
	csRepository := csinfra.NewGormRepository(db)
	csService := csapp.NewService(csRepository)
	csHandler := cshttp.NewHandler(csService)
	cshttp.RegisterRoutes(api.Group("/code-sources"), csHandler)

	admin := api.Group("/admin", middleware.RequireAdminToken(cfg.AdminToken))
	admin.GET("/health", func(c *gin.Context) {
		// 管理端健康检查能顺便验证 ADMIN_TOKEN 是否配置正确。
		httpx.OK(c, gin.H{"ok": true, "scope": "admin"})
	})
	admin.GET("/not-implemented", func(c *gin.Context) {
		httpx.Error(c, http.StatusNotImplemented, "not_implemented", "admin write APIs will be added after read APIs are stable")
	})
}
