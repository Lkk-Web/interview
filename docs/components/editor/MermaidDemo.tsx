/**
 * title: Mermaid 架构图
 * description: 支持实时编辑，修改左侧代码右侧即时渲染
 */
import React from 'react';
import { Mermaid } from 'interview';

export default () => (
  <Mermaid
    editable
    cacheKey="demo-mermaid"
    chart={`graph TD
    A[用户] --> B[API Gateway]
    B --> C[用户服务]
    B --> D[订单服务]
    B --> E[支付服务]
    C --> F[(MySQL)]
    D --> G[(Redis)]
    E --> H[第三方支付]`}
  />
);
