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
