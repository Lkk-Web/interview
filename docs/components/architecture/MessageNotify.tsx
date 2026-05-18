/**
 * title: 消息通知时序图
 * description: 工单创建后的 App 推送与 PC 推送并行流程
 */
import React from 'react';
import { Mermaid } from 'interview';

const chart = `
sequenceDiagram
    participant AssistantPC as Assistant PC
    participant PC as workbench PC
    participant WB as workbench 后端
    participant Sale as sale
    participant Infra as cassec-message
    participant Assistant as 开思助手App后端
    participant App as 开思助手App

    Note over Sale: 业务触发工单创建
    Sale->>Sale: createTicket() 写库

    par App推送
        Sale->>Infra: POST /message-service/messages platform APP
        Infra-->>Assistant: 极光推送通知
        Assistant-->>App: 绑定App
        App->>Sale: 点击通知查看工单
    and PC推送 经workbench
        Sale->>WB: POST /internal/ticket-notify ticketId dealUserId content
        WB-->>PC: WebSocket推送工单通知
        PC-->>AssistantPC: 开思助手通知
        AssistantPC->>Sale: 点击通知查看工单
    end
`;

export default () => <Mermaid chart={chart} />;
