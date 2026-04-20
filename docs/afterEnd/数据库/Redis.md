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

### 1.4 数据结构

Redis 不是 Key Value，而是 Key → 数据结构

以下默认为 `Redis CLI` 命令

1. String

- 用途：

    - token
    - 缓存对象（JSON / 序列化）
    - 计数器（INCR）

```sh
key -> value

SET keyName "value"
SET token "685e4455a99aed4cc90ec99b"
SET session_token "abc123" EX 3600   # 1小时过期
SET user:1 '{"id":1,"name":"Max","email":"max@example.com"}' EX 3600 # JSON / 序列化对象
# 初始化计数器
SET page:view:1 0
INCR page:view:1 # 每次 +1
DECR page:view:1 # 每次 -1
## 查看value
GET page:view:1
```

- 特点：

不只是字符串，二进制安全

最大 512MB

2. Hash（对象结构）

```
user:1 -> { name, age, email }
```

- 用途：

用户信息

商品属性

- 优点：

比 JSON 更省内存

支持字段级更新

3. List（有序列表）

```
LPUSH / RPUSH
```

- 用途：

消息队列（简单场景）

时间线

- 特点：

双端队列

支持阻塞（BLPOP）

4. Set（无序去重集合）

- 用途：

去重

共同好友

标签系统

- 特点：

自动去重

支持交并差集

5. ZSet（有序集合）

- 用途：

排行榜

权重排序

延时队列

- 工程神器：

又排序又去重

时间戳 + score = 延时任务

