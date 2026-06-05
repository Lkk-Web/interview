---
group:
  order: 2
---

# LLM 基础

## 一、Transformer

> 论文：[Attention Is All You Need](https://arxiv.org/abs/1706.03762)（2017，Google）

Transformer 是现代大语言模型的核心架构，彻底取代了 RNN/LSTM。核心思想：**用注意力机制替代循环结构，实现序列的并行处理**。

### 1.1 整体结构

```
输入序列
   ↓
Input Embedding + Positional Encoding
   ↓
┌─────────────────────────────┐
│         Encoder × N         │  （BERT 类模型只有 Encoder）
│  Multi-Head Self-Attention  │
│  Add & Norm                 │
│  Feed Forward               │
│  Add & Norm                 │
└─────────────────────────────┘
   ↓
┌─────────────────────────────┐
│         Decoder × N         │  （GPT 类模型只有 Decoder）
│  Masked Multi-Head Attention│
│  Add & Norm                 │
│  Cross-Attention            │
│  Add & Norm                 │
│  Feed Forward               │
│  Add & Norm                 │
└─────────────────────────────┘
   ↓
Linear + Softmax → 输出概率
```

- **Encoder-only**：BERT，适合理解任务（分类、NER）
- **Decoder-only**：GPT、Claude、LLaMA，适合生成任务
- **Encoder-Decoder**：T5、BART，适合翻译、摘要

### 1.2 Self-Attention（自注意力）

每个 token 对序列中所有 token 计算相关性，捕捉长距离依赖。

**计算步骤：**

1. 输入向量 $X$ 分别乘以三个权重矩阵，得到 Q（Query）、K（Key）、V（Value）
2. 计算注意力分数：$\text{Attention}(Q,K,V) = \text{softmax}\left(\dfrac{QK^T}{\sqrt{d_k}}\right)V$
3. $\sqrt{d_k}$ 是缩放因子，防止点积过大导致梯度消失

```
"我 爱 北京"
  ↓
每个词生成 Q、K、V 向量
  ↓
"北京" 的 Q 与所有词的 K 做点积 → 得到注意力权重
  ↓
加权求和 V → "北京"的上下文表示
```

### 1.3 Multi-Head Attention（多头注意力）

并行运行多组 Self-Attention，每组学习不同维度的语义关系（语法、指代、语义等），最后拼接输出。

```
输入 X
  ├─ Head 1: Q1K1V1 → 关注语法关系
  ├─ Head 2: Q2K2V2 → 关注指代关系
  └─ Head h: QhKhVh → 关注语义关系
        ↓
     Concat → Linear → 输出
```

### 1.4 Positional Encoding（位置编码）

Transformer 并行处理，天然没有位置信息，需要额外注入。

| 方式 | 代表模型 | 特点 |
|------|---------|------|
| 正弦绝对位置编码 | 原始 Transformer | 固定，不可学习 |
| 可学习绝对位置编码 | BERT、GPT-2 | 训练时学习，有最大长度限制 |
| RoPE（旋转位置编码） | LLaMA、GPT-NeoX | 相对位置，外推性好 |
| ALiBi | MPT | 线性偏置，长文本友好 |

### 1.5 Feed Forward Network（FFN）

每个 Attention 层后接一个两层 MLP，对每个 token 独立处理，增加非线性表达能力。

```
FFN(x) = max(0, xW₁ + b₁)W₂ + b₂
```

维度通常扩大 4 倍再压缩回来（如 768 → 3072 → 768）。

### 1.6 为什么 Transformer 优于 RNN

| 对比项 | RNN/LSTM | Transformer |
|--------|---------|-------------|
| 序列处理 | 逐步顺序处理 | 全序列并行处理 |
| 长距离依赖 | 容易遗忘 | 直接 Attention，无损 |
| 训练速度 | 慢（无法并行） | 快（GPU 友好） |
| 最大序列长度 | 受梯度消失限制 | 受 Context Window 限制 |

### 1.7 面试常见问题

**Q：Attention 为什么要除以 $\sqrt{d_k}$？**

点积结果随维度增大而增大，导致 softmax 进入饱和区（梯度接近 0）。除以 $\sqrt{d_k}$ 将方差归一化，保持梯度稳定。

**Q：Self-Attention 的时间复杂度是多少？**

$O(n^2 \cdot d)$，$n$ 是序列长度，$d$ 是维度。这是长上下文的瓶颈，也是 Flash Attention、稀疏注意力等优化的出发点。

**Q：Decoder 为什么要用 Masked Attention？**

生成时每个位置只能看到之前的 token（自回归），Mask 掉未来位置防止信息泄露。

