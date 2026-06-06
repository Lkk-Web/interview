# 数据库设计

数据库使用 PostgreSQL。表结构由 `server/migrations/*.sql` 管理。

## 为什么用 migrations

migrations 的意义是让数据库结构可追踪、可重复执行：

- 新环境启动时自动建表。
- 每次结构变更都有 SQL 文件记录。
- 避免手动在数据库里改表，导致本地和线上不一致。

## stock 表

### stock_asset_histories

保存每日资产快照，替代 `data/stock/asset-history.json`。

关键字段：

- `date`：业务唯一日期。
- `cash`：现金。
- `stock_value`：股票市值。
- `loan`：负债，当前用负数表示。
- `other`：其他资产变化。
- `remark`：备注。

### stock_monthly_records

保存月度 T 收益目标和实际收益，替代 `monthly.json`。

关键字段：

- `month`：YYYY-MM，唯一。
- `t_target`：月目标。
- `t_revenue`：月收益。

### stock_other_incomes

保存其他收入/支出，替代 `other-income.json`。

关键字段：

- `date`：日期。
- `amount`：金额，正数收入，负数支出。
- `description`：说明，对应前端旧字段 `desc`。

### stock_positions

保存持仓主体，替代 `positions.json` 的顶层字段。

关键字段：

- `stock`：股票名称。
- `code`：股票代码，唯一，例如 `sz000516`。
- `cost`：当前成本。
- `shares`：当前股数。
- `active`：是否当前有效。
- `display_order`：展示顺序。

### stock_position_bases

保存持仓底仓信息，对应 `positions.json` 的 `base`。

### stock_position_targets

保存持仓目标计划，对应 `positions.json` 的 `target` 数组。

## Mermaid 表

### mermaid_diagrams

保存 Mermaid 图源码和展示配置。

关键字段：

- `slug`：前端请求用的稳定 ID。
- `title`：标题。
- `description`：说明。
- `category`：分类。
- `chart`：Mermaid DSL 源码。
- `diagram_type`：图类型。
- `theme`：主题。
- `zoomable`：是否支持缩放。
- `editable`：是否支持编辑。
- `cache_key`：兼容前端 localStorage 草稿 key。

## 为什么存 Mermaid 源码而不是 SVG

源码更适合：

- 编辑。
- 搜索。
- 版本管理。
- 用不同 Mermaid 版本重新渲染。

SVG 是渲染结果，可以以后作为缓存字段添加，但不应该成为第一数据源。

### mermaid_diagram_versions

保存 Mermaid 图历史版本。

以后前端加“保存到服务端”后，每次保存都可以插入一个版本，便于回滚。
