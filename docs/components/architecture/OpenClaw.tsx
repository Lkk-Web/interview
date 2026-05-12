/**
 * title: OpenClaw 系统架构全景图
 * description: 支持缩放/拖拽/全屏查看。鼠标滚轮缩放，拖拽平移，移动端双指缩放。
 */
import React from 'react';
import { Mermaid } from 'interview';

export default () => (
  <Mermaid
    zoomable
    chart={`
graph TD
    %% 第5层：原生客户端
    subgraph L5[第5层 - 原生客户端]
        macOS[macOS App<br/>SwiftUI]
        Mobile[iOS/Android App]
        WebUI[Web UI<br/>Lit + Vite]
    end

    %% 第4层：扩展插件
    subgraph L4[第4层 - 扩展插件]
        CP[渠道插件<br/>Telegram/Discord<br/>Slack/WhatsApp]
        PP[提供商插件<br/>OpenAI/Anthropic<br/>Google/Ollama]
        FP[功能插件<br/>memory-core<br/>voice-call]
    end

    %% 第3层：功能模块
    subgraph L3[第3层 - 功能模块]
        MEM[Memory<br/>向量存储/混合搜索]
        CTX[Context Engine<br/>上下文压缩]
        HOOKS[Hooks]
        SANDBOX[Sandbox]
        SUB[Subagents]
        SKILLS[Skills]
        MEDIA[Media Pipeline]
        TTS[TTS & Voice]
        WEB[Web Search]
        CRON[Cron]
    end

    %% 第2层：核心业务逻辑
    subgraph L2[第2层 - 核心业务逻辑]
        CH[Channels System]
        GW[Gateway Server]
        RT[Routing<br/>7级优先级]
        AR[Auto Reply]
        AGENT[Agent Runtime]
        PS[Plugin System]
    end

    %% 第1层：基础设施
    subgraph L1[第1层 - 基础设施]
        CFG[Config System]
        SEC[Secrets & Auth]
        SDK[Plugin SDK]
        LOG[Logging & Terminal]
        INFRA[Infra Utils]
    end

    %% 连接：客户端 → 核心
    macOS -->|WebSocket| GW
    Mobile -->|WebSocket| GW
    WebUI -->|WebSocket| GW

    %% 连接：插件 → 核心
    CP -->|plugin-sdk| PS
    PP -->|plugin-sdk| PS
    FP -->|plugin-sdk| PS

    %% 核心链路
    CH --> GW
    GW --> RT
    RT --> AR
    AR --> AGENT
    AGENT --> PS

    %% 功能模块 → Agent
    CTX --> AGENT
    MEM --> CTX
    HOOKS --> AGENT
    SANDBOX --> AGENT
    SUB --> AGENT
    SKILLS --> AGENT
    MEDIA --> AGENT
    TTS --> AGENT
    WEB --> AGENT
    CRON --> AGENT

    %% 基础设施
    CFG --> SEC
    SEC --> INFRA
    SDK --> INFRA
    LOG --> INFRA
    PS --> SDK
    AGENT --> SDK

    %% 样式
    style L5 fill:#e1f5fe,stroke:#0288d1
    style L4 fill:#e8f5e9,stroke:#388e3c
    style L3 fill:#fff3e0,stroke:#f57c00
    style L2 fill:#fce4ec,stroke:#c62828
    style L1 fill:#f3e5f5,stroke:#7b1fa2
`}
  />
);
