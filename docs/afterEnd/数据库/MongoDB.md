---
group:
  # title: '后端'
order: 4
---

# MongoDB

系统学习 MongoDB，可以按照从基础概念到实战优化的路线，分阶段进行。

- 核心认知

1. MongoDB 是 `文档型数据库`（Document DB）

2. BSON vs JSON（为什么有 ObjectId / Date）

3. Schema-less ≠ 没结构

- 行业认知

1. MongoDB = 业务快速迭代 / 非强事务系统

2. 常见于

    - BFF 层
    - 内容系统 / 评论 / 弹幕系统 / 内容流（Feed）
    - 日志 / 行为数据 / 用户行为埋点系统
    - 中台 / 管理后台


✅ 第一阶段：基础入门

目标：搞清 MongoDB 是什么、为什么用、怎么在项目里“正确地用”

学习内容：

- [CRUD：Create / Read / Update / Delete](/after-end/数据库/mongo-db#一crud)
  - [基本数据类型和操作命令](/after-end/数据库/mysql#12-基本数据类型)：String、Hash、List、Set、ZSet 等
- [查询]()
- [Nodejs - Mongoose]()

```
db.users.insertOne()
db.users.find()
db.users.updateOne()
db.users.deleteOne()
$set

$inc

$push / $pull

$in / $gte / $lte
```

查询

- 条件查询

- 排序 / 分页

- 投影（只返回需要的字段）

- 模糊查询（regex）

Nodejs - Mongoose

- Schema & Model

- 类型约束

- 默认值

- timestamps

- 中间件（pre / post）


✅ 第二阶段：进阶应用

目标：能设计数据结构，避免“用着爽，后期崩”

学习内容：

- [Schema 设计]()
- [聚合管道（Aggregation Pipeline）【必会】]()
- [事务与一致性]()
- [索引（从“能跑”到“跑得快”）]()

嵌套 vs 引用

```
// 嵌套
{
  orderId,
  items: [{ productId, price }]
}

// 引用
{
  orderId,
  userId
}
```

什么时候嵌套？

1. 强关联

2. 小数据量

3. 高频一起查

什么时候引用？

1. 数据量大

2. 生命周期不同

3. 多对多

聚合管道（Aggregation Pipeline）【必会】

这是 MongoDB 的核心竞争力。

$match

$group

$project

$lookup（类似 join）

$unwind

MongoDB 支持事务（4.0+）,但成本高不适合高频

索引

单字段索引

复合索引

唯一索引

TTL 索引

问题

ObjectId vs string

查询字段顺序不命中索引

文档无限膨胀

$lookup 滥用

✅ 第三阶段：性能优化与实战

目标：正能在生产环境扛住数据量和并发

学习内容：

1️⃣ 性能分析

explain()

executionStats

nReturned vs totalDocsExamined

2️⃣ 高并发与大数据量设计

写放大

文档大小限制（16MB）

冷热数据分离

时间序列模型

3️⃣ 分片（Sharding）【进阶】

什么是 shard key

为什么 shard key 选错 = 灾难

hash vs range

5️⃣ MongoDB + 现代技术栈

MongoDB + NestJS

MongoDB + GraphQL

MongoDB + Redis（冷热分层）

MongoDB Atlas（云）


### 一、CRUD

本质：对 Collection（表）里的 Document（JSON）做增删改查

| SQL         | MongoDB    |
| ----------- | ---------- |
| table       | collection |
| row         | document   |
| column      | field      |
| primary key | `_id`      |

### 1.1 Create

1. 插入一条

```js
db.users.insertOne({
  name: "Tom",
  age: 18,
  tags: ["node", "mongodb"],
  createdAt: new Date()
})
```

2. 插入多条

```js
db.users.insertMany([
  { name: "Alice", age: 20 },
  { name: "Bob", age: 22 }
])
```
