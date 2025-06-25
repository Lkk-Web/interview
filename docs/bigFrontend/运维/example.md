---
order: 3
---

# shell 脚本实例

## 1、cross-env

cross-env 是运行跨平台设置和使用环境变量的脚本。

出现原因：当使用 NODE_ENV =production, 来设置环境变量时，大多数 Windows 命令提示将会阻塞(报错)。 （异常是 Windows 上的 Bash，它使用本机 Bash。）同样，Windows 和 POSIX 命令如何使用环境变量也有区别。 使用 POSIX，您可以使用：$ ENV_VAR 和使用％ENV_VAR％的 Windows。

即：windows 不支持 NODE_ENV=development 的设置方式。

解决 cross-env 使得您可以使用单个命令，而不必担心为平台正确设置或使用环境变量。 只要在 POSIX 系统上运行就可以设置好，而 cross-env 将会正确地设置它。在 windows 上也能兼容运行。

安装：

```
npm install --save-dev cross-env
```

使用:

```json
{
  "scripts": {
    "build": "cross-env NODE_ENV=production webpack --config build/webpack.config.js"
  }
}
```

production 为生产环境，development 为本地环境

NODE_ENV 环境变量将由 cross-env 的设置为 process.env.NODE_ENV === 'production'

## 2、mac 终端永久、重命名连接服务器

✅ 1. 永久设置 KeepAlive —— 连接不断

你可以在 mac 本地配置里设置成全局生效，方法如下：

打开 SSH 全局配置文件：

`nano ~/.ssh/config` 或者 `code ~/.ssh/config`

添加以下内容：

```
Host *
  ServerAliveInterval 60
  ServerAliveCountMax 5
  TCPKeepAlive yes
```

📌 保存后，这个配置对你以后所有 ssh 命令都会生效，永久保持连接心跳。

_nano 保存是 ^O，然后 ^C 退出_

✅ 2. 连接服务器免密登录（SSH 密钥登录）

这是最常用的方式，下面是完整步骤：

- 步骤一：生成 SSH 密钥（如果你还没生成过）

在你的 Mac 终端执行：

```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

一路回车（建议不要设置密码短语），默认会生成：

私钥：~/.ssh/id_rsa

公钥：~/.ssh/id_rsa.pub

- 步骤二：将公钥复制到服务器

执行以下命令把公钥`推送`到服务器上：

```sh
ssh-copy-id your_user@your.server.ip
```

- 步骤三：测试是否免密登录成功

现在再连接一次看看：

ssh your_user@your.server.ip

应该就不需要输入密码了 ✅

🚀 加强体验（可选）

如果你经常连多台服务器，还可以在 ~/.ssh/config 文件里加快捷方式：

```sh
Host *
    HostKeyAlgorithms +ssh-rsa
    PubkeyAcceptedKeyTypes +ssh-rsa
    
Host github.com-server1
    HostName github.com
    User git
    ServerAliveInterval 60
    ServerAliveCountMax 5
    TCPKeepAlive yes
    IdentityFile ~/.ssh/id_ed25519

Host server2
    HostName ec2-54-255-234-25.ap-southeast-1.compute.amazonaws.com
    User ubuntu
    IdentityFile ~/.ssh/KyeLeoServe.pem
    ServerAliveInterval 60
    ServerAliveCountMax 5
    TCPKeepAlive yes
```

这样你只需要：

`ssh myserver`

🏅 就能自动连上服务器，且不断线、免密！

## 3、海外服务器

1. 注册、购买

需要 visa 卡，可在亚马逊、oracle 等注册、申请；

- 私钥，需要保存，用来登陆

- 安全组，`出战进站`允许 0.0.0.0/0

2. 连接

- SSH 基本连接命令

```sh
ssh -i ~/.ssh/KyeLeoServe.pem ubuntu@ec2-54-255-234-25.ap-southeast-1.compute.amazonaws.com
```

- `-i ~/.ssh/KyeLeoServe.pem` : 指定私钥文件路径

- `ubuntu@` : 登录用户名

若连接卡住无响应，可能是网络、防火墙、安全组或用户名错误。

- 私钥文件存放位置

建议将 .pem 文件放在：`~/.ssh/`，然后修改只读权限，不然连接不了服务器。

```sh
chmod 400 ~/.ssh/KyeLeoServe.pem
```

- 连接成功后系统提示信息

```sh
The list of available updates is more than a week old.
To check for new updates run: sudo apt update
New release '24.04.2 LTS' available.
Run 'do-release-upgrade' to upgrade to it.
```
