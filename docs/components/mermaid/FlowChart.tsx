/**
 * title: 流程图 — CI/CD 流程
 * description: 结合子图、多种节点形状、标签与样式
 */
import React from 'react';
import { Mermaid } from 'interview';

const chart = `
flowchart TD
    subgraph 开发
        A([提交代码]) --> B[代码审查]
        B -->|通过| C[合并主干]
        B -->|拒绝| A
    end
    subgraph 构建
        C --> D[单元测试]
        D -->|失败| E>通知开发者]
        D -->|通过| F[打包构建]
    end
    subgraph 部署
        F --> G[(制品仓库)]
        G --> H{环境选择}
        H -->|测试| I[测试环境]
        H -->|生产| J[生产环境]
    end
    style E fill:#ff4444,color:#fff
    style J fill:#52c41a,color:#fff
`;

export default () => <Mermaid chart={chart} />;
