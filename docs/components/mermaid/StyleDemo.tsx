/**
 * title: 样式技巧 — 监控告警
 * description: 结合 classDef 批量样式与子图
 */
import React from 'react';
import { Mermaid } from 'interview';

const chart = `
flowchart LR
    subgraph 监控告警
        A[(数据采集)] --> B{阈值判断}
        B -->|正常| C[正常]
        B -->|超阈值| D[警告]
        D --> E{持续超阈值?}
        E -->|是| F[错误/告警]
        E -->|否| C
    end
    classDef ok fill:#52c41a,color:#fff
    classDef warn fill:#ffcc00,color:#000
    classDef err fill:#ff4444,color:#fff
    class C ok
    class D warn
    class F err
`;

export default () => <Mermaid chart={chart} />;
