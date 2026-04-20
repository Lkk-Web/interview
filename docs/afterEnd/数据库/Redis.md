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


## 一、Redis 概念

> Redis = 高性能的内存数据结构存储 + 可选持久化 + 多用途（缓存 / 消息 / 排行 / 会话）

### 1.1 Redis 安装与配置（本地或 Docker）

[安装 Docker（macOS）](/after-end/运维/docker)

1. `拉取 Redis 镜像`

在终端中输入以下命令：

```bash
docker pull redis # 默认会拉取 latest（当前稳定版）。
# docker pull redis:7.2 #（当前主流）
```

2. `运行 Redis 容器`

执行以下命令启动 Redis

```bash
docker run -d \
  --name redis-beta \
  -p 6379:6379 \
  redis:7.2
```

3. `连接 Redis`

使用 GUI 工具（如 Navicat / RedisInsight / Medis）
- 主机地址（Host）：127.0.0.1
- 端口（Port）：6379


### 1.2 内存存储

1. 内存为主

Redis 把数据放在内存里, 内存访问是纳秒级，磁盘是毫秒级

2. 单线程 + IO 多路复用

    - 单线程执行命令（避免锁）

    - 使用 epoll / kqueue 处理高并发连接

    - 核心原则：少做事、做快事

3. 工程意义：

  - QPS 非常高（10w+ / 秒）

  - 延迟稳定，不容易抖

### 1.3 持久化

Redis 是内存数据库，但可以把数据保存到磁盘

1. RDB（快照）

定期把内存整体快照写到磁盘

- 方式：fork 子进程

- 文件：dump.rdb

- 特点：

    - 恢复快

    - 文件小

    - 可能丢几分钟数据

- 适合：

    - 备份

    - 冷启动恢复

    - 大数据量

2. AOF（追加日志）- 把每条写命令记录下来

- 文件：`appendonly.aof`

- 写入策略：

    - always（最安全，最慢）

    - everysec（默认，推荐）

    - no

- 特点：

    - 数据更安全

    - 文件会变大（需要重写）

3. 混合持久化（生产常用）

- RDB + AOF

- 启动快 + 数据安全
✔️ Redis 4+ 常见配置
