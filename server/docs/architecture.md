# DDD 架构说明

当前后端采用“DDD 分层单体”。它不是一开始就做微服务，而是先把业务边界拆清楚。

## 为什么不把代码都写在 main.go

如果所有逻辑都放在 `main.go`：

- HTTP、SQL、业务计算混在一起。
- 后续换数据库会影响很多文件。
- 新增 Mermaid 管理时容易和 stock 逻辑互相污染。
- 测试业务逻辑会很困难。

所以现在把代码拆成四层。

## 四层职责

```text
domain
  放业务实体、业务错误、Repository 接口。

application
  放业务用例编排。

infrastructure
  放数据库、文件、第三方 API 等技术实现。

interfaces/http
  放 HTTP DTO、Gin handler、routes。
```

## stock 调用链

```text
GET /api/stock/dashboard
  -> stock/interfaces/http.Handler.GetDashboard
  -> stock/application.DashboardService.GetDashboard
  -> stock/domain.Repository
  -> stock/infrastructure.GormRepository
  -> PostgreSQL
```

## Repository 接口的意义

`domain.Repository` 描述业务需要什么能力，例如：

```go
type Repository interface {
    ListAssetHistories(ctx context.Context) ([]AssetHistory, error)
    ListActivePositions(ctx context.Context) ([]Position, error)
}
```

它不关心数据来自 PostgreSQL、JSON 文件还是远程服务。

这样做的意义：

- application 层只依赖接口，不依赖 GORM。
- 测试时可以传一个 fake repository。
- 未来把 PostgreSQL 换成别的数据库，业务代码不用大改。

## DTO 的意义

DTO 是 HTTP 层的数据结构，例如：

- 数据库字段：`stock_value`
- domain 字段：`StockValue`
- API JSON 字段：`stockValue`

三者命名规范不同，所以用 DTO 隔离。

如果直接把数据库 model 返回给前端，会导致前端和数据库强绑定，不利于后续调整。

## 微服务演进

当前服务还是一个进程：

```text
server api
  ├── stock module
  └── mermaid module
```

未来如果数据量或部署需要变化，可以演进成：

```text
api gateway
  ├── stock service
  └── mermaid service
```

因为现在 `stock` 和 `mermaid` 已经是独立业务域，拆分成本会低很多。
