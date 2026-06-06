# Server Docs

这里放 Go 后端服务文档。README 负责技术架构总览，这里放更细的开发说明。

## 文档列表

- [启动与本地开发](start.md)
- [DDD 架构说明](architecture.md)
- [数据库设计](database.md)
- [API 说明](api.md)

## 当前状态

- 已支持 PostgreSQL 连接。
- 已支持启动时自动执行 migrations。
- 已支持把 `../data/stock/*.json` 导入数据库。
- 已支持 stock 读接口。
- 已支持 Mermaid 列表、详情、版本读接口。
