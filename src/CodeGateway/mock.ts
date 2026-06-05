import type { CodeSource } from './types';

export const mockCodeSourceMap: Record<string, CodeSource> = {
  'summary-editor:demo-mermaid': {
    pageKey: 'summary-editor',
    codeKey: 'demo-mermaid',
    lang: 'mermaid',
    cacheKey: 'demo-mermaid',
    editable: true,
    code: `graph TD
    A[用户] --> B[API Gateway]
    B --> C[用户服务]
    B --> D[订单服务]
    B --> E[支付服务]
    C --> F[(MySQL)]
    D --> G[(Redis)]
    E --> H[第三方支付]`,
  },
  'summary-editor:demo-markdown': {
    pageKey: 'summary-editor',
    codeKey: 'demo-markdown',
    lang: 'markdown',
    cacheKey: 'demo-markdown',
    defaultOpen: true,
    code: `# 系统设计笔记

## 核心概念

**CAP 定理**：分布式系统中，一致性、可用性、分区容错性三者最多同时满足两个。

## 常见架构模式

- **微服务**：服务拆分，独立部署
- **事件驱动**：通过消息队列解耦
- **CQRS**：读写分离

## 代码示例

\`\`\`js
const handler = async (event) => {
  const result = await process(event);
  return result;
};
\`\`\``,
  },
  'summary-editor:demo-html': {
    pageKey: 'summary-editor',
    codeKey: 'demo-html',
    lang: 'html',
    cacheKey: 'demo-html',
    defaultOpen: true,
    code: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; padding: 16px; }
    .card {
      border: 1px solid #e8e8e8;
      border-radius: 8px;
      padding: 16px;
      max-width: 300px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    h2 { color: #1890ff; margin: 0 0 8px; }
    p { color: #666; margin: 0; }
  </style>
</head>
<body>
  <div class="card">
    <h2>Hello World</h2>
    <p>这是一个 HTML 实时预览示例</p>
  </div>
</body>
</html>`,
  },
  'summary-editor:demo-json': {
    pageKey: 'summary-editor',
    codeKey: 'demo-json',
    lang: 'json',
    cacheKey: 'demo-json',
    defaultOpen: true,
    code: `{
  "name": "interview",
  "version": "1.0.0",
  "portfolio": {
    "allocation": [
      { "name": "低估股", "ratio": 50 },
      { "name": "周期股", "ratio": 30 },
      { "name": "科技股", "ratio": 20 }
    ]
  },
  "principles": [
    "不满仓操作",
    "操作前先想好退出策略"
  ]
}`,
  },
};
