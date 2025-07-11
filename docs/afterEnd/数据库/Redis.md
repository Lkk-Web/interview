---
group:
  # title: '后端'
order: 2
---

# Redis

系统学习 Redis，可以按照从基础概念到实战优化的路线，分阶段进行。以下是一套推荐的学习路线，适合前端开发人员或初学者从入门到进阶掌握：

✅ 第一阶段：基础入门

目标：理解 Redis 是什么、能做什么，掌握基本操作和命令。

学习内容：

- [Redis 概念（内存存储、持久化、数据结构丰富等）](/after-end/数据库/mysql#数据库与关系型数据库概念)
  - [Redis 安装与配置（本地或 Docker）](/after-end/数据库/mysql#mysql-安装与配置本地或-docker)
  - 使用工具：RedisInsight / Medis
  - [基本数据类型和操作命令](/after-end/数据库/mysql#12-基本数据类型)：String、Hash、List、Set、ZSet 等
- 基本键操作：keys / exists / expire / ttl / del

✅ 第二阶段：进阶应用

目标：掌握在实际项目中 Redis 的常见用途和封装方式。

学习内容：

- 缓存层设计（接口缓存、数据缓存）
  - 缓存穿透、缓存雪崩、缓存击穿 处理方式
- Token 会话管理
  - 存储登录 token / session / 验证码
- 排行榜系统
  - 使用 ZSet 构建积分榜、活跃榜
- Redis 内存模型、LRU 淘汰策略
- 持久化机制：
  - RDB / AOF / 混合持久化
- 架构
  - 哨兵模式 Sentinel（主从 + 故障转移）
  - Redis Cluster（集群模式、分片方案）
