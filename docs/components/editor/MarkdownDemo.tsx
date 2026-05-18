/**
 * title: Markdown 编辑器
 * description: 实时预览 Markdown 渲染效果
 */
import React from 'react';
import { CodeEditor } from 'interview';

export default () => (
  <CodeEditor
    lang="markdown"
    cacheKey="demo-markdown"
    defaultOpen
    code={`# 系统设计笔记

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
\`\`\``}
  />
);
