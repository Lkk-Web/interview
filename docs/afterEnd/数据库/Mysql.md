---
group:
  # title: '后端'
order: 1
---

# Mysql

系统学习 MySQL，可以按照从基础概念到实战优化的路线，分阶段进行。以下是一套推荐的学习路线，适合前端开发人员或初学者从入门到进阶掌握：

✅ 第一阶段：基础入门

目标：理解数据库基础知识，掌握 MySQL 基本使用。

学习内容：

- [数据库与关系型数据库概念](/after-end/数据库/mysql#一数据库与关系型数据库概念)
  - [MySQL 安装与配置（本地或 Docker）](/after-end/数据库/mysql#11-mysql-安装与配置本地或-docker)
  - 使用工具：Navicat / DBeaver / MySQL Workbench
  - [基本数据类型](/after-end/数据库/mysql#12-基本数据类型)：INT、VARCHAR、TEXT、DATE、FLOAT 等
- 基本 SQL 操作：
  - [CREATE TABLE](/after-end/数据库/mysql#211-create-table)、[INSERT](/after-end/数据库/mysql#212-insert)、[SELECT](/after-end/数据库/mysql#213-select)、UPDATE、DELETE
  - 条件语句 WHERE、逻辑操作符 AND、OR、NOT
  - 排序 ORDER BY，分页 LIMIT
  - 聚合函数：COUNT、SUM、AVG、MAX、MIN
  - 分组 GROUP BY，过滤 HAVING

推荐资源： • `《MySQL 必知必会》` • `菜鸟教程 / 廖雪峰 SQL 教程` • `B 站 MySQL 入门教程`

✅ 第二阶段：进阶应用

目标：掌握数据库设计和多表操作，熟悉事务与索引。

学习内容：

- 数据库三大范式
  - 表与表之间的关系（1 对 1、1 对多、多对多）
- 多表查询（重点）：
  - JOIN：INNER JOIN、LEFT JOIN、RIGHT JOIN
- 子查询
- 事务（Transaction）与 ACID 特性
- 锁机制（行锁、表锁、意向锁）
- 索引（重点）：
  - 索引的原理（B+ 树）
  - 普通索引、唯一索引、联合索引、全文索引
  - 覆盖索引、最左前缀原则

推荐资源： `《高性能 MySQL》`

✅ 第三阶段：性能优化与实战

目标：具备实际项目中优化能力，能处理慢查询和大数据量问题。

学习内容：

- SQL 执行计划 EXPLAIN
- 慢查询日志分析
- 优化查询语句的技巧（避免 SELECT \*，合理使用索引）
- 表结构优化（字段类型选择、字段拆分）
- 读写分离、主从复制原理
- 分库分表的基本思想
- 常见数据库调优参数
- MySQL 常见问题排查

## 一、数据库与关系型数据库概念

### 1.1 MySQL 安装与配置（本地或 Docker）

#### 本地安装

1. 📘 macOS 设置 MySQL 本地 root 用户密码指南

🔧 适用环境

- 系统：macOS
- 数据库：MySQL（支持 5.x 和 8.x 以上）
- 数据库客户端（可选）：Navicat、命令行等

🚀 步骤一：登录 MySQL

如果你是用 Homebrew 安装的，运行：`brew services list`

如果 MySQL 是 stopped，执行启动命令：`brew services start mysql`

```sql
-- 无密码时：
mysql -u root
-- 如果已有密码：
mysql -u root -p --系统会提示输入密码。

```

🔐 步骤二：设置或修改 root 密码

✅ 适用于 MySQL 8.0+ 的命令：

```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'YourNewPassword123!';
FLUSH PRIVILEGES;
```

✅ 适用于 MySQL 5.x 的命令（如果上面报错可尝试此方式）：

```sql
SET PASSWORD FOR 'root'@'localhost' = PASSWORD('YourNewPassword123!'); FLUSH PRIVILEGES;
```

✅ 步骤三：退出并测试登录

`exit`

然后重新登录测试：

`mysql -u root -p`

输入刚才设置的新密码，能成功进入即表示密码设置成功。

#### Docker 安装

[Docker 安装](/after-end/运维/docker#一docker-连接-mysql)

#### 其他操作

1. 修改数据库用户密码

```sql
ALTER USER '用户名'@'主机' IDENTIFIED BY '新密码';
```

### 1.2 基本数据类型

#### 1. 整数类型

| 类型        | 字节数 | 有符号范围 (SIGNED)             | 无符号范围 (UNSIGNED) |
| ----------- | ------ | ------------------------------- | --------------------- |
| TINYINT     | 1      | -128 到 127                     | 0 到 255              |
| SMALLINT    | 2      | -32,768 到 32,767               | 0 到 65,535           |
| MEDIUMINT   | 3      | -8,388,608 到 8,388,607         | 0 到 16,777,215       |
| INT/INTEGER | 4      | -2,147,483,648 到 2,147,483,647 | 0 到 4,294,967,295    |
| BIGINT      | 8      | -2^63 到 2^63-1                 | 0 到 2^64-1           |

> ✅ 可选属性：`UNSIGNED`（无符号），`ZEROFILL`（用 0 补齐）

---

#### 2. 浮点类型

| 类型         | 描述                     |
| ------------ | ------------------------ |
| FLOAT(M,D)   | 单精度浮点数（4 字节）   |
| DOUBLE(M,D)  | 双精度浮点数（8 字节）   |
| DECIMAL(M,D) | 精确小数，常用于财务计算 |
| NUMERIC(M,D) | DECIMAL 的同义词         |

> `M` 是总位数，`D` 是小数位数，例如：`DECIMAL(10,2)` 表示总共 10 位，其中 2 位小数。

---

#### 3.日期和时间类型（Date and Time Types）

| 类型      | 格式                 | 描述                  |
| --------- | -------------------- | --------------------- |
| DATE      | YYYY-MM-DD           | 日期                  |
| TIME      | HH:MM:SS             | 时间                  |
| DATETIME  | YYYY-MM-DD HH:MM:SS  | 日期 + 时间           |
| TIMESTAMP | 同上（支持时区转换） | 自动记录创建/修改时间 |
| YEAR      | YYYY（1901 到 2155） | 年份                  |

---

#### 4.字符串类型（String / Text / Binary）

##### 字符串类型

| 类型       | 最大长度        | 描述                   |
| ---------- | --------------- | ---------------------- |
| CHAR(n)    | 最多 255 字符   | `固定长度`，不足补空格 |
| VARCHAR(n) | 最多 65535 字节 | 可变长度，不足不补     |

> 一般使用 `VARCHAR`，节省空间。

---

##### 文本类型（Text）

| 类型       | 最大长度           | 描述     |
| ---------- | ------------------ | -------- |
| TINYTEXT   | 255 字节           | 超小文本 |
| TEXT       | 65,535 字节        | 普通文本 |
| MEDIUMTEXT | 16,777,215 字节    | 中等文本 |
| LONGTEXT   | 4,294,967,295 字节 | 超大文本 |

---

##### 二进制类型（Binary）

| 类型            | 描述                           |
| --------------- | ------------------------------ |
| BINARY(n)       | 定长二进制数据                 |
| VARBINARY(n)    | 可变长度二进制数据             |
| TINYBLOB/BLOB/… | 存储二进制数据（图像、音频等） |

---

#### 5.枚举与集合类型（ENUM / SET）

| 类型              | 描述              |
| ----------------- | ----------------- |
| ENUM('A','B','C') | 单选，最多选 1 项 |
| SET('A','B','C')  | 多选，可选多个值  |

---

### 1.3 MySQL 远程访问配置

一、修改配置文件（允许监听所有 IP）

编辑 `/opt/homebrew/etc/my.cnf` 或其他实际生效的配置文件：

```sh
[mysqld]
port = 3306
bind-address = 0.0.0.0
sql_mode = STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION
```

配置没有生效时，可以检查是否有其他实际生效的配置文件

```sh
mysql --help | grep -A 1 "Default options"

# output

Default options are read from the following files in the given order:
/etc/my.cnf /etc/mysql/my.cnf /opt/homebrew/etc/my.cnf ~/.my.cnf
```

你看到的顺序是：

```sh
/etc/my.cnf
/etc/mysql/my.cnf
/opt/homebrew/etc/my.cnf
~/.my.cnf
```

说明 MySQL 会依次读取这些配置文件，后面的会覆盖前面的配置。检查并编辑所有这些配置文件，尤其是`/opt/homebrew/etc/my.cnf`

二、确认端口监听状态

检查 3306 是否监听 `*`：

```sh
sudo lsof -iTCP -sTCP:LISTEN -P | grep 3306

# output:
mysqld ... TCP *:3306 (LISTEN)
```

三、‼️ 给远程用户授权访问

- 创建并授权远程用户（指定 IP）：

```sql
CREATE USER 'userName'@'192.168.31.152' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON *.* TO 'userName'@'192.168.31.152' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```

- 允许所有 IP（不推荐生产使用）：

```sql
CREATE USER 'userRootName'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON *.* TO 'userRootName'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```

查看所有用户权限：

```sql
SELECT host, user FROM mysql.user;
```

四、远程连接测试

```sh
mysql -h mysqlIP -P 3306 -u userName -p
```

## 二、基本 SQL 操作

### 2.1 基本 sql 语句

#### 2.1.1 CREATE TABLE

`CREATE TABLE` 语句用于创建数据库中的表。

```sql
CREATE TABLE 表名 (
    列名1 数据类型 [列约束],
    列名2 数据类型 [列约束],
    ...
    [表级约束]
);
```

✅ `常见列约束（Column Constraints）`

| 约束名           | 说明                                      |
| ---------------- | ----------------------------------------- |
| `PRIMARY KEY`    | 主键，唯一且非空                          |
| `NOT NULL`       | 不允许为空                                |
| `UNIQUE`         | 值必须唯一                                |
| `DEFAULT 值`     | 设置默认值                                |
| `AUTO_INCREMENT` | 自动增长（一般用于主键）                  |
| `CHECK (条件)`   | 检查约束，限定取值范围（MySQL 8.0+ 支持） |
| `COMMENT '注释'` | 字段注释                                  |

✅ `常见表级约束（Table Constraints）`

| 约束名                                   | 说明                                         |
| ---------------------------------------- | -------------------------------------------- |
| `PRIMARY KEY (列名1, 列名2)`             | 联合主键约束                                 |
| `UNIQUE (列名1, 列名2)`                  | 联合唯一约束                                 |
| `FOREIGN KEY (外键列) REFERENCES 表(列)` | 外键约束，建立与其他表之间的引用关系         |
| `CHECK (列名 IN ('值1', '值2'))`         | 表级检查约束，定义数据取值范围（MySQL 8.0+） |

- 示例建表语句

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL,
  age TINYINT UNSIGNED,
  salary DECIMAL(10, 2),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  status ENUM('active', 'inactive') DEFAULT 'active'
);
```

#### 2.1.2 INSERT

`INSERT` 是 SQL 中用于向表中插入数据的语句。

```sql
INSERT INTO 表名 (列1, 列2, ..., 列N)
VALUES (值1, 值2, ..., 值N);
```

- 表名：要插入数据的目标表。
- (列 1, ..., 列 N)：可选，指定要插入的列名（推荐写）。
- (值 1, ..., 值 N)：与列顺序匹配的数据值。

1. 插入一条完整记录

```sql
INSERT INTO `test-learnSql`.`USER` (`id`,`username`, `age`, `salary`, `created_at`,`status`)
VALUES (2,'6666', 12, '12', '2025-04-02 13:56:39','active');
```

2. 插入部分字段（剩余字段会用默认值或 NULL）

```sql
INSERT INTO `test-learnSql`.`USER` (`username`, `age`)
VALUES ('Bob', 22);
```

3. 插入多条记录（批量插入）

```sql
INSERT INTO `test-learnSql`.`USER` (`id`,`username`, `age`, `salary`, `created_at`,`status`)
VALUES
  (1,'6666', 12, '12', '2025-04-02 13:56:39','active'),
  (2,'6666', 12, '12', '2025-04-02 13:56:39', Null );
```

4. 插入子查询结果

```sql
INSERT INTO new_table (id, username)
SELECT id, username FROM old_table WHERE age > 18;
```

5. INSERT IGNORE

忽略违反唯一性约束的插入，出错时跳过。

```sql
INSERT IGNORE INTO students (id, name) VALUES (1, 'Tom');
```

6. INSERT ... ON DUPLICATE KEY UPDATE

如果主键或唯一键冲突，就更新已有记录。

```sql
INSERT INTO students (id, name, age)
VALUES (1, 'Tom', 21)
ON DUPLICATE KEY UPDATE age = VALUES(age);
```

#### 2.1.3 SELECT

SELECT 是 SQL 中最核心、最常用的语句之一，用于从数据库中`查询数据`。支持`筛选、排序、聚合、分组、连接、分页`等多种操作。

```sql
SELECT 列名1, 列名2, ... FROM 表名
WHERE 条件A
  AND 条件B
  AND 条件C
GROUP BY 分组列
HAVING 分组后的条件
ORDER BY 排序列 ASC|DESC
LIMIT 限制数量 OFFSET 偏移;
```

1. 查询所有列

```sql
SELECT * FROM users;
```

`*` 表示所有列，不推荐用于生产查询（不明确、性能较差）。

2. 查询指定列

```sql
SELECT id, username, age FROM users;
```

3. 使用 WHERE 进行条件过滤

```sql
SELECT * FROM users WHERE age > 18 AND salary >= 5000;
```

- SQL 常用运算符整理

✅ 比较运算符（用于 WHERE / HAVING 子句）

| 运算符 | 含义            | 示例            |
| ------ | --------------- | --------------- |
| =      | 等于            | `age = 18`      |
| <>     | 不等于（MySQL） | `gender <> 'F'` |
| !=     | 不等于（ANSI）  | `score != 100`  |
| >      | 大于            | `score > 60`    |
| >=     | 大于等于        | `age >= 18`     |
| <      | 小于            | `salary < 5000` |
| <=     | 小于等于        | `age <= 30`     |

✅ 逻辑运算符（多条件组合）

| 运算符 | 含义    | 示例                                    |
| ------ | ------- | --------------------------------------- |
| AND    | 并且    | `age > 18 AND gender = 'M'`             |
| OR     | 或者    | `city = 'Beijing' OR city = 'Shanghai'` |
| NOT    | 非/取反 | `NOT (score >= 60)`                     |

✅ 范围 / 集合 / 模糊匹配

| 运算符              | 含义               | 示例                                  |
| ------------------- | ------------------ | ------------------------------------- |
| BETWEEN ... AND ... | 区间范围（含边界） | `age BETWEEN 18 AND 25`               |
| IN (...)            | 属于集合中的某个值 | `city IN ('Beijing', 'Shanghai')`     |
| NOT IN (...)        | 不属于集合         | `status NOT IN ('banned', 'deleted')` |
| LIKE                | 模糊匹配           | `name LIKE 'A%'` （以 A 开头）        |
| %                   | 任意多个字符       | `LIKE '%abc%'` 包含 abc               |
| \_                  | 任意一个字符       | `LIKE 'a_c'` 匹配 "abc", "acc" 等     |

---

✅ 空值判断

| 运算符      | 含义     | 示例                |
| ----------- | -------- | ------------------- |
| IS NULL     | 是空值   | `email IS NULL`     |
| IS NOT NULL | 不是空值 | `phone IS NOT NULL` |

---

✅ 其他运算符

| 运算符      | 含义                                | 示例                   |
| ----------- | ----------------------------------- | ---------------------- |
| ｜｜        | 字符串拼接（部分数据库，如 Oracle） | `'Hello' ｜｜ 'World'` |
| +, -, \*, / | 数学运算符                          | `price * quantity`     |

> 注：MySQL 中字符串拼接使用 `CONCAT(a, b)` 函数而不是 `||`。

##### GROUP BY 分组

```sql
SELECT * FROM `USER`
WHERE 条件
GROUP BY age;
```

使用了 SELECT \* 和 GROUP BY 同时出现，但没有使用 `聚合函数`，这是 SQL 语法规范中的大忌，尤其在 MySQL 的严格模式（如 ONLY_FULL_GROUP_BY）下会报错。

1. ✅ 方式一：聚合 + 显式字段（推荐）

必须明确告诉数据库 每个字段在分组后的处理方式，例如：

```sql
SELECT   age,
  MIN(id) AS id,
  MIN(username) AS username,
  MIN(status) AS status,
  MIN(username) AS username,
  COUNT(*) AS user_count FROM `USER`
WHERE age > 19  AND age BETWEEN 10 AND 100 AND status AND username LIKE '66_6'
GROUP BY age;
```

📌 用 MIN() 或 MAX() 是为了在每个分组中取某一行的代表值。

⚠️ 注意：分组后每一行其实代表“多个用户”，除非你聚合，否则没法“带出一整行”。

1. ✅ 方式二：取每组的第一条完整记录（复杂但更精确）

##### SQL 聚合函数（COUNT, MAX, MIN, SUM, AVG）

聚合函数（Aggregate Functions）用于对一列或多列的数据执行计算，并返回`一个单一值`。它们常与 `GROUP BY` 一起使用。

✅ 1. COUNT() —— 计数

- 统计符合条件的行数。

```sql
SELECT COUNT(*) FROM `USER`;
```

✅ 2. SUM() —— 求和

- 对指定列的数值求和。

## 三、进阶应用

### 3.2 多表查询

JOIN 是 SQL 中用于连接两个或多个表的关键字，目的是：👉 把它们按某个“关联字段”合并成一张逻辑表进行查询或更新。（JOIN 就像“合并表格”）

| 名称   | 类型       | 作用                                   |
| ------ | ---------- | -------------------------------------- |
| 内连接 | INNER JOIN | 只保留 左右表都匹配的数据（最常用 ✅） |
| 左连接 | LEFT JOIN  | 保留左表全部数据，右表没有则为 NULL    |
| 右连接 | RIGHT JOIN | 保留右表全部数据，左表没有则为 NULL    |

#### 3.2.1 INNER JOIN 内连接

在 SQL 中，`JOIN` 默认就是 `INNER JOIN` 的简写形式。

返回 A 和 B 中 a 和 b 同时匹配的记录,不匹配的记录（左表或右表没有匹配的）都会被过滤掉

```sql
SELECT *
FROM A
INNER JOIN B
  ON A.a = B.a
  AND A.b = B.b;
```

#### 3.2.2 LEFT JOIN 左连接

LEFT JOIN 用于返回左表 A 中的所有记录，即使在右表 B 中没有匹配也会保留；右表 B 无匹配的字段将以 NULL 填充。

```sql
SELECT *
FROM A
LEFT JOIN B
  ON A.a = B.a
  AND A.b = B.b;
```

- 匹配成功的 A 和 B 记录 ✅ 会合并返回；
- 只在 A 表中存在、B 表中没有匹配的记录也会返回，B 的字段填 NULL；

```tsx
import React from 'react';
import { Image } from 'interview';

export default () => <Image title="" path={'leftJoin'}></Image>;
```

## 四、Doris 技术细节

Doris（Apache Doris）是一个面向 `OLAP` 场景的实时分析型数据库，核心定位是：

- 高并发 SQL 查询
- 实时数据分析
- 多维聚合查询
- 报表 / BI / 指标看板
- 明细 + 聚合混合分析

它并不是 MySQL 的替代品，更准确地说：

- MySQL 更偏 `OLTP`
- Doris 更偏 `OLAP`

也就是：

- MySQL 适合事务处理、订单系统、用户系统、后台管理系统
- Doris 适合日志分析、实时大屏、指标查询、数仓明细查询

### 4.1 Doris 是什么

一句话理解：

> Doris 是一个支持 MySQL 协议、列式存储、MPP 架构、适合实时分析场景的分布式 OLAP 数据库。

其特点主要有：

1. 支持标准 SQL，接入成本低
2. 支持 MySQL 协议，BI 工具友好
3. 列式存储，适合聚合分析
4. MPP 分布式查询，适合大数据量并行计算
5. 支持实时导入和近实时查询
6. 支持明细模型、聚合模型、主键模型等多种数据模型

### 4.2 Doris 和 MySQL 的区别

| 对比项       | MySQL              | Doris                     |
| ------------ | ------------------ | ------------------------- |
| 核心定位     | OLTP               | OLAP                      |
| 典型场景     | 事务、增删改查     | 报表、分析、数仓查询      |
| 存储方式     | 行存为主           | 列存为主                  |
| 查询特点     | 点查、短事务       | 聚合、扫描、大查询        |
| 更新方式     | 高频更新友好       | 批量导入 / 局部更新更常见 |
| 架构         | 单机/主从/分库分表 | 分布式 MPP                |
| JOIN 能力    | 事务型多表关联     | 分析型 JOIN               |
| 并发分析能力 | 一般               | 较强                      |
| 适合大宽表   | 一般               | 很适合                    |

MySQL 擅长的是：

- 单行读写
- 主键查询
- 事务一致性
- 高频更新

Doris 擅长的是：

- 海量数据扫描
- 多维聚合
- 秒级报表
- 高并发分析查询

### 4.3 Doris 的整体架构

Doris 的核心架构角色主要有两个：

1. FE（Frontend）
2. BE（Backend）

#### 4.3.1 FE 节点

FE 主要负责：

- 元数据管理
- SQL 解析
- 查询优化
- 查询计划生成
- 集群管理
- 权限管理
- 事务协调

可以理解为 Doris 的“大脑”。

FE 通常又分：

- Leader FE
- Follower FE
- Observer FE

##### Leader FE

负责：

- 元数据写入
- DDL 执行
- 集群状态协调

##### Follower FE

负责：

- 同步元数据
- 参与选主
- 查询服务

##### Observer FE

负责：

- 同步元数据
- 提供查询能力
- 不参与选主

#### 4.3.2 BE 节点

BE 主要负责：

- 数据存储
- 查询执行
- 数据压缩
- Compaction
- 导入任务执行
- 副本管理

可以理解为 Doris 的“计算 + 存储执行层”。

#### 4.3.3 Broker（可选）

Broker 主要用于外部存储系统接入，例如：

- HDFS
- S3
- OSS

现在很多场景也可以通过更轻量方式直接导入，不一定强依赖 Broker。

### 4.4 Doris 为什么快

Doris 快的核心原因通常来自下面几个方面：

#### 4.4.1 列式存储

列存的优势在分析场景下非常明显。

例如一张宽表有 100 列，但查询只需要 3 列：

- 行存：往往需要把整行更多数据读出来
- 列存：只读取需要的列

这会显著减少：

- 磁盘 IO
- 内存占用
- 网络传输

#### 4.4.2 向量化执行

Doris 会以批量数据块的方式处理数据，而不是逐行解释执行。

这样可以：

- 更好利用 CPU cache
- 降低函数调用开销
- 提升批处理效率

#### 4.4.3 MPP 并行计算

MPP（Massively Parallel Processing）即大规模并行处理。

它的特点是：

- 一个 SQL 被拆成多个执行片段
- 分发到多个 BE 节点并行执行
- 最后汇总结果返回

所以 Doris 在大数据量聚合上通常比单机 MySQL 更有优势。

#### 4.4.4 预聚合与数据模型优化

在合适模型下，Doris 可以减少重复聚合成本。

例如聚合模型（Aggregate Key）可以在导入阶段先做部分聚合，查询时开销更小。

### 4.5 Doris 的数据模型

Doris 常见表模型主要有：

1. Duplicate Key
2. Aggregate Key
3. Unique Key
4. Primary Key

#### 4.5.1 Duplicate Key

明细模型，保留所有原始数据行，不做去重。

适合：

- 行为日志
- 事件流水
- 明细报表
- 埋点数据

特点：

- 导入简单
- 查询灵活
- 存储量通常更大

#### 4.5.2 Aggregate Key

聚合模型，会按 Key 列进行聚合，Value 列执行聚合函数。

适合：

- 预汇总指标
- 报表统计
- 需要降低存储和查询成本的聚合场景

示意：

```sql
CREATE TABLE sales_agg (
  dt DATE,
  city VARCHAR(20),
  amount BIGINT SUM
)
AGGREGATE KEY(dt, city)
DISTRIBUTED BY HASH(dt, city) BUCKETS 8;
```

#### 4.5.3 Unique Key

唯一键模型，逻辑上保留同一 Key 的最新一份数据。

适合：

- 用户画像
- 商品快照
- 维表数据

#### 4.5.4 Primary Key

主键模型是 Doris 后续增强的一种更适合更新场景的模型。

特点：

- 更适合高频 UPSERT
- 支持主键级别的更新覆盖
- 查询体验更接近实时明细系统

适合：

- 需要增量更新的宽表
- 用户状态表
- 实时标签表

### 4.6 分区与分桶

Doris 建表设计里两个非常关键的概念是：

1. 分区（Partition）
2. 分桶（Bucket）

#### 4.6.1 分区

分区是逻辑层面的数据切分，最常见按时间分区：

- 按天
- 按月
- 按小时

好处：

- 查询可做分区裁剪
- 历史数据管理更方便
- 删除旧数据更简单

例如：

```sql
PARTITION BY RANGE(dt) (
  PARTITION p202504 VALUES [('2025-04-01'), ('2025-05-01')),
  PARTITION p202505 VALUES [('2025-05-01'), ('2025-06-01'))
)
```

#### 4.6.2 分桶

分桶是物理层面的数据打散，常通过 HASH 把数据打到多个 tablet 中。

例如：

```sql
DISTRIBUTED BY HASH(user_id) BUCKETS 16
```

作用：

- 提升并行度
- 平衡 BE 节点负载
- 提高查询性能

#### 4.6.3 分区与分桶怎么选

一般建议：

- 分区字段优先选时间字段
- 分桶字段优先选高基数字段 / 高频过滤字段 / JOIN 字段

注意：

- 分区过多会增加元数据压力
- 分桶过少并行度不够
- 分桶过多会造成小文件 / 小 tablet 问题

### 4.7 Tablet 与副本

Tablet 是 Doris 中非常核心的存储单元。

可以简单理解为：

- 一个分区里的一个 bucket，对应一个 tablet
- tablet 会在多个 BE 上保存多个副本

例如：

- 一张表 3 个分区
- 每个分区 8 个 bucket
- 副本数为 3

那么：

- tablet 数 = 3 × 8 = 24
- 物理副本数 = 24 × 3 = 72

#### 4.7.1 副本的作用

副本的主要价值：

- 容灾
- 提高可用性
- 提升读取并行能力

#### 4.7.2 副本一致性

Doris 并不是像 MySQL 主从那样做传统复制，而是以 tablet 副本为单位进行管理。

写入成功通常要求满足一定副本写入条件，FE 会维护元数据视图，BE 负责副本实际落盘。

### 4.8 Doris 的查询执行流程

一个 Doris SQL 通常会经历：

1. Client 发起 SQL
2. FE 接收请求
3. FE 解析 SQL
4. FE 做语法分析、权限校验、优化器生成执行计划
5. FE 将计划拆成多个 fragment
6. 下发到多个 BE 并行执行
7. BE 扫描本地 tablet，做过滤、聚合、JOIN 等处理
8. 最终结果汇总返回给客户端

这也是 Doris 天然适合大查询的原因。

### 4.9 Doris 常见导入方式

Doris 支持多种导入方式，常见的有：

1. Stream Load
2. Broker Load
3. Routine Load
4. Insert Into Select
5. Flink / Spark 导入

#### 4.9.1 Stream Load

通过 HTTP 接口导入，适合：

- 小批量实时导入
- 服务端程序直接推送

特点：

- 使用简单
- 实时性较好
- 常用于业务侧微批导入

#### 4.9.2 Broker Load

适合从对象存储 / HDFS 等批量导入大文件。

适合：

- 离线批处理
- 大文件导入

#### 4.9.3 Routine Load

常用于持续消费 Kafka 数据。

这在实时数仓中非常常见。

适合：

- 实时日志
- 埋点数据
- 消息队列实时入库

#### 4.9.4 Insert Into Select

适合在 Doris 内部做数据转换、结果落表。

### 4.10 Doris 的存储与压缩

Doris 采用列式存储后，每列可以独立编码和压缩。

常见收益：

- 降低存储成本
- 减少扫描数据量
- 提升聚合性能

它还会基于数据版本管理和 Compaction 合并小版本。

#### 4.10.1 Compaction

Compaction 可以理解为：

- 合并小文件
- 合并小版本
- 清理历史冗余版本
- 提升查询性能

如果导入过于频繁、版本过多，Compaction 压力会很大。

这也是 Doris 运维里一个高频关注点。

### 4.11 Doris 中的索引能力

Doris 不是传统 MySQL 那种以 B+ 树索引为核心的数据库。

它更依赖：

- 列式存储
- 分区裁剪
- 前缀索引
- ZoneMap
- Bitmap Index
- BloomFilter
- 倒排索引（部分版本能力）

#### 4.11.1 前缀索引

Doris 会对 Key 列构建前缀索引，用于提升过滤效率。

#### 4.11.2 ZoneMap

ZoneMap 会记录数据块的最小值、最大值等统计信息。

查询时如果条件与数据块范围不匹配，可以直接跳过扫描。

这本质上是一种“数据块裁剪”能力。

#### 4.11.3 Bitmap Index

适合低基数字段，例如：

- 性别
- 状态
- 枚举值

#### 4.11.4 BloomFilter

适合提升高基数字段的等值过滤性能。

### 4.12 Doris 的 JOIN 与查询限制

虽然 Doris 支持 SQL JOIN，但在使用上和 MySQL 还是不一样。

#### 4.12.1 适合的 JOIN

适合：

- 事实表 + 小维表
- 多维分析查询
- 报表类 JOIN

#### 4.12.2 不适合的 JOIN

不太适合：

- 高并发事务型多表更新
- 极复杂、极高基数的大宽表随意 JOIN
- 替代业务数据库的频繁单点查询

### 4.13 Doris 的适用场景

非常适合：

1. 实时数仓
2. BI 报表
3. 指标平台
4. 用户行为分析
5. 埋点日志查询
6. 运营数据大盘
7. 广告 / 推荐分析
8. 明细 + 聚合混合查询

### 4.14 Doris 不适合的场景

不适合：

1. 高频事务写入
2. 强事务订单系统
3. 银行转账类 ACID 强一致业务
4. 高并发单行更新业务
5. 纯 OLTP 场景

### 4.15 Doris 与数据仓库分层的关系

在企业里，Doris 常常扮演的是：

- 实时查询层
- ADS / 服务层
- 即席分析层
- 明细查询层

它经常和这些组件配合：

- Kafka
- Flink
- MySQL
- Hive
- Spark
- ES

典型链路：

```bash
业务库 MySQL -> CDC / Kafka -> Flink 清洗 -> Doris
```

或者：

```bash
日志 / 埋点 -> Kafka -> Routine Load / Flink -> Doris -> BI 看板
```

### 4.16 Doris 常见面试题

#### 4.16.1 Doris 和 MySQL 的本质区别是什么

核心回答：

- MySQL 是面向事务的 OLTP 数据库
- Doris 是面向分析的 OLAP 数据库
- MySQL 更适合点查和事务
- Doris 更适合聚合、扫描、分布式分析

#### 4.16.2 Doris 为什么查询快

核心回答：

- 列式存储
- 向量化执行
- MPP 并行计算
- 分区裁剪
- ZoneMap / 前缀索引 / Bitmap 等能力

#### 4.16.3 Doris 的 FE 和 BE 分别做什么

核心回答：

- FE：元数据、SQL 解析、优化、调度、集群管理
- BE：数据存储、查询执行、导入执行、Compaction、副本管理

#### 4.16.4 Doris 的分区和分桶分别解决什么问题

核心回答：

- 分区：逻辑裁剪、生命周期管理
- 分桶：物理并行、负载均衡

#### 4.16.5 Doris 为什么适合做实时数仓查询层

核心回答：

- 支持近实时导入
- 查询延迟低
- SQL 友好
- BI 工具接入方便
- 适合大宽表和聚合场景

### 4.17 总结

可以把 Doris 理解成：

> 一个更适合“查很多数据、做很多聚合、做实时分析”的数据库，而不是负责事务增删改查的业务主库。

如果从工程角度看，Doris 最重要的几个关键词是：

- OLAP
- 列存
- MPP
- FE / BE
- 分区分桶
- Tablet 副本
- 实时导入
- 查询加速

如果面试或实际项目中要讲 Doris，建议优先讲清楚这几个问题：

1. Doris 解决什么问题
2. Doris 和 MySQL / ES / Hive 的差异
3. Doris 为什么快
4. Doris 的 FE / BE 架构
5. Doris 的分区、分桶、模型设计
6. Doris 适合与不适合的业务场景
