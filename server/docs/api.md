# API 说明

服务默认监听：

```text
http://localhost:8888
```

## 健康检查

```text
GET /api/health
```

响应：

```json
{
  "ok": true
}
```

## Stock API

### 获取仪表盘聚合数据

```text
GET /api/stock/dashboard
```

响应结构：

```json
{
  "assetHistory": [],
  "positions": [],
  "monthly": [],
  "otherIncome": []
}
```

这个接口是前端替换 JSON 的首选接口，因为它一次返回 `StockDashboard` 需要的全部数据。

### 获取资产曲线

```text
GET /api/stock/asset-history
```

### 获取月度 T 收益

```text
GET /api/stock/monthly
```

### 获取其他收入/支出

```text
GET /api/stock/other-income
```

### 获取持仓

```text
GET /api/stock/positions
```

## Mermaid API

### 获取 Mermaid 列表

```text
GET /api/mermaid/diagrams
```

可按分类过滤：

```text
GET /api/mermaid/diagrams?category=architecture
```

列表接口不返回完整 `chart`，避免数据过重。

### 获取单个 Mermaid 图

```text
GET /api/mermaid/diagrams/:slug
```

响应会包含：

- `slug`
- `title`
- `chart`
- `theme`
- `zoomable`
- `editable`
- `cacheKey`

前端拿到 `chart` 后继续用现有 Mermaid 组件渲染。

### 获取 Mermaid 历史版本

```text
GET /api/mermaid/diagrams/:slug/versions
```

当前预留接口，等后续实现服务端保存时使用。

## Admin API

```text
GET /api/admin/health
```

请求头：

```text
Authorization: Bearer <ADMIN_TOKEN>
```

如果 token 错误会返回 401。
