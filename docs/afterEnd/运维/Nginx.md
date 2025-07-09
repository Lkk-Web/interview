# Nginx

Nginx 功能丰富，可作为 HTTP 服务器，也可作为反向代理服务器，邮件服务器。支持 FastCGI、SSL、Virtual Host、URL Rewrite、Gzip 等功能。并且支持很多第三方的模块扩展。

| 阶段 | 内容                                       | 能力体现                          |
| ---- | ------------------------------------------ | --------------------------------- |
| 初级 | 反向代理、静态资源服务、HTTPS              | 搭建小型 Web 服务                 |
| 中级 | 配置负载均衡、缓存、限流、防盗链、安全控制 | 支撑高并发 API 网关               |
| 高级 | 模块机制、自定义模块、配合 Lua/OpenResty   | 开发 Nginx 插件或做大规模反代系统 |

内容重点：

- 反向代理（带路径重写）
- HTTPS 配置（使用 Let’s Encrypt / 自签证书 / TLS ）
- 负载均衡（轮询 / IP Hash）
- 配置缓存（proxy_cache + 缓存策略）
- 限流（limit_req, limit_conn）
- URL 重写（rewrite / return / if）
- 跨域（配置 add_header Access-Control-Allow-Origin）
- 防盗链、防爬虫（valid_referers, user_agent）
- 使用 OpenResty 嵌入 Lua 脚本处理请求
- 动态反向代理（如读取 Redis 决定 proxy_pass）
- 热更新配置/优雅重启
- 结合 CI/CD 动态部署 Nginx 配置
- Nginx + Docker 的最佳实践
- 使用 stream 模块代理 TCP/UDP
- 安全：WAF、防火墙、HTTP 强制跳转

常见系统 Nginx 默认路径参考

| 操作系统 / 安装方式    | 配置路径                                 |
| ---------------------- | ---------------------------------------- |
| Ubuntu / Debian（apt） | /etc/nginx/nginx.conf                    |
| CentOS / RHEL（yum）   | /etc/nginx/nginx.conf                    |
| macOS（Homebrew 安装） | /opt/homebrew/etc/nginx/nginx.conf       |
| 自编译安装             | /usr/local/nginx/conf/nginx.conf（默认） |
| Docker 官方镜像        | /etc/nginx/nginx.conf（容器内）          |

- `OpenResty`

OpenResty（基于 Nginx 的扩展版本）

docker 中查找 Nginx 配置文件路径：

```bash
docker exec -it nginx-container-name nginx -t

# 输出

docker exec -it 1Panel-openresty-Yj8P  nginx -t
nginx: the configuration file /usr/local/openresty/nginx/conf/nginx.conf syntax is ok
nginx: configuration file /usr/local/openresty/nginx/conf/nginx.conf test is successful

```

在 Docker 环境中 —— 你在 Nginx 配置里看到的路径，用 docker exec cat 能读到内容，但你用 ls 却发现这个文件“看不见”或目录是“空的”

✅ 原因是：你是在容器外的宿主机目录下 ls，但文件其实在容器里！

## 一、内网穿透（ frp（Fast Reverse Proxy）工具）

可以通过`内网穿透`将本地服务和内网中（如 Web 服务、面板）暴露在公网服务器上，从而通过外部公网 IP 或域名访问本地内容

```text
[本地Mac电脑:8000]
        ↑
      frpc (客户端)
        ↕        内网穿透 (TCP)
      frps (服务器端)
        ↓
[公网服务器:10270]
        ↓
[域名 DNS → 服务器IP（如 54.255.234.25）]
```

### 1.1 安装 frp

1. 下载 frp 客户端

[frpc-desktop](https://github.com/luckjiawei/frpc-desktop)

客户端配置:

✅ 用于接收 frpc 客户端连接

✅ 面板可通过服务器 IP:7500 查看状态（如 http://54.255.234.25:7500）

✅ frpc.ini 配置

```ini
serverAddr = "domain.com" # 公网服务器的域名或 IP
serverPort = 7000
auth.method = "token"
auth.token = "Yz8K4bR9udwafjo122v412NcPaf7g"    # frpc 与 frps 配置一致

log.to = "frpc.log"
log.level = "info"
log.maxDays = 3
webServer.addr = "127.0.0.1"
webServer.port = 56789
transport.protocol = "tcp"

transport.dialServerTimeout = 10
transport.dialServerKeepalive = 7200
transport.heartbeatInterval = 30
transport.heartbeatTimeout = 90
transport.tcpMux = true
transport.tcpMuxKeepaliveInterval = 30
transport.tls.enable = false

[[proxies]]
name = "test"
type = "tcp"
localIP = "127.0.0.1"
localPort = 8000
remotePort = 10270

```

2. 下载 frp 客户端

```bash
# 进入 home 目录
cd ~

# 下载最新版本 frp（替换版本号为你需要的）
wget https://github.com/fatedier/frp/releases/download/v0.58.0/frp_0.58.0_linux_amd64.tar.gz

# 解压
tar -zxvf frp_0.58.0_linux_amd64.tar.gz
cd frp_0.58.0_linux_amd64

# 创建配置文件 frps.ini
vim frps.ini
```

运行 frps 服务 ： `./frps -c frps.ini`

持久化运行并输出日志：`nohup ./frps -c ./frps.ini > frps.log 2>&1 &`

- nohup：不挂断运行程序，即使退出终端也不会被杀死
- ./frps -c ./frps.ini 启动 frps，并指定配置文件为 frps.ini
- \> 将标准输出（stdout）重定向到指定文件
- frps.log 输出日志的文件名（保存运行信息）
- 2>&1 将标准错误（stderr）也重定向到标准输出，即也写入 frps.log
- & 表示在后台运行该命令（不会阻塞终端）

### 1.2 配置 frp

✅ frps.ini 配置

```ini
[common]
bind_port = 7010
dashboard_port = 7500          # Web面板端口（可选）
dashboard_user = admin         # 登录Web面板用户名
dashboard_pwd = admin123       # 登录Web面板密码
vhost_http_port = 8080         # 如果你反代 HTTP 服务可开启
vhost_https_port = 8443        # 如果你反代 HTTPS 服务可开启
token = Yz8K4bR9udwafjo122v412NcPaf7g    # 推荐开启，防止别人乱连
```

### 1.3 输出日志

```log
2025-07-01 13:32:45.815 [I] [client/service.go:295] [d03ee0eef7d84c18] try to connect to server...
2025-07-01 13:32:47.729 [I] [client/service.go:287] [d03ee0eef7d84c18] login to server success, get run id [d03ee0eef7d84c18]
2025-07-01 13:32:47.741 [I] [proxy/proxy_manager.go:173] [d03ee0eef7d84c18] proxy added: [test]
2025-07-01 13:32:58.872 [I] [client/control.go:168] [d03ee0eef7d84c18] [test] start proxy success
```

### 1.4 常见问题与排查

| 问题 | 排查 |
| --- | --- |
| 域名访问无响应 | 确保 DNS 解析正确，域名绑定公网 IP (配置 A 记录，AAA 记录解析为 IPV6) |
| 浏览器显示 502 Bad Gateway | 本地服务未启动或端口配置错误 |
| frpc 启动后不工作 | 查看 frpc 日志，确认与 frps 通信成功 |

## 二、HTTPS 配置（ TLS ）

### Nginx / OpenResty 配置 TLS（HTTPS）

TLS （Transport Layer Security），HTTPS 的基础，加密数据传输保障安全。

### 2.1 安装运行 Nginx

查看 nginx 进程

```bash
ps aux | grep nginx

# 输出
root       43161  0.0  0.4 372828  4352 ?        Ss   Jun22   0:00 nginx: master process /usr/local/openresty/bin/openresty -g daemon off;
root       43234  0.0  0.7 376156  7724 ?        S    Jun22   1:17 nginx: worker process
ubuntu     79984  0.0  0.2   7008  2304 pts/0    S+   03:16   0:00 grep --color=auto nginx
```

### 2.2 准备证书文件

从某某云中台 → SSL/TLS → 源服务器 → 创建证书。文件格式一般包括 `cert.pem`（公钥证书） 和 `key.pem`（私钥）

将它们保存到宿主机目录 /etc/nginx/ssl/：

```bash
sudo mkdir -p /etc/nginx/ssl
sudo cp cert.pem /etc/nginx/ssl/cert.pem
sudo cp key.pem /etc/nginx/ssl/key.pem
sudo chmod 644 /etc/nginx/ssl/cert.pem
sudo chmod 600 /etc/nginx/ssl/key.pem
```

配置 TLS:

```sh
user  root; # 设置 Nginx 运行用户（OpenResty 容器默认 root）
worker_processes  auto; # 自动根据 CPU 核心数设定 worker 进程数（性能优化）
error_log  /var/log/nginx/error.log notice; # 设置错误日志文件路径和日志级别
error_log  /dev/stdout notice; # 将错误日志输出到标准输出（便于 Docker 日志收集）
pid        /var/run/nginx.pid; # 设置 Nginx 主进程的 PID 文件路径

events {
    worker_connections  1024; # 每个 worker 进程允许同时处理的最大连接数
}

http {
    server {
      listen 443 ssl http2; # 监听 443 端口，启用 SSL 和 HTTP/2
      server_name k.cn; # 设置当前虚拟主机的域名

      # SSL 证书路径（请确认文件真实存在）
      ssl_certificate     /etc/nginx/ssl/cert.pem;
      ssl_certificate_key /etc/nginx/ssl/key.pem;

      # 允许的 TLS 协议版本（关闭 TLS 1.0/1.1，增强安全）
      ssl_protocols TLSv1.2 TLSv1.3;

      # 优先使用服务器端加密套件
      ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
      ssl_prefer_server_ciphers on;

      # SSL 会话缓存设置，提高性能
      ssl_session_timeout 1d;
      ssl_session_cache shared:SSL:10m;
      ssl_session_tickets off;  # 禁用 TLS 会话票据，提高安全性

      location / {
      default_type text/html;
      add_header X-Content-Type-Options nosniff;
      add_header X-Frame-Options DENY;
      add_header X-XSS-Protection "1; mode=block";

      content_by_lua_block {
          ngx.say("Hello from OpenResty with HTTPS!")
      }
    }
    # HTTP 自动跳转到 HTTPS
    server {
      listen 80;  # 监听 HTTP 端口
      server_name k.cn;
      return 301 https://$host$request_uri;  # 301 永久重定向到 HTTPS
    }
    #  http 全局配置部分
    include mime.types; # 引入 MIME 类型映射配置（常见文件扩展名 → MIME 类型）
    default_type  application/octet-stream; # 默认 MIME 类型
    # 定义日志格式（名为 main）
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';
    server_tokens off; # 隐藏版本信息，防止泄露服务器版本
    # 访问日志写入文件和标准输出
    access_log  /var/log/nginx/access.log  main;
    access_log /dev/stdout main;
    # 启用 sendfile，提高文件传输效率
    sendfile on;
    server_names_hash_bucket_size 512; # 提高 DNS 映射性能
    client_header_buffer_size 32k; # 请求头缓冲区大小
    client_max_body_size 50m; # 上传文件的最大大小
    # 保持连接时间与最大请求数
    keepalive_timeout 60;
    keepalive_requests 100000;

    # 启用 gzip 压缩，提高传输效率
    gzip on;
    gzip_min_length  1k;
    gzip_buffers     4 16k;
    gzip_http_version 1.1;
    gzip_comp_level 2;
    # 指定可压缩的 MIME 类型
    gzip_types text/plain application/javascript application/x-javascript text/javascript text/css application/xml;
    gzip_vary on;
    gzip_proxied   expired no-cache no-store private auth;
    gzip_disable   "MSIE [1-6]\.";
    # 定义连接限制区，按 IP 限制
    limit_conn_zone $binary_remote_addr zone=perip:10m;
    # 按 server_name 限制连接数
    limit_conn_zone $server_name zone=perserver:10m;
    # 引入 conf.d 目录下所有 .conf 子配置文件
    include /usr/local/openresty/nginx/conf/conf.d/*.conf;
    # 引入 OpenResty WAF 配置（如使用 1Panel 自带的安全模块）
    include /usr/local/openresty/1pwaf/data/conf/waf.conf;
}
```

## 三、反向代理

### 3.1 什么是反向代理，与正向代理的区别

```
【正向代理】（客户端伪装）
你 ←→ 正向代理服务器 ←→ 目标网站

【反向代理】（服务端伪装）
用户 ←→ 反向代理服务器（Nginx）←→ 多个后端服务
```

- 正向代理：为`客户端`做代理

  - 你的浏览器访问不了目标网站（如 Google）
  - 于是你配置了一个“正向代理”（如 V2Ray、Shadowsocks、Clash）
  - 它帮你“代表你”访问目标网站，并把结果转发回来

```
你在浏览器访问 https://google.com
实际请求走的是：你 → 代理服务器 → google.com → 代理返回 → 你
```

- 反向代理：为`服务端`做代理

  - 你有多个服务（Node.js、PHP、Python），想统一通过一个域名访问
  - 或者你要隐藏服务端真实 IP 和端口

```
你访问 https://api.example.com/user
Nginx 实际转发到 http://127.0.0.1:3000/user
```

### 3.2 静态资源路径映射

两个 server 块分别处理不同域名：

k.cn 指向 /home/index（原首页）

a.k.cn 指向 /home/index2（另一个页面）

```bash
# 主域名：kying.org
server {
    listen 443 ssl http2;
    server_name k.cn;

    ssl_certificate     /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    location / {
        root /home/index;
        index index.html;
        try_files $uri $uri/ =404;
    }
}

# 二级域名：abc.k.cn
server {
    listen 443 ssl http2;
    server_name abc.k.cn;

    ssl_certificate     /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    location / {
        root /home/index2;
        index index.html;
        try_files $uri $uri/ =404;
    }
    # 网站 B：/abcd 子路径
    location /abcd/ {
        alias /home/index3/;  # alias 的路径必须以 / 结尾
        index index.html;
        try_files $uri $uri/ =404;
    }
}
```

这时候访问 `https://k.cn` 就会访问到网站 A 的 /home/index/index.html 文件。

访问 `https://abc.k.cn`就会访问到网站 B 的 /home/index2/index.html 文件。

访问 `https://abc.k.cn/abcd`就会访问到网站 C 的 /home/index3/index.html 文件。

### 3.3 反向代理服务端 api

以下是一段典型的 Nginx `反向代理`配置，用于将访问 `https://你的域名/jk1/` 的请求转发到本地的某个后端服务（在这里是 http://127.0.0.1:9009/）。

```sh
location ^~ /jk1/ {
    proxy_pass http://127.0.0.1:9009/;
    proxy_set_header Host $host; #将客户端请求中的 Host 头，转发给后端，通常用于保持请求一致性。
    proxy_set_header X-Real-IP $remote_addr; #将客户端真实 IP 加入到请求头 X-Real-IP 中，后端服务就能获取访问者真实 IP
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; #标准代理链 IP 头，记录访问者的真实链路（比如 nginx → 网关 → 客
    proxy_set_header REMOTE-HOST $remote_addr;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_http_version 1.1;
    add_header X-Cache $upstream_cache_status;
    add_header Cache-Control no-cache;
    proxy_ssl_server_name off;
}
```

- `proxy_pass http://127.0.0.1:9009/;`

核心反向代理功能：将 /jk1/ 的请求代理到本地 9009 端口的服务（比如 Node.js、Python、Go 写的 web 服务等）。

Nginx 对 proxy_pass 的规则（官方定义）：proxy_pass 末尾是否带 /,带 `/`会去掉 /jk1 前缀，否则会保留 /jk1 前缀。
