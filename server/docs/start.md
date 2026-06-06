# 启动与本地开发

## 1. 准备 PostgreSQL

你已经在本地 Docker 启动了 PostgreSQL，端口是 `5432`，数据库名是 `interview`。

文档里不写真实密码，真实配置只放在 `.env`。

## 2. 配置环境变量

```bash
cd /Users/liukangkai/Desktop/github/interview/server
cp .env.example .env
```

编辑 `.env`：

```text
APP_ENV=development
HTTP_ADDR=:8080
DATABASE_DSN=host=localhost user=<postgres-user> password=<postgres-password> dbname=interview port=5432 sslmode=disable TimeZone=Asia/Shanghai
ADMIN_TOKEN=<your-local-admin-token>
ALLOWED_ORIGINS=http://localhost:8000,http://localhost:8080
MIGRATIONS_DIR=./migrations
```

`.env` 已被 `.gitignore` 忽略，不要提交。

## 3. 安装依赖

```bash
cd /Users/liukangkai/Desktop/github/interview/server
GOTOOLCHAIN=local GOPROXY=https://goproxy.cn,direct go mod tidy
```

## 4. 导入股票 JSON

```bash
cd /Users/liukangkai/Desktop/github/interview/server
GOTOOLCHAIN=local GOPROXY=https://goproxy.cn,direct GOSUMDB=sum.golang.google.cn go run ./cmd/importer -data-dir ../data/stock
```

这个命令会：

1. 读取 `.env`。
2. 连接 PostgreSQL。
3. 自动执行 `migrations/*.sql`。
4. 读取 `../data/stock/*.json`。
5. 写入 stock 相关表。

## 5. 启动 API

```bash
cd /Users/liukangkai/Desktop/github/interview/server
GOTOOLCHAIN=local GOPROXY=https://goproxy.cn,direct GOSUMDB=sum.golang.google.cn go run ./cmd/api
```

启动成功后访问：

```bash
curl http://localhost:8080/api/health
curl http://localhost:8080/api/stock/dashboard
```

管理接口需要 token：

```bash
curl -H "Authorization: Bearer <your-local-admin-token>" http://localhost:8080/api/admin/health
```
