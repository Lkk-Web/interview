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

- [Schema 设计](/after-end/数据库/mongo-db#四schema-设计)
- [聚合管道（Aggregation Pipeline）](/after-end/数据库/mongo-db#五聚合管道aggregation-pipeline)
- [事务一致性](/after-end/数据库/mongo-db#41-事务一致性)
- [索引设计（从“能跑”到“跑得快”）](/after-end/数据库/mongo-db#六索引设计) 

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


## 一、CRUD

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

#### 4.3 $expr

> $expr 的作用：让你在 `$match` 里，使用“表达式”，而不是只能写死值。

普通 $match 只能这样

```js
{ age: { $gte: 18 } }
// 你想这样（但不行）, MongoDB：❌ 不认识
A.age > B.minAge
```

✅ 用 $expr 之后

```js
{
  $expr: {
    $gte: ['$age', '$minAge']
  }
}

// 进阶

$expr: {
  $and: [
    { $eq: ['$channelId', '$$channelId'] }, // '$channelId' ： 当前 channelstores 文档里的字段，'$$channelId'来自 $lookup.let 的 外层变量
    { $ne: ['$status', ChannelStatusDesc.IS_DELETE] },
  ],
}
```

✅ 下面这些情况，没有 `$expr` 基本写不了

1. $lookup.pipeline 里做关联

2. 字段和字段比较

3. 字段和表达式比较

- 性能

能不用 `$expr`就不用

| 情况       | 写法          |
| -------- | ----------- |
| 字段 vs 常量 | 普通 `$match` |
| 字段 vs 字段 | `$expr`     |
| join 条件  | `$expr`     |

#### 4.4 $facet

> `$facet` = 在同一份数据上，同时跑多条“子管道”，一次返回多种结果

```js
db.users.aggregate([
  {
    $facet: {
      list: [{ $limit: 10 }],
      total: [{ $count: 'count' }],
    },
  },
]);
// 返回 
[
  {
    "list": [ /* 前 10 条用户 */ ],
    "total": [
      { "count": 128 }
    ]
  }
]
```
- 每个 `facet` 的值 都是数组

- `facet` 是 MongoDB 提供的“一次查询，多路输出”能力，尤其适合分页、统计、报表类场景。

这是 MongoDB 的核心竞争力。

#### 4.5 $match

1. $and

```js
{
  $match: {
    $and: [
      { status: 1 },
      { type: 'ONLINE' }
    ]
  }
}
// 下面这个更好：
{
  $match: {
    status: 1,
    type: 'ONLINE'
  }
}
```

2. $or（常用）

```js

{
  $match: {
    $or: [
      { name: { $regex: keyword } },
      { code: { $regex: keyword } }
    ]
  }
}
```

3. $expr

```js
{
  $match: {
    $expr: {
      $eq: ['$channelId', '$otherField']
    }
  }
}
```

#### 4.6 $project

`$project` = 聚合管道里的“字段选择 + 字段改造器”

- 和 Mongoose .select() 的区别

| 能力    | select | $project |
| ----- | ------ | -------- |
| 字段筛选  | ✅      | ✅        |
| 字段重命名 | ❌      | ✅        |
| 计算字段  | ❌      | ✅        |
| 条件逻辑  | ❌      | ✅        |
| 数值运算  | ❌      | ✅        |

1. 只保留指定字段

```js
{
  $project: {
    channelId: 1,
    name: 1,
    createdAt: 1
  }
}
// 排除字段（不推荐混用）
// 要么全 1，要么全 0
// ❌ 不能混着来（除了 _id）
{
  $project: {
    password: 0,
    _id: 0
  }
}
```

2. 字段重命名（超常用）

```js
{
  $project: {
    id: '$_id',
    channelId: 1,
    name: 1,
    _id: 0
  }
}
// 返回
{
  "id": "...",
  "channelId": "xxx",
  "name": "test"
}
```
3. 计算字段（$project 的灵魂）

```js
// 字段运算
{
  $project: {
    totalPrice: { $multiply: ['$price', '$count'] }
  }
}
// 字符串拼接
{
  $project: {
    fullName: { $concat: ['$firstName', ' ', '$lastName'] }
  }
}
// 条件判断
{
  $project: {
    statusText: {
      $cond: [
        { $eq: ['$status', 1] },
        '启用',
        '禁用'
      ]
    }
  }
}
// 空值处理（极其常见）
{
  $project: {
    avatar: { $ifNull: ['$avatar', 'default.png'] }
  }
}
// 数组长度
{
  $project: {
    storeCount: { $size: '$channelStores' }
  }
}
```
#### 4.7 $unwind

> $unwind = 把数组字段“拆成多行文档”

- 对数组元素做筛选
- 对数组元素 group / 统计
- JOIN → 拆 → 再 JOIN 


```js

{
  "channelId": "C001",
  "channelStores": [{...}, {...}]
}

[
  { $lookup: {...} },
  { $unwind: '$channelStores' }
]
//unwind 后
{
  "channelId": "C001",
  "channelStores": { "name": "A" }
}
{
  "channelId": "C001",
  "channelStores": { "name": "B" }
}

```

## 三、Mongoose

> Mongoose = MongoDB 的 Schema + Model + 校验 + 中间件

解决 4 件事：

1. 数据结构约束（Schema）

2. 类型转换（string → ObjectId / Date）

3. 常用 CRUD API

4. 钩子（pre / post）

5. 把操作命令原封不动地“转交”给 MongoDB

### 3.1 Schema 定义

```js
import { Schema, model } from 'mongoose';

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, min: 0 },
    email: { type: String, unique: true },
    status: {
      type: String,
      enum: ['active', 'disabled'],
      default: 'active',
    },
  },
  {
    timestamps: true, // createdAt / updatedAt
    versionKey: false, // 去掉 __v
    _id: false, autoIndex: false // 自定义id
  }
);

const UserInfoSchema = new Scheme(
  {
    userInfo: {
      require: true,
      type: UserSchema,
    },
  }
)

export const UserModel = model('User', UserSchema);

```

### 3.2 中间件（pre / post）

- `中间件（pre / post）就是：在“某个操作执行前 / 执行后，自动插一段你的代码”`

pre 钩子  —— 在操作「之前」

post 钩子 —— 在操作「之后」

```js
// 保存用户前，把密码加密
UserSchema.pre('save', function (next) {
  this.password = hash(this.password);
  next();
});

const user = new User({ password: '123456' });
await user.save();
```

- pre / post 的 this 是什么？

```js
schema.pre('save', function () {
  console.log(this); // 当前 document
});
```

- next() 是干嘛的？

老写法：
```js
schema.pre('save', function (next) {
  // 不调用 next()，流程就卡死
  next();
});
```

新写法（推荐）：
```js
schema.pre('save', async function () {
  await doSomething();
});
```
👉 async 函数自动 next

> MongoDB 没有中间件, Mongoose 才有中间件

## 四、Schema 设计

> MongoDB Schema 设计第一原则：先想“我怎么查”，再决定“我怎么存”。

| MySQL   | MongoDB         |
| ------- | --------------- |
| 表 + 外键  | 文档 + 嵌套         |
| JOIN 常态 | JOIN（$lookup）昂贵 |
| 结构固定    | 结构可演进           |
| 范式优先    | **查询优先**        |

1. 查询优先原则（Query First）,接口要不要 `$lookup`

2. 能内嵌就内嵌，不能再引用

```
1 : 1  → 内嵌
1 : 少量 N → 内嵌
1 : 大量 N → 引用
```

- 嵌套（Embed） vs 引用（Reference）

```js
// 嵌套 1. 强关联 2. 小数据量 3. 高频一起查
{
  orderId,
  items: [{ productId, price }]
}

// 引用 1. 数据量大 2. 生命周期不同 3. 多对多
{
  orderId,
  userId
}
```
| 场景      | 推荐 |
| ------- | -- |
| 用户 → 地址 | 内嵌 |
| 订单 → 商品 | 引用 |
| 渠道 → 门店 | 引用 |
| 用户 → 角色 | 引用 |

3. 少做 JOIN，多做冗余

> MongoDB 的冗余 ≠ 坏设计 - 不要塞太多（文档 16MB 限制）

4. 索引设计
    - 索引 = 服务于查询
    - 复合索引顺序
    - lookup 表必须有索引

### 4.1 事务一致性

> 事务 = 一组操作要么全部成功，要么全部失败回滚

`MongoDB 4.0` 以后才支持

解决：

- 跨文档一致性
- 跨集合一致性
- 并发安全（两个用户同时下单）

基础写法：

```js
const session = await mongoose.startSession();

try {
  session.startTransaction();

  await Order.create([{ ... }], { session });

  await Inventory.updateOne(
    { skuId },
    { $inc: { stock: -1 } },
    { session }
  );

  await session.commitTransaction();

} catch (err) {
  await session.abortTransaction();
} finally {
  session.endSession();
}
```

优雅写法：

```js
await session.withTransaction(async () => {
  await Order.create([{ ... }], { session });
  await Inventory.updateOne(
    { skuId },
    { $inc: { stock: -1 } },
    { session }
  );
});
```

### 4.2 ObjectId vs string

> 主键 / 关联字段：用 ObjectId; 业务编号 / 外部系统 ID：用 string

什么是 ObjectId？

```js
ObjectId("65f0c2a8e4c1a23c9b3c1234")
```

它内部包含 3 个信息：

| 部分      | 含义       |
| ------- | -------- |
| 时间戳     | 创建时间（秒级） |
| 机器 / 进程 | 分布式唯一    |
| 自增计数    | 防冲突      |

ObjectId vs string 的本质差别

| 对比点  | ObjectId | string     |
| ---- | -------- | ---------- |
| 存储空间 | 12 bytes | ≥ 24 bytes |
| 索引大小 | 小        | 大          |
| 查询性能 | 更快       | 较慢         |
| 排序   | 创建时间有序   | 无          |
| 跨系统  | 不友好      | 友好         |
| 人类可读 | 否        | 是          |

Schema 规范（推荐）

```js
{
  _id: ObjectId,              // Mongo 主键
  userId: ObjectId,           // 关联字段
  orderNo: string,            // 业务号
  externalId: string,         // 外部系统
}
```

### 4.3 文档无限膨胀

MongoDB 文档不是“越大越好”，一条文档如果不断被 $push、$set 追加字段，

会导致：性能下降、频繁搬迁、甚至写放大雪崩。

**设计上应遵循「主文档存状态，明细拆子集合」**

```js
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  logs: [ ... ],       // 不断 push
  comments: [ ... ],  // 不断 push
  history: {           // 不断 set 新 key
    "2024-01": {},
    "2024-02": {},
    "2024-03": {},
  }
}
```

1. MongoDB 文档有硬上限(单条文档最大：16MB)

2. 文档“搬家”

  - 文档初始分配一块空间

  - 后续 update 如果 放不下

  - 整条文档重新找地方写

解决方案：

✅ 方案 1：一对多，拆集合（最推荐）

- 文档大小稳定

- 可分页

- 可归档

- 可加 TTL

✅ 方案 2：有限数组（明确上限）

```js
logs: {
  type: [LogSchema],
  default: [],
  maxlength: 50
}

// 只保留最近 N 条
$push: {
  logs: {
    $each: [newLog],
    $slice: -50
  }
}
```

✅ 方案 3：Bucket 模式（进阶）

Bucket 模式 = 把“很多小记录”按规则装进“一个桶文档”里，一个桶有明确边界（时间 / 数量），满了就换新桶

```js
// ❌ 每条记录一个文档
logs
{
  userId,
  action,
  time
}
// ❌ 全塞进一个数组
{
  userId,
  logs: [ ... ] // 无限增长
}
```

- 最经典的时间 Bucket

```js
// user_activity_buckets
// 每天一个 bucket
// events 数量有限
{
  _id: ObjectId,
  userId: ObjectId,
  date: "2024-02-05",        // bucket key
  events: [
    {
      type: "click",
      targetId: "xxx",
      time: ISODate()
    }
  ],
  count: 123
}
// 写入逻辑
db.buckets.updateOne(
  { userId, date },
  {
    $push: {
      events: {
        $each: [newEvent],
        $slice: -500   // 只保留最近 500 条
      }
    }
    $inc: { count: 1 }
  },
  { upsert: true }
)
```

- 生产推荐

```js
// 超过 500 条 → bucketIndex + 1
{
  userId,
  date,
  bucketIndex: 0,
  events: []
}
```

查询 Bucket 的方式

```js
db.buckets.find({
  userId,
  date: "2024-02-05"
})
```

## 五、聚合管道（Aggregation Pipeline）

```js
原始文档
  ↓ $match（筛选）
  ↓ $lookup（关联）
  ↓ $unwind（拆数组）
  ↓ $group（统计）
  ↓ $project（整理结构）
  ↓ $sort / $skip / $limit
  ↓ 结果

Model.aggregate([
  { $match: {...} },
  { $lookup: {...} },
  { $unwind: {...} },
  { $group: {...} },
  { $project: {...} },
  { $sort: {...} },
  { $skip: 0 },
  { $limit: 10 }
]).exec()
```

- 顺序执行

- 上一步输出 = 下一步输入

- 每一步都是一个「Stage」

