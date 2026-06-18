# Release

## 一、Cloudflare Tunnel 映射本地服务

将本地 Mac 上运行的服务通过 Cloudflare Tunnel 暴露到公网域名：

```
interview.kying.org → Cloudflare Tunnel → localhost:8888
```

---

### 准备条件

- 已拥有 Cloudflare 账号，且域名已托管到 Cloudflare
- 本地服务已启动（例如 `localhost:8888`）
- 本机已安装 `cloudflared`

```bash
cloudflared --version
```

---

### 配置步骤

#### 1. 创建 Tunnel

进入 Cloudflare Dashboard：`Zero Trust → Networks → Tunnels → Create a tunnel`

填写 Tunnel 名称（如 `interview`），创建完成后会得到安装命令：

```bash
sudo cloudflared service install <token>
```

#### 2. 启动 Tunnel

手动运行（临时）：

```bash
cloudflared tunnel run --token <token>
```

注册为系统服务（持久化）：

```bash
sudo cloudflared service install <token>
```

验证 Tunnel 状态：

```bash
cloudflared tunnel list
```

Tunnel 页面出现 `Status: HEALTHY / Connector: Connected` 表示连接成功。

#### 3. 配置公网域名路由

进入 `Tunnel → Published application routes → Add a published application route`，填写：

| 字段         | 值                      |
| ------------ | ----------------------- |
| Hostname     | `interview.kying.org`   |
| Path         | `*`                     |
| Service Type | HTTP                    |
| URL          | `http://localhost:8888` |

> 使用 `http://`，不要使用 `https://`，除非本地服务已配置 TLS 证书。

#### 4. 验证访问

```bash
# 验证本地服务是否正常（返回任意响应即可，哪怕 404）
curl http://localhost:8888

# 验证公网访问
curl https://interview.kying.org
```

---

### 常见问题：ERR_CONNECTION_CLOSED

**原因**：Tunnel 的 Service URL 配置成了 `https://localhost:8888`，但本地服务没有 TLS 证书，握手失败。

**修复**：将 Service URL 改为 `http://localhost:8888`。

协议分工：

```
用户 --HTTPS--> Cloudflare --HTTP--> localhost:8888
```

公网 HTTPS 由 Cloudflare 负责，本地走 HTTP 即可。

---

### 排查清单

遇到 Tunnel 无法访问时按以下顺序排查：

1. 本地服务是否启动：`curl http://localhost:<端口>`
2. Tunnel 状态是否 `HEALTHY`
3. Connector 是否 `Connected`
4. Published application routes 的 Hostname 与 Service 是否正确
5. Service URL 协议是 `http` 还是 `https`
6. 业务接口是否正常：`curl http://localhost:<端口>/api/health`
