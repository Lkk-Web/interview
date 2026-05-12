/**
 * title: OpenClaw 消息处理流程
 * description: 一条消息从用户发送到 AI 回复的完整旅程
 */
import React from 'react';
import { Mermaid } from 'interview';

export default () => (
  <Mermaid
    chart={`
sequenceDiagram
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
    CH-->>U: 显示回复
`}
  />
);
