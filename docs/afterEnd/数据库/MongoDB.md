---
group:
  # title: '后端'
order: 3
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

### 1.2 Read(查询)

1. 查询字段

```js
db.users.find({ age: 18 })
```

2. 条件操作符

```js
// 大于 / 小于
db.users.find({ age: { $gt: 18 } })

// in
db.users.find({ age: { $in: [18, 20] } })

// not equal
db.users.find({ status: { $ne: "deleted" } })
```

3. 模糊查询（正则）

```js
// 匹配 name 中包含 "xx" 的文档，忽略大小写
db.users.find({
  name: { $regex: "xx", $options: "i" }
})
```
> 正则 + i = 极容易慢查询 -> 后面优化：前缀正则 + 索引

关键：`$options` 支持的匹配选项,MongoDB 支持 4 种核心匹配选项，可单独使用也可组合使用：

| 选项 | 含义 | 说明 |
|------|------|------|
| `i`  | 忽略大小写（ignore case） | `$options: "i"` 匹配 "to"、"To"、"TO" 等大小写形式 |
| `m`  | 多行匹配（multi line） | 针对包含换行符 `\n` 的字段，`^` 和 `$` 会匹配每行的开头/结尾（而非整个字符串的开头/结尾） |
| `x`  | 忽略正则中的空白字符（extended） | 用于格式化复杂正则，忽略正则表达式中的空格和 `#` 开头的注释内容 |
| `s`  | 单行匹配（dot all） | 让正则中的 `.` 匹配任意字符（包括换行符 `\n`，默认情况下 `.` 不匹配 `\n`） |

场景 1：前缀匹配（字段以指定字符串开头） 

使用正则元字符 `^`（匹配字符串开头）

```js
// 匹配 name 以 "to" 开头（忽略大小写）
// 写法1：$regex
db.users.find({
  name: { $regex: "^to", $options: "i" }
})
```

场景 2：后缀匹配（字段以指定字符串结尾）

使用正则元字符 `$`（匹配字符串结尾）

```js
// 匹配 name 以 "to" 结尾（忽略大小写）
db.users.find({
  name: { $regex: "to$", $options: "i" }
})
```

场景 3：精确匹配（等同于 $eq，无模糊效果，了解即可）

同时使用 `^` 和 `$`，限制整个字符串完全匹配

```js
// 匹配 name 恰好是 "to"（忽略大小写，等同于 { name: { $eq: "to", $options: "i" } }）
db.users.find({
  name: { $regex: "^to$", $options: "i" }
})
```

场景 4：匹配包含多个关键词中的任意一个

使用正则的 `|`（或）语法

```js
// 匹配 name 中包含 "to" 或 "tom" 或 "jack"（忽略大小写）
db.users.find({
  name: { $regex: "to|tom|jack", $options: "i" }
})
```

- 注意事项

索引优化：如果字段建立了索引，**前缀匹配（^to）可以利用索引提升查询效率**；而包含匹配（to）、后缀匹配（to$）无法利用索引，数据量大时查询会很慢。

创建单字段升序索引（最常用，满足大部分场景）
```sh
# 为 users 集合的 name 字段创建单字段索引（1 表示升序，-1 表示降序，对前缀匹配无影响）
db.users.createIndex({ name: 1 })
```

特殊字符转义：如果查询的关键词包含正则元字符（如 .、*、+、? 等），需要先转义，否则会被当作正则语法解析，导致查询结果错误。

4. 投影

```js
db.users.find(
  { age: 18 },
  { name: 1, age: 1, _id: 0 } // 1 取字段，0不取
)
```

5. 分页

```js
db.users.find({})
  .skip(20)
  .limit(10)
  .sort({ createdAt: -1 })
```

### 1.3 Update


```js
$set      // 设置字段
$unset    // 删除字段
$inc      // 自增
$push     // 数组追加
$pull     // 数组删除

db.users.updateOne(
  { name: "Tom" },
  { $set: { age: 19 } }
)

// upsert（没有就插）
db.users.updateOne(
  { email: "a@b.com" },
  { $set: { name: "A" } },
  { upsert: true }
)
```

❗️不加 $set = 整条文档被覆盖


### 1.4 Delete

```js
db.users.deleteOne({ name: "Tom" })
db.users.deleteMany({ age: { $lt: 18 } })
```

- 真实项目 很少物理删除 - 软删除方案

```js
db.users.updateOne(
  { _id },
  { $set: { status: "deleted" } }
)

status: { $ne: IS_DELETE }
```

