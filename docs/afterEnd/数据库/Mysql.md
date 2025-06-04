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

- [数据库与关系型数据库概念](/after-end/数据库/mysql#数据库与关系型数据库概念)
  - [MySQL 安装与配置（本地或 Docker）](/after-end/数据库/mysql#mysql-安装与配置本地或-docker)
  - 使用工具：Navicat / DBeaver / MySQL Workbench
  - [基本数据类型](/after-end/数据库/mysql#12-基本数据类型)：INT、VARCHAR、TEXT、DATE、FLOAT 等
- 基本 SQL 操作：
  - CREATE TABLE、INSERT、SELECT、UPDATE、DELETE
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
SLECT * FROM users WHERE age > 18 AND salary >= 5000;
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

使用了 SELECT \* 和 GROUP BY 同时出现，但没有使用 `聚合函数`，这是 SQL 语法规范 中的大忌，尤其在 MySQL 的严格模式（如 ONLY_FULL_GROUP_BY）下会报错。

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
