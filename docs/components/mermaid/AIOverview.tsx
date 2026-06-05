/**
 * title: AI开发知识体系
 */
import React from 'react';
import { Mermaid } from 'interview';

const chart = `
mindmap
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
      Enterprise AI & SaaS
`;

export default () => <Mermaid chart={chart} />;
