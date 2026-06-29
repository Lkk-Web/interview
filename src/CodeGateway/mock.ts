import type { CodeSource } from './types';

export const mockCodeSourceMap: Record<string, CodeSource> = {
  'summary-editor:demo-mermaid': {
    pageKey: 'summary-editor',
    codeKey: 'demo-mermaid',
    lang: 'mermaid',
    cacheKey: 'demo-mermaid',
    code: `graph TD
    A[用户] --> B[API Gateway]
    B --> C[用户服务]
    B --> D[订单服务]
    B --> E[支付服务]
    C --> F[(MySQL)]
    D --> G[(Redis)]
    E --> H[第三方支付]`,
  },
  'summary-editor:demo-markdown': {
    pageKey: 'summary-editor',
    codeKey: 'demo-markdown',
    lang: 'markdown',
    cacheKey: 'demo-markdown',
    defaultOpen: true,
    code: `# 系统设计笔记

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
\`\`\``,
  },
  'summary-editor:demo-html': {
    pageKey: 'summary-editor',
    codeKey: 'demo-html',
    lang: 'html',
    cacheKey: 'demo-html',
    defaultOpen: true,
    code: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; padding: 16px; }
    .card {
      border: 1px solid #e8e8e8;
      border-radius: 8px;
      padding: 16px;
      max-width: 300px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    h2 { color: #1890ff; margin: 0 0 8px; }
    p { color: #666; margin: 0; }
  </style>
</head>
<body>
  <div class="card">
    <h2>Hello World</h2>
    <p>这是一个 HTML 实时预览示例</p>
  </div>
</body>
</html>`,
  },
  'summary-editor:demo-json': {
    pageKey: 'summary-editor',
    codeKey: 'demo-json',
    lang: 'json',
    cacheKey: 'demo-json',
    defaultOpen: true,
    code: `{
  "name": "interview",
  "version": "1.0.0",
  "portfolio": {
    "allocation": [
      { "name": "低估股", "ratio": 50 },
      { "name": "周期股", "ratio": 30 },
      { "name": "科技股", "ratio": 20 }
    ]
  },
  "principles": [
    "不满仓操作",
    "操作前先想好退出策略"
  ]
}`,
  },
  'expand-mermaid:flow-chart': {
    pageKey: 'expand-mermaid',
    codeKey: 'flow-chart',
    lang: 'mermaid',
    code: `flowchart TD
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
    style J fill:#52c41a,color:#fff`,
  },
  'expand-mermaid:sequence-diagram': {
    pageKey: 'expand-mermaid',
    codeKey: 'sequence-diagram',
    lang: 'mermaid',
    code: `sequenceDiagram
    actor 用户
    participant 前端
    participant 网关
    participant 认证服务
    participant 数据库

    用户->>前端: 输入账号密码
    前端->>网关: POST /login
    网关->>认证服务: 转发请求
    Note over 认证服务,数据库: 验证用户身份
    认证服务->>数据库: 查询用户
    数据库-->>认证服务: 用户信息

    alt 验证通过
        认证服务-->>网关: 签发 Token
        网关-->>前端: 返回 Token
        前端-->>用户: 登录成功
    else 验证失败
        认证服务-->>网关: 401 Unauthorized
        网关-->>前端: 登录失败
        前端-->>用户: 提示错误
    end

    loop Token 刷新（每30分钟）
        前端->>网关: 携带 RefreshToken
        网关-->>前端: 新 AccessToken
    end`,
  },
  'expand-mermaid:class-diagram': {
    pageKey: 'expand-mermaid',
    codeKey: 'class-diagram',
    lang: 'mermaid',
    code: `classDiagram
    class Payable {
        <<interface>>
        +pay(amount: float): bool
        +refund(amount: float): bool
    }
    class Order {
        +String orderId
        +float totalAmount
        +List~OrderItem~ items
        +createOrder(): void
        +cancel(): void
    }
    class OrderItem {
        +String productId
        +int quantity
        +float price
    }
    class Payment {
        +String paymentId
        +float amount
        +String status
        +pay(amount: float): bool
        +refund(amount: float): bool
    }
    class AlipayPayment {
        +String alipayAccount
        +pay(amount: float): bool
        +refund(amount: float): bool
    }
    class WechatPayment {
        +String openId
        +pay(amount: float): bool
        +refund(amount: float): bool
    }

    Payable <|.. Payment
    Payment <|-- AlipayPayment
    Payment <|-- WechatPayment
    Order --* OrderItem : 包含
    Order --> Payment : 使用`,
  },
  'expand-mermaid:state-diagram': {
    pageKey: 'expand-mermaid',
    codeKey: 'state-diagram',
    lang: 'mermaid',
    code: `stateDiagram-v2
    [*] --> 待支付
    待支付 --> 已支付: 用户付款
    待支付 --> 已取消: 超时/取消

    state 已支付 {
        [*] --> 待发货
        待发货 --> 配送中: 商家发货
        配送中 --> 已签收: 用户签收
        已签收 --> [*]
    }

    已支付 --> 售后中: 申请退款
    售后中 --> 已退款: 审核通过
    售后中 --> 已支付: 审核拒绝
    已取消 --> [*]
    已退款 --> [*]
    已支付 --> [*]: 完成`,
  },
  'expand-mermaid:gantt-chart': {
    pageKey: 'expand-mermaid',
    codeKey: 'gantt-chart',
    lang: 'mermaid',
    code: `gantt
    title 项目开发计划
    dateFormat YYYY-MM-DD
    section 需求阶段
        需求分析    :done,    2024-01-01, 2024-01-07
        原型设计    :done,    2024-01-08, 2024-01-14
    section 开发阶段
        前端开发    :active,  2024-01-15, 2024-02-15
        后端开发    :active,  2024-01-15, 2024-02-10
    section 测试阶段
        功能测试    :crit,    2024-02-16, 2024-02-28
        上线发布    :         2024-03-01, 2024-03-03`,
  },
  'expand-mermaid:pie-chart': {
    pageKey: 'expand-mermaid',
    codeKey: 'pie-chart',
    lang: 'mermaid',
    code: `pie title 前端技术栈使用比例
    "Vue" : 40
    "React" : 35
    "Angular" : 15
    "其他" : 10`,
  },
  'expand-mermaid:mindmap': {
    pageKey: 'expand-mermaid',
    codeKey: 'mindmap',
    lang: 'mermaid',
    code: `mindmap
  root((前端))
    HTML
      语义化标签
      表单
    CSS
      Flex
      Grid
      动画
    JavaScript
      ES6+
      异步编程
      模块化
    框架
      Vue
      React`,
  },
  'expand-mermaid:style-demo': {
    pageKey: 'expand-mermaid',
    codeKey: 'style-demo',
    lang: 'mermaid',
    code: `flowchart LR
    A[(数据采集)] --> B{阈值判断}
    B -->|正常| C[正常]
    B -->|超阈值| D[警告]
    D --> E{持续超阈值?}
    E -->|否| C
    E -->|是| F[错误/告警]

    style C fill:#52c41a,color:#fff,stroke:#52c41a
    style D fill:#faad14,color:#fff,stroke:#faad14
    style F fill:#ff4d4f,color:#fff,stroke:#ff4d4f`,
  },
  'home:knowledge-map': {
    pageKey: 'home',
    codeKey: 'knowledge-map',
    lang: 'mermaid',
    code: `mindmap
  root((知识图谱))
    前端
      HTML
      CSS
      JavaScript
      TypeScript
      React
      React Native
      浏览器原理
    工程化
      Webpack
      Vite
      Babel
      Jest
      Next.js
      Taro.js
      前端工程化
    计算机基础
      网络
      操作系统
      编译原理
      数据结构
    后端
      Node.js
      Nest.js
      Golang
    数据库
      MySQL
      Redis
      MongoDB
      Kafka
    运维
      Docker
      Nginx
      Git
      Bash
    AI
      AI Tools
      AI Agent
      LangChain
      LangGraph
    算法
      LeetCode
      方法汇总
    面试
      前端面试
      手撕代码
      复盘总结`,
  },
  'architecture:copilot-system': {
    pageKey: 'architecture',
    codeKey: 'copilot-system',
    lang: 'mermaid',
    code: `graph LR
    subgraph 第三方系统服务
      IM[IM]
      WB[workbench]
    end

    B[copilot-bridge]
    BD[(bridge-DB)]

    subgraph Ai服务
      Ai[copilot]
      Ai-DB[(copilot-DB)]
    end

    subgraph Message服务
      WxM[Wx-Message]
      MS[message-center] 
      MS-DB[(message-DB)] 
    end

    第三方系统服务 <---> |"产生/处理工单\\n消息通知"| B
    B ---> |"业务数据"| Ai
    Ai <--> |"Conversations\\nPurchase Context"| Ai-DB
    Ai ---> |"处理任务"| B
    B <--> BD
    WxM ---> |"微信消息Kafka"| MS
    MS <--> |"微信消息\\n用户画像"| MS-DB
    MS ---> |POST Hook|Ai`,
  },
  'architecture:micro-service': {
    pageKey: 'architecture',
    codeKey: 'micro-service',
    lang: 'mermaid',
    code: `graph LR
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
    style CACHE fill:#fce4ec`,
  },
  'architecture:frontend-arch': {
    pageKey: 'architecture',
    codeKey: 'frontend-arch',
    lang: 'mermaid',
    code: `sequenceDiagram
    participant PC as PC用户
    participant Foreign as cassint.casstime.com
    participant Intra as cassint.cassmall.com
    participant istio as istio网关
    participant server as intelligent-sale-workbench-web-service

    par websocket 网络拓扑图
        PC->>Foreign: 用户进入前端页面
        Note over Foreign: 广播，公用同一websocket空间
    		Foreign->>Foreign: 同源策略，父子页面广播透传websocket
        Foreign-->>Intra: Proxy到电商intra
        Intra-->>istio: Nginx转发到istio，并做socket upgrate
        istio->>server: Proxy 到服务
        server->>Foreign: token鉴权并握手
    end`,
  },
  'architecture:message-notify': {
    pageKey: 'architecture',
    codeKey: 'message-notify',
    lang: 'mermaid',
    code: `sequenceDiagram
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
    end`,
  },
  'architecture:open-claw': {
    pageKey: 'architecture',
    codeKey: 'open-claw',
    lang: 'mermaid',
    zoomable: true,
    code: `graph TD
    subgraph L5["第5层 - 原生客户端"]
        macOS["macOS App / SwiftUI"]
        Mobile["iOS/Android App"]
        WebUI["Web UI / Lit + Vite"]
    end

    subgraph L4["第4层 - 扩展插件"]
        CP["渠道插件 Telegram/Discord"]
        PP["提供商插件 OpenAI/Anthropic"]
        FP["功能插件 memory-core"]
    end

    subgraph L3["第3层 - 功能模块"]
        MEM["Memory 向量存储"]
        CTX["Context Engine"]
        HOOKS["Hooks"]
        SANDBOX["Sandbox"]
        SUB["Subagents"]
        SKILLS["Skills"]
        MEDIA["Media Pipeline"]
        TTS["TTS & Voice"]
        WEB["Web Search"]
        CRON["Cron"]
    end

    subgraph L2["第2层 - 核心业务逻辑"]
        CH["Channels System"]
        GW["Gateway Server"]
        RT["Routing 7级优先级"]
        AR["Auto Reply"]
        AGENT["Agent Runtime"]
        PS["Plugin System"]
    end

    subgraph L1["第1层 - 基础设施"]
        CFG["Config System"]
        SEC["Secrets & Auth"]
        SDK["Plugin SDK"]
        LOG["Logging & Terminal"]
        INFRA["Infra Utils"]
    end

    macOS -->|WebSocket| GW
    Mobile -->|WebSocket| GW
    WebUI -->|WebSocket| GW

    CP -->|plugin-sdk| PS
    PP -->|plugin-sdk| PS
    FP -->|plugin-sdk| PS

    CH --> GW
    GW --> RT
    RT --> AR
    AR --> AGENT
    AGENT --> PS

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

    CFG --> SEC
    SEC --> INFRA
    SDK --> INFRA
    LOG --> INFRA
    PS --> SDK
    AGENT --> SDK

    style L5 fill:#e1f5fe,stroke:#0288d1
    style L4 fill:#e8f5e9,stroke:#388e3c
    style L3 fill:#fff3e0,stroke:#f57c00
    style L2 fill:#fce4ec,stroke:#c62828
    style L1 fill:#f3e5f5,stroke:#7b1fa2`,
  },
  'architecture:open-claw-flow': {
    pageKey: 'architecture',
    codeKey: 'open-claw-flow',
    lang: 'mermaid',
    code: `sequenceDiagram
    participant U as 用户
    participant CH as Channel<br/>(Telegram/Discord)
    participant GW as Gateway Server
    participant RT as Routing
    participant AR as Auto Reply
    participant AG as Agent Runtime
    participant PP as Provider Plugin<br/>(OpenAI/Anthropic)
    participant MEM as Memory

    U->>CH: 发送消息
    CH->>GW: 入站消息(WebSocket)
    GW->>RT: 路由匹配
    RT->>RT: Session Key 解析<br/>7级优先级匹配
    RT->>AR: 分发到 Auto Reply
    AR->>AG: 触发 Agent 运行
    AG->>MEM: 检索相关记忆
    MEM-->>AG: 返回上下文
    AG->>PP: 调用 LLM
    PP-->>AG: 流式响应
    AG->>MEM: 存储新记忆
    AG-->>AR: 生成回复
    AR-->>GW: 回复消息
    GW-->>CH: 出站消息
    CH-->>U: 显示回复`,
  },
  'architecture:copilot-memory': {
    pageKey: 'architecture',
    codeKey: 'copilot-memory',
    lang: 'mermaid',
    code: `flowchart TD
    subgraph INPUT["输入源"]
        U["用户消息"]
        AI["AI 回复"]
        SYS["系统事件\\n(工具调用/状态变更)"]
    end

    subgraph WRITE["1. Memory 写入流程（实时抽取与存储）"]
        direction LR
        W1["内容解析器\\n消息解析 · 结构化提取\\n意图识别 · 实体识别"]
        W2["记忆抽取器\\n事实(Fact) · 偏好(Preference)\\n事件(Event) · 任务/待办(Task)"]
        W3["记忆去重 & 合并\\n相似性检测 · 冲突检测\\n版本合并 · 置信度更新"]
        W4["记忆分类 & 打标\\n类型标注 · 重要性评分\\n时间戳 · 来源标记"]
        W1 --> W2 --> W3 --> W4
        W4 -.->|"反馈优化（基于后续对话验证记忆质量）"| W2
    end

    subgraph STORE["3. Memory 存储层（多层存储）"]
        direction TB
        PM[("偏好记忆库 Preference Memory\\nMongoDB")]
        EM[("事件记忆库 Event Memory\\nMongoDB\\n Purchase Context")]
        SM[("会话记忆库 Session Memory\nMongoDB")]
        HF[("历史事实库 History Facts\nMongoDB")]
    end

    subgraph RECALL["3. Memory 召回流程（跨Session记忆检索）"]
        direction LR
        R1["召回触发器\\n新会话启动 · 关键词触发\\n时间维度触发 · 上下文相似触发"]
        R2["查询理解\\n意图理解 · 实体识别\\n时间解析(昨天/上午等) · 查询扩展"]
        R3["结果排序 & 过滤\\n相关性排序 · 去重过滤\\n重要性加权 · Top-K 选择"]
        R4["记忆融合\\n多源记忆融合 · 冲突消解\\n上下文组装 · 置信度标注"]
    end

    subgraph PROMPT["4. Memory 在 Prompt 中的使用"]
        direction LR
        P1["系统指令\\n(System Prompt)"]
        P2["用户画像记忆\\n(User Profile)"]
        P3["偏好记忆\\n(Preferences)"]
        P4["近期事件记忆\\n(Recent Events)"]
        P5["会话摘要\\n(Summary)"]
        P6["当前对话历史\\n(History)"]
        P7(["完整 Prompt"])
        LLM["LLM 大模型\\n生成回复"]
        P1 & P2 & P3 & P4 & P5 & P6 --> P7 --> LLM
    end

    subgraph CONS["2. 会话一致性保障"]
        direction LR
        C1["dialogue分布式 Session 管理\\n多节点状态同步 · 会话路由一致性"]
        C2["记忆版本控制\\n记忆版本号 · 乐观锁控制\\n冲突检测与合并"]
        C3["容错与降级\\n存储故障降级 · 缓存兜底\\n召回失败降级"]
    end

    INPUT -->|"写入"| W1
    CONS <--> STORE
    W1 -->|"写入存储"| STORE
    W4 -->|"触发"| INTENT["LLM 意图识别\\nSkill 调用 · 任务分解"]
    INTENT -->|"需要召回"| R1
    INTENT --> R2 & R3
    R1 --> |"读取"|STORE
    STORE -->|"召回"| R4
    R2 & R3 --> R4
    R4 --> P1 & P2 & P3 & P4 & P5 & P6
    `,
  },
  'ai-index:ai-overview': {
    pageKey: 'ai-index',
    codeKey: 'ai-overview',
    lang: 'mermaid',
    code: `mindmap
  root((AI开发))
    LLM基础
      Transformer
      Token
      Attention
      Context Window
      Embedding
      KV Cache
      Sampling
      Reasoning
    Prompt工程
      Zero/One/Few Shot
      CoT
      Self Consistency
      Structured Output
      Prompt Template
      Context Engineering
    Tool Calling
      Function Calling
      MCP
      API/Browser/DB Tools
      Code Execution
      Tool Routing
    RAG
      Embedding & Chunking
      Vector Database
      Retrieval & Hybrid Search
      Rerank & Compression
      Citation
    Agent
      ReAct
      Planning & Reflection
      Memory
      Multi-Agent
      Workflow/Autonomous Agent
      Agent State & Loop
    Memory系统
      Working/Episodic Memory
      Semantic Memory
      Memory Retrieval
      Memory Compression
      Long-term Memory
    AI工程化
      Evaluation & Benchmark
      Observability & Tracing
      Prompt Versioning
      Cost Control & Caching
      Deployment & Monitoring
    AI架构设计
      Single/Multi-Agent
      Event Driven
      Workflow Engine
      Human In The Loop
      Agent Gateway & Middleware
    多模态AI
      Vision & OCR
      Speech To Text/TTS
      Image Generation
      Video Understanding/Generation
    模型训练
      Pretraining
      Fine-Tuning & LoRA
      RLHF & DPO
      Distillation
    AI产品
      ChatBot/Copilot
      Coding/Research Agent
      Workflow/Autonomous Agent
      Enterprise AI & SaaS`,
  },
};
