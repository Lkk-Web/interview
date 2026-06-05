---
nav:
  title: 'AI'
  order: 3
group:
  title: '前言'
  order: 1
---

# 前言

AI Agent、Ai 前沿等...

<code src="../components/mermaid/AIOverview.tsx"></code>

```
AI开发
│
├─ 1. LLM基础
│   ├─ Transformer           # 大模型核心架构
│   ├─ Token                 # 模型处理文本的最小单位
│   ├─ Attention             # 注意力机制，决定关注哪些信息
│   ├─ Context Window        # 上下文窗口长度
│   ├─ Embedding             # 文本向量化表示
│   ├─ KV Cache              # 推理加速缓存机制
│   ├─ Sampling              # 输出采样策略
│   └─ Reasoning             # 推理能力原理
│
├─ 2. Prompt工程
│   ├─ Zero Shot             # 直接提问
│   ├─ One Shot              # 提供一个示例
│   ├─ Few Shot              # 提供多个示例
│   ├─ CoT                   # 思维链推理
│   ├─ Self Consistency      # 多次推理投票
│   ├─ Structured Output     # JSON结构化输出
│   ├─ Prompt Template       # Prompt模板管理
│   └─ Context Engineering   # 上下文设计与管理
│
├─ 3. Tool Calling
│   ├─ Function Calling      # 函数调用
│   ├─ MCP                   # 模型上下文协议
│   ├─ API Tools             # 外部API工具
│   ├─ Browser Tools         # 浏览器工具
│   ├─ Database Tools        # 数据库工具
│   ├─ Code Execution        # 代码执行工具
│   └─ Tool Routing          # 工具选择与调度
│
├─ 4. RAG
│   ├─ Embedding             # 文本向量化
│   ├─ Chunking              # 文档切块
│   ├─ Vector Database       # 向量数据库
│   ├─ Retrieval             # 检索召回
│   ├─ Hybrid Search         # 混合检索
│   ├─ Rerank               # 重排序
│   ├─ Compression           # 上下文压缩
│   └─ Citation              # 引用溯源
│
├─ 5. Agent
│   ├─ ReAct                 # 思考-行动-观察
│   ├─ Planning              # 任务规划
│   ├─ Reflection            # 自我反思
│   ├─ Memory                # 记忆系统
│   ├─ Multi-Agent           # 多智能体协作
│   ├─ Workflow Agent        # 工作流Agent
│   ├─ Autonomous Agent      # 自主Agent
│   ├─ Agent State           # Agent状态管理
│   └─ Agent Loop            # Agent循环执行机制
│
├─ 6. Memory系统
│   ├─ Working Memory        # 工作记忆
│   ├─ Episodic Memory       # 事件记忆
│   ├─ Semantic Memory       # 语义记忆
│   ├─ Memory Retrieval      # 记忆检索
│   ├─ Memory Compression    # 记忆压缩
│   └─ Long-term Memory      # 长期记忆
│
├─ 7. AI工程化
│   ├─ Evaluation            # AI效果评估
│   ├─ Benchmark             # 基准测试
│   ├─ Regression Test       # 回归测试
│   ├─ Observability         # 可观测性
│   ├─ Tracing               # 调用链追踪
│   ├─ Prompt Versioning     # Prompt版本管理
│   ├─ Cost Control          # 成本控制
│   ├─ Caching              # 缓存优化
│   ├─ Deployment           # 部署发布
│   └─ Monitoring           # 监控告警
│
├─ 8. AI架构设计
│   ├─ Single Agent          # 单Agent架构
│   ├─ Multi-Agent System    # 多Agent系统
│   ├─ Event Driven          # 事件驱动架构
│   ├─ Workflow Engine       # 工作流引擎
│   ├─ Human In The Loop     # 人工审核机制
│   ├─ Agent Gateway         # Agent网关
│   └─ AI Middleware         # AI中间件
│
├─ 9. 多模态AI
│   ├─ Vision                # 图像理解
│   ├─ OCR                   # 文字识别
│   ├─ Speech To Text        # 语音转文字
│   ├─ Text To Speech        # 文字转语音
│   ├─ Image Generation      # AI绘图
│   ├─ Video Understanding   # 视频理解
│   └─ Video Generation      # 视频生成
│
├─ 10. 模型训练
│   ├─ Pretraining           # 预训练
│   ├─ Fine-Tuning           # 微调
│   ├─ LoRA                 # 低成本微调
│   ├─ RLHF                # 人类反馈强化学习
│   ├─ DPO                 # 偏好优化
│   └─ Distillation        # 模型蒸馏
│
└─ 11. AI产品
    ├─ ChatBot              # 对话机器人
    ├─ Copilot              # 智能助手
    ├─ Coding Agent         # 编程助手
    ├─ Research Agent       # 调研助手
    ├─ Workflow Agent       # 流程自动化助手
    ├─ Autonomous Agent     # 自主执行Agent
    ├─ Enterprise AI        # 企业AI系统
    └─ AI SaaS              # AI软件服务
```
