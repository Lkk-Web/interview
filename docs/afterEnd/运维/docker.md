# Docker

## 安装 Docker（macOS）

1. 前往官网下载安装 Docker Desktop： 👉 https://www.docker.com/products/docker-desktop/
2. 安装后启动 Docker Desktop，首次运行可能需要输入管理员密码授权。
3. 成功启动后，系统顶部菜单栏会显示 🐳 图标，提示 Docker is running。

## 一、Docker 连接 MySQL

1. `拉取 MySQL 镜像`

在终端中输入以下命令：

```bash
docker pull mysql:8.0 #也可以选择其他版本，如 mysql:5.7。
```

2. `运行 MySQL 容器`

执行以下命令启动 MySQL：

```bash
docker run -d \
 --name my-mysql \
 -e MYSQL_ROOT_PASSWORD=123456 \
 -p 3306:3306 \
 mysql:8.0
```

参数说明：

- --name my-mysql：指定容器名称
- -e MYSQL_ROOT_PASSWORD=123456：设置 root 密码
- -p 3306:3306：将宿主机的 3306 映射到容器内部 3306 (本地已有 MySQL 服务占用，连接时端口改为 3307. 使用 -p 3307:3306)
- -d：后台运行容器

3. `连接 MySQL`

使用 GUI 工具（如 Navicat、DBeaver）

- 主机地址（Host）：127.0.0.1
- 端口（Port）：3307
- 用户名（User）：root
- 密码（Password）：123456

4. `查看容器运行状态`

查看正在运行的容器 `docker ps`

查看所有容器（包括已停止的）`docker ps -a`

查看容器日志 `docker logs my-mysql`

5. `Docker 安装 MySQL vs 系统本地安装 MySQL`

| 比较项     | Docker 安装                 | 本地安装                         |
| ---------- | --------------------------- | -------------------------------- |
| 安装方式   | 一条命令快速拉取            | 图形界面或命令行手动安装         |
| 多版本共存 | 容器隔离，轻松实现          | 一般不支持多版本，需复杂配置     |
| 卸载与清理 | 删除容器即可，干净利落      | 卸载可能残留数据、配置、服务     |
| 环境隔离   | 高度隔离，不影响宿主系统    | 与系统深度耦合，容易影响整体环境 |
| 配置复杂度 | 简单，环境即开即用          | 需要手动配置环境变量、路径等     |
| 重装与迁移 | 镜像+挂载卷，易于迁移与备份 | 数据迁移复杂，易出错             |
| 推荐用途   | 开发、测试、学习、临时环境  | 稳定运行、长期部署、生产环境     |

### 1.1 Docker 环境下登录 MySQL

- 步骤一：查看 MySQL 容器的名称或 ID

服务器上执行：

```sh
docker ps

# 输出如下

CONTAINER ID   IMAGE        COMMAND                  ...   NAMES
a1b2c3d4e5f6   mysql:8.0    "docker-entrypoint.s…"  ...   docker-mysql
```

- 步骤二：进入容器内部

```sh
docker exec -it docker-mysql bash
```

- 步骤三：登录 MySQL 命令行

```sh
mysql -u root -p
# 成功进入后如下：
mysql>
```

- 步骤四：授予远程访问权限

```sql
GRANT ALL PRIVILEGES ON *.* TO 'root'@'223.159.66.23' IDENTIFIED BY 'sql_password' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```

223.159.66.23 为需要访问数据库的 本机 ip

- 步骤五：查看数据库用户权限

```sql
SELECT host, user FROM mysql.user WHERE user = 'root';
```

## 二、Docker Volume 映射

Volume 映射就是在 docker run 或 docker-compose 时，把宿主机的目录挂载到容器的某个目录中。

- `-v 宿主机路径:容器路径`

Nginx 会访问“容器路径”，但实际访问的是“宿主机路径”的文件。

```sh
docker run -d \
  --name my-openresty \
  -v /home/index:/home/index \
  -p 80:80 \
  -p 443:443 \
  openresty/openresty:alpine
```
