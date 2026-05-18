/**
 * title: 微服务架构
 * description: 微服务间通信与基础设施层
 */
import React from 'react';
import { Mermaid } from 'interview';

const chart = `
graph LR
    Client --> GW

    subgraph BIZ
        US
        OS
        PS
        NS
    end

    subgraph INFRA
        MQ
        REG
        CFG
        LOG
    end

    subgraph DATA
        DB1
        DB2
        DB3
        CACHE
    end

    GW --> US
    GW --> OS
    GW --> PS
    GW --> NS

    US --> MQ
    OS --> MQ
    MQ --> NS
    US --> REG
    OS --> REG
    PS --> REG

    US --> DB1
    OS --> DB2
    PS --> DB3
    PS --> CACHE

    style Client fill:#e1f5fe
    style GW fill:#fff3e0
    style MQ fill:#e8f5e9
    style CACHE fill:#fce4ec
`;

export default () => <Mermaid chart={chart} />;
