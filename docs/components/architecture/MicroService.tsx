/**
 * title: 微服务架构
 * description: 微服务间通信与基础设施层
 */
import React from 'react';
import { Mermaid } from 'interview';

export default () => (
  <Mermaid
    chart={`
graph LR
    Client[客户端] --> GW[API Gateway]

    subgraph 业务服务
        GW --> US[用户服务]
        GW --> OS[订单服务]
        GW --> PS[商品服务]
        GW --> NS[通知服务]
    end

    subgraph 基础设施
        MQ[消息队列 Kafka]
        REG[服务注册 Nacos]
        CFG[配置中心]
        LOG[日志收集 ELK]
    end

    US --> MQ
    OS --> MQ
    MQ --> NS
    US --> REG
    OS --> REG
    PS --> REG

    subgraph 数据层
        DB1[(用户DB)]
        DB2[(订单DB)]
        DB3[(商品DB)]
        CACHE[(Redis 缓存)]
    end

    US --> DB1
    OS --> DB2
    PS --> DB3
    PS --> CACHE

    style Client fill:#e1f5fe
    style GW fill:#fff3e0
    style MQ fill:#e8f5e9
    style CACHE fill:#fce4ec
`}
  />
);
