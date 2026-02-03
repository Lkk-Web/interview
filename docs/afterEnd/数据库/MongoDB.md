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

- [CRUD：Create / Read / Update / Delete](/after-end/数据库/mongo-db#一crud)
  - [基本数据类型](/after-end/数据库/mongo-db#二基本数据类型)
  - [类型约束](/after-end/数据库/mongo-db#21-bson)
- [Nodejs - Mongoose](/after-end/数据库/mongo-db#三mongoose)
  - [Schema & Model](/after-end/数据库/mongo-db#31-schema-定义)
  - [中间件（pre / post）](/after-end/数据库/mongo-db#32-中间件pre--post)

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

## 二、基本数据类型 & 命令

### 2.1 BSON

MongoDB 用的是 BSON（Binary JSON）

| 类型           | 示例                   | 说明     |
| ------------ | -------------------- | ------ |
| `String`     | `"hello"`            | 字符串    |
| `NumberInt`  | `NumberInt(18)`      | 32 位整数 |
| `NumberLong` | `NumberLong(100000)` | 64 位整数 |
| `Double`     | `3.14`               | 浮点数    |
| `Boolean`    | `true`               | 布尔     |
| `Array`      | `["a", "b"]`         | 数组     |
| `Object`     | `{ a: 1 }`           | 内嵌文档   |
| `Date`       | `new Date()`         | 日期时间   |
| `ObjectId`   | `ObjectId("...")`    | 默认主键   |
| `Null`       | `null`               | 空值     |

### 3.1 语法糖

```text
$set   → 改字段
$push  → 数组加
$pull  → 数组删
$in    → 在不在这堆里
$inc   → 数字加减
$gte   → 大于等于
$lte   → 小于等于
```
#### 4.1 $inc —— 数字自增 / 自减

示例
```js
db.users.updateOne(
  { _id },
  { $inc: { score: 1 } }
)
```

等价于：

`score = score + 1`

自减
```js
$inc: { score: -1 }
```
1. 线程安全
2. 适合计数 / 库存 / 点击量

#### 4.2 $lookup -- JOIN（左外连接）

> $lookup = MongoDB 在聚合管道里的 JOIN（左外连接）

```js
{
  _id: ObjectId("u1"),
  name: "Tom",
}

{
  _id: ObjectId("o1"),
  userId: ObjectId("u1"),
  amount: 100,
}

db.orders.aggregate([
  {
    $lookup: {
      from: 'users',          // collection 名
      localField: 'userId',   // orders 的字段
      foreignField: '_id',    // users 的字段
      as: 'user',
    },
  },
]);

// 返回
{
  amount: 100,
  user: [
    {
      _id: 'u1',
      name: 'Tom'
    }
  ]
}
```

- 什么时候别用 $lookup

✅ 实时高并发接口
✅ join 链路很深
✅ 结果字段特别多

- `工程级别`
```js
ChannelSchema.aggregate([
  {
    $match: {
      $and: [keywordString, channelCondition],  // 主表筛选 - 越早 match 越好（性能）
    },
  },
  {
    $lookup: {  // 高级 JOIN
    // 去 channelstores 表里找「同 channelId」且「没被删除」结果放到 channelStores 数组里
      let: {
        channelId: '$channelId',
      },
      from: 'channelstores',
      as: 'channelStores',
      pipeline: [ // 定义 “怎么查子表”
        {
          $match: { // 子表筛选器
            $expr: { // 允许“动态比较”
              $and: [ // 两个条件必须同时满足
                { $eq: ['$channelId', '$$channelId'] },
                { $ne: ['$status', ChannelStatusDesc.IS_DELETE] },
              ],
            },
          },
        },
      ],
    },
  },
  {
    $sort: { createdAt: -1 },
  },
  {
    $skip: (pageNum - 1) * pageSize,
  },
  {
    $facet: {
      data: [{ $limit: pageSize }],
    },
  },
]).exec()

// 返回

[
  {
    "data": [
      {
        "_id": "ObjectId(...)",
        "channelId": "CH001",
        "name": "渠道A",
        "createdAt": "2024-01-01T10:00:00Z",
        "channelStores": [
          {
            "_id": "ObjectId(...)",
            "channelId": "CH001",
            "storeName": "门店1",
            "status": 1
          }
        ]
      }
    ]
  }
]

```
