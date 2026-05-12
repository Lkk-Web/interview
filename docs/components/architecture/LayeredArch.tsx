/**
 * title: 前后端分层架构
 * description: 经典的前后端分层架构设计，展示各层职责与数据流向
 */
import React from 'react';
import { Mermaid } from 'interview';

export default () => (
  <Mermaid
    chart={`
graph TD
    A[客户端 Browser/App] --> B[CDN / Nginx]
    B --> C[前端应用 React/Vue]
    B --> D[API Gateway 网关层]
    D --> E[BFF 层 Node.js]
    D --> F[业务服务层]
    F --> G[用户服务]
    F --> H[订单服务]
    F --> I[支付服务]
    G --> J[(MySQL)]
    H --> K[(Redis)]
    H --> J
    I --> L[第三方支付 API]

    style A fill:#e1f5fe
    style C fill:#e8f5e9
    style D fill:#fff3e0
    style F fill:#fce4ec
    style J fill:#f3e5f5
    style K fill:#f3e5f5
`}
  />
);
