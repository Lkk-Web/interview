/**
 * title: 前端工程化架构
 * description: 前端项目的工程化体系与 CI/CD 流程
 */
import React from 'react';
import { Mermaid } from 'interview';

const chart = `
sequenceDiagram
    participant U as 用户
    participant Sale as Sale 本工程
    participant Infra as Infra 基建平台
    participant Assistant as Assistant App后端
    participant Workbench as Workbench PC后端

    U->>Sale: 触发工单创建
    Sale->>Sale: createTicket() 写库
    Sale->>Infra: POST /message-service/messages
    Infra->>Infra: splitMessage() 按 platform 拆分
    Infra->>Assistant: APP IM_SYSTEM 融云系统消息+极光推送
    Infra->>Workbench: DESKTOP/WEB WS socket.io Redis广播
    Assistant-->>U: App 收到通知
    Workbench-->>U: PC 收到通知
`;

export default () => <Mermaid chart={chart} />;
