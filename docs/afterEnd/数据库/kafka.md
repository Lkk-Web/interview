---
group:
  # title: '后端'
order: 4
---

# Kafka

Kafka 是分布式、只追加、不可随意修改的事件存储系统（Event Store）

1️⃣ 知道 Kafka 能解决什么，不能解决什么
2️⃣ 能设计 Topic / Partition / Consumer Group
3️⃣ 能写出不丢消息、不重复、不炸的消费者
4️⃣ 知道什么时候该用 Kafka，什么时候不该

✅ 第一阶段：基础入门

目标：

- Kafka 和 MQ（RabbitMQ）的区别

- Kafka 为什么是 pull 模型

- Kafka 为什么“快”

学习内容：

Topic / Partition

Offset

Consumer Group

Leader / Follower

ISR


✅ 第二阶段：进阶应用

```
Node Producer → Kafka → Node Consumer
```

目标：掌握在实际项目中 Redis 的常见用途和封装方式。

学习内容：

- 幂等消费者

- 去重设计

- Key 设计

- 分区策略

- 重试

- 死信队列（DLQ）

- 限流

✅ 第三阶段：架构应用

目标：

分区数怎么定

消费组怎么扩容

Rebalance 是什么，为什么会抖

Lag 是什么，怎么监控

消息堆积怎么处理

1. Kafka + DB（最常见）

写库 → 发事件 → 下游异步处理

2. Kafka 作为事件总线

- 多系统订阅
- 解耦
