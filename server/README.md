# Interview Server 技术架构

`server` 是本项目的 Go 后端服务，用于把前端静态 JSON 和 Mermaid 图源码逐步迁移到 PostgreSQL。当前阶段先实现读接口和 JSON 导入能力，后续再接管理后台、写接口和 Mermaid 服务端保存。

## 技术选型

| 类型 | 选型 | 设计意义 |
| --- | --- | --- |
| Web 框架 | Gin | Go 生态认可度高、资料多、适合初学者快速理解 HTTP handler/router/middleware。 |
| ORM | GORM | 可读性强，适合先把业务跑通；通过 Repository 接口隔离，未来可替换 sqlc 或原生 SQL。 |
| 数据库 | PostgreSQL | 更贴近生产和微服务场景，支持更好的并发、约束、索引和远程部署。 |
| 配置 | `.env` + 环境变量 | 数据库密码、管理 token 不写进代码，符合安全要求。 |
| 日志 | `log/slog` | Go 标准库结构化日志，减少第三方依赖。 |
| 架构 | DDD 分层单体 | 当前保持一个服务，先模块化；未来可以按 `stock`、`mermaid` 拆微服务。 |

## 目录结构

```text
server/
  cmd/
    api/                # API 服务入口，只负责启动服务
    importer/           # JSON 导入命令，把 data/stock/*.json 写入 PostgreSQL
  internal/
    bootstrap/          # 组装配置、数据库、路由、业务服务
    config/             # 统一读取环境变量
    shared/             # 跨业务域的通用能力：数据库、响应、middleware
    stock/              # 股票资产业务域
      domain/           # 领域实体和 repository 接口
      application/      # 用例编排：仪表盘查询、JSON 导入
      infrastructure/   # GORM/PostgreSQL、JSON loader 等技术实现
      interfaces/http/  # Gin handler、DTO、route
    mermaid/            # Mermaid 图表业务域，结构同 stock
  migrations/           # PostgreSQL 表结构变更 SQL
  docs/                 # 后端文档
```

## 分层调用链

以 `GET /api/stock/dashboard` 为例：

```text
HTTP 请求
  ↓
interfaces/http.Handler
  ↓
application.DashboardService
  ↓
domain.Repository 接口
  ↓
infrastructure.GormRepository
  ↓
PostgreSQL
```

这样设计的好处：

1. Handler 不写 SQL，只处理 HTTP。
2. Application 不依赖 Gin/GORM，只编排业务用例。
3. Domain 不知道数据库和 HTTP，保持业务模型稳定。
4. Infrastructure 负责技术细节，换数据库时影响范围更小。

## 微服务演进思路

当前是模块化单体，部署和调试更简单；但边界按微服务预留：

- `stock` 和 `mermaid` 没有互相 import。
- 两个业务域都有自己的 `domain/application/infrastructure/interfaces`。
- 路由按 `/api/stock/*` 和 `/api/mermaid/*` 分组。
- 如果以后拆服务，可以把某个业务域整体迁出。

## 快速启动

```bash
cd /Users/liukangkai/Desktop/github/interview/server
GOTOOLCHAIN=local GOPROXY=https://goproxy.cn,direct GOSUMDB=sum.golang.google.cn go run ./cmd/api
```

导入股票 JSON：

```bash
cd /Users/liukangkai/Desktop/github/interview/server
GOTOOLCHAIN=local GOPROXY=https://goproxy.cn,direct GOSUMDB=sum.golang.google.cn go run ./cmd/importer -data-dir ../data/stock
```

更多文档见：

- [启动与本地开发](docs/start.md)
- [DDD 架构说明](docs/architecture.md)
- [数据库设计](docs/database.md)
- [API 说明](docs/api.md)
