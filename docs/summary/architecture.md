---
order: 5
toc: menu
---

# 架构设计

记录个人对系统架构的理解与设计。

---

## Intelligent Sale 架构

```tsx
import React from 'react';
import { CodeGateway } from 'interview';

export default () => <CodeGateway pageKey="architecture" codeKey="intelligent-sale" />;
```

## Copilot System 架构

```tsx
import React from 'react';
import { CodeGateway } from 'interview';

export default () => <CodeGateway pageKey="architecture" codeKey="copilot-system" />;
```

## Copilot Memory 架构

```tsx
import React from 'react';
import { CodeGateway } from 'interview';

export default () => <CodeGateway pageKey="architecture" codeKey="copilot-memory" />;
```

## Copilot Purchase Context

```tsx
import React from 'react';
import { CodeGateway } from 'interview';

export default () => <CodeGateway pageKey="architecture" codeKey="copilot-purchase-context" />;
```

## 前端跨页面 websocket 方案

```tsx
import React from 'react';
import { CodeGateway } from 'interview';

export default () => <CodeGateway pageKey="architecture" codeKey="frontend-arch" />;
```

## 消息通知时序图

```tsx
import React from 'react';
import { CodeGateway } from 'interview';

export default () => <CodeGateway pageKey="architecture" codeKey="message-notify" />;
```

---

## OpenClaw 架构

> OpenClaw 是一个 AI Agent 平台，采用 5 层分层架构设计，支持多渠道接入、多模型提供商、插件化扩展。

### 系统全景图

```tsx
import React from 'react';
import { CodeGateway } from 'interview';

export default () => <CodeGateway pageKey="architecture" codeKey="open-claw" />;
```

### 消息处理流程

```tsx
import React from 'react';
import { CodeGateway } from 'interview';

export default () => <CodeGateway pageKey="architecture" codeKey="open-claw-flow" />;
```

### 核心概念

| 概念               | 说明                                            |
| ------------------ | ----------------------------------------------- |
| **Gateway**        | 系统核心进程，管理所有渠道和 Agent              |
| **Channel**        | 消息平台接入点（Telegram/Discord 等）           |
| **Agent**          | 处理消息的 AI 实体，有独立配置和会话            |
| **Routing**        | 7 级优先级路由，将 channel+account 映射到 Agent |
| **Session Key**    | 标识对话上下文的唯一字符串                      |
| **Provider**       | AI 模型提供商（OpenAI/Anthropic 等）            |
| **Plugin SDK**     | 插件与核心通信的接口层                          |
| **Hook**           | Agent 生命周期关键节点注入自定义逻辑            |
| **Sandbox**        | 隔离 Agent 工具执行的容器环境                   |
| **Context Engine** | 管理 LLM 上下文窗口，自动压缩                   |
