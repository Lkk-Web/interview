/**
 * title: 前端工程化架构
 * description: 前端项目的工程化体系与 CI/CD 流程
 */
import React from 'react';
import { Mermaid } from 'interview';

export default () => (
  <Mermaid
    chart={`
graph TD
    DEV[开发者] --> |git push| GIT[Git 仓库]
    GIT --> |webhook| CI[CI/CD Pipeline]

    subgraph 构建流程
        CI --> LINT[ESLint + Prettier]
        LINT --> TEST[单元测试 Jest]
        TEST --> BUILD[构建 Webpack/Vite]
        BUILD --> ARTIFACT[产物 dist/]
    end

    subgraph 部署
        ARTIFACT --> CDN[CDN 分发]
        ARTIFACT --> DOCKER[Docker 镜像]
        DOCKER --> K8S[K8s 集群]
    end

    subgraph 监控
        CDN --> MONITOR[性能监控]
        K8S --> MONITOR
        MONITOR --> ALERT[告警通知]
        MONITOR --> LOG[日志平台]
    end

    style DEV fill:#e1f5fe
    style CI fill:#fff3e0
    style CDN fill:#e8f5e9
    style MONITOR fill:#fce4ec
`}
  />
);
