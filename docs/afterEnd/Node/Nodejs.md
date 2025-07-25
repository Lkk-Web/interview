---
group:
  # title: '后端'
  order: 3
order: 1
---

# Nodejs

官方文档：[Node](https://nodejs.org/en/docs/)

## 简介

消息队列？

GraphQL

esql

RPC

高并发

redis

cnpm 、 npm 、pnpm 的区别

## 1、基本概念 Node 是什么？

## CommonJS 规范

> 现 ES6 的 Module 基本取代了 Commandjs 规范和 AMD 规范

Node 应用由模块组成，采用 CommonJS 模块规范。

CommonJS 规范规定，每个文件就是一个模块，有自己的作用域。每个模块内部，module 变量代表当前模块。这个变量是一个对象，它的 exports 属性（即 module.exports）是对外的接口。加载某个模块，其实是加载该模块的 module.exports 属性。

如果想在多个文件分享变量，必须定义为 global 对象的属性。

CommonJS 模块的特点如下。

- 所有代码都运行在模块作用域，不会污染全局作用域。

- 模块可以多次加载，但是只会在第一次加载时运行一次，然后运行结果就被缓存了，以后再加载，就直接读取缓存结果。要想让模块再次运行，必须清除缓存。

- 模块加载的顺序，按照其在代码中出现的顺序。

- CommonJS 规范加载模块是同步的,AMD 规范是异步的，由于 Node.js 主要用于服务器编程，模块文件一般都已经存在于本地硬盘，所以加载起来比较快，不用考虑非同步加载的方式，所以 CommonJS 规范比较适用。但是，如果是浏览器环境，要从服务器端加载模块，这时就必须采用非同步模式，因此浏览器端一般采用 AMD 规范。

### 1.1、exports 规范

module.exports 属性表示当前模块对外输出的接口，其他文件加载该模块，实际上就是读取 module.exports 变量。

```javascript
module.exports = 'Hello world';
```

`exports`和`module.export` 都是意味着是个模块的对外接口，因此尽量避免重新赋值

### 1.2、require 规范

require 命令用于加载文件，后缀名默认为.js

```javascript
// require方法用于加载模块。
var example = require('./example.js');
```

> 如果参数字符串不以“./“或”/“开头，则表示加载的是一个默认提供的核心模块（位于 Node 的系统安装目录中），或者一个位于各级 node_modules 目录的已安装模块（全局安装或局部安装）。

- 如果想得到 require 命令加载的确切文件名，使用 `require.resolve()`方法。

#### 1.2.1、require.main

require 方法有一个 main 属性，可以用来判断模块是直接执行，还是被调用执行。

直接执行的时候（node module.js），require.main 属性指向模块本身。

```javascript
require.main === module;
```

调用执行的时候（通过 require 加载该脚本执行），上面的表达式返回 false

### 1.3、模块加载机制

CommonJS 模块的加载机制是，输出的值是被输出的值的拷贝。也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。。

### 1.4、模块缓存机制

第一次加载某个模块时，Node 会缓存该模块。以后再加载该模块，就直接从缓存取出该模块的 module.exports 属性。

```javascript
require('./example.js');
require('./example.js').message = 'hello';
require('./example.js').message;
// "hello"
```

上面代码中，连续三次使用 require 命令，加载同一个模块。第二次加载的时候，为输出的对象添加了一个 message 属性。但是第三次加载的时候，这个 message 属性依然存在，这就证明 require 命令并没有重新加载模块文件，而是输出了缓存。

如果想要多次执行某个模块，可以让该模块输出一个函数，然后每次 require 这个模块的时候，重新执行一下输出的函数。

所有缓存的模块保存在 require.cache 之中，如果想删除模块的缓存，可以像下面这样写。

```javascript
// 删除指定模块的缓存
delete require.cache[moduleName];

// 删除所有模块的缓存
Object.keys(require.cache).forEach(function (key) {
  delete require.cache[key];
});
```

注意，缓存是根据绝对路径识别模块的，如果同样的模块名，但是保存在不同的路径，require 命令还是会重新加载该模块。

### 1.5 CMD 规范

CMD（Common Module Definition）是国内大牛玉伯在开发 SeaJS 的时候提出来的，`属于 CommonJS 的一种规范`，根据浏览器的异步环境做了自己的实现。它和 AMD 很相似，尽量保持简单，并与 CommonJS 和 Node.js 的 Modules 规范保持了很大的兼容性。

### 1.5.1 define 方法：定义模块

在 CMD 中，一个模块就是一个文件，格式为：define( factory )；define 是一个全局函数，用来定义模块。

defin.cmd 属性是一个空对象，可用来判定当前页面是否有 CMD 模块加载器，其用法跟 AMD 的 denfine.amd 相似，写法如下：

```js
if (typeof define === 'function' && define.cmd) {
  // 有 Sea.js 等 CMD 模块加载器存在
}
```

## 2、洋葱圈模型

在 `koa` 中，中间件被 `next()` 方法分成了两部分。`next()` 方法上面部分会先执行，下面部门会在后续中间件执行全部结束之后再执行。

我们需要知道一个请求或者操作 `db` 的耗时是多少，而且想获取其他中间件的信息。在 `koa` 中，我们可以使用 `async await` 的方式结合洋葱模型做到。

```javascript
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const delta = new Date() - start;
  console.log(`请求耗时: ${delta} MS`);
  console.log('拿到上一次请求的结果：', ctx.state.baiduHTML);
});

app.use(async (ctx, next) => {
  // 处理 db 或者进行 HTTP 请求
  ctx.state.baiduHTML = await axios.get('http://baidu.com');
});
```

## 3、Node EventLoop

NodeJS 中的 EventLoop 使 NodeJS 能够进行非阻塞的 I/O 操作，尽管 JavaScript 是单线程的，可以通过将 I/O 操作交给系统内核去执行。

当某个 I/O 操作结束的时候，内核会将对应的 callback 函数元信息交给 NodeJS 中的 poll queue(轮询队列)。

当我们的脚本中调用了`异步函数`，计时器或者 process.nextTick()的时候，EventLoop 机制就会开始介入。

下图简明地展示了 EventLoop 的操作顺序：

```
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```

- `timers（计时阶段）`：这个阶段执行由 setTimeout() 和 setInterval() 调度的回调。

  · NodeJS.Timeout 是 Node.js 定义的类型，表示定时器对象。

  ```ts
      // 启动一个 30 秒的定时器, 踢出未准备的玩家
      const removeTimer = setTimeout(() => { this.leave(undefined, deskInfo) }, 30000)
      DeskClubService.timers.set(deskID, removeTimer)
      // 定时器返回值为id，node环境为 NodeJS.Timeout 类型
      const removeTimer = DeskClubService.timers.get(deskID)
      removeTimer && clearTimeout(removeTimer)
      static timers: Map<string, NodeJS.Timeout> = new Map();  // 所有房间
  ```

- `pending callbacks（回调待处理阶段）`：这个阶段执行延迟到下一次循环迭代的 I/O 回调。
- `idle, prepare（闲置阶段）`：仅仅被 NodeJS 内部使用。（这里是根据官方文档描述的，不能甚解）
- `poll（轮询阶段）`：这个阶段检索 I/O 事件，执行 I/O 事件对应的回调函数（除了关闭回调、计时器调度的回调和 setImmediate() 之外的几乎所有异步操作），都将会在这个阶段被处理。
- `check（检测阶段）`：setImmediate()函数的回调函数将会在这里被处理。
- `close callbacks（关闭回调阶段）`：例如：socket.on('close', ...)

## 4、pm2 部署

### 4.1 安装必要环境

1. 安装源

```bash
sudo apt update && sudo apt upgrade -y
```

2. 安装构建工具（npm、pm2、cross-env）

```bash
sudo apt install -y nodejs npm
sudo npm install -g pm2 cross-env
```

3. 检查安装结果

```bash
node -v
npm -v
pm2 -v
```

### 4.2 产物构建

1. 拉取项目代码

`git clone <你的仓库地址>`、`cd <项目目录>`

2. 安装依赖并构建产物

```bash
npm install
npm run build   # 或 yarn build，看你的项目定义
```

### 4.3 PM2 启动服务

启动 pm2: `pm2 start dist/main.js --name server_name`

✅ 可写入 package.json 脚本

```jsonc
"scripts": {
  "prod": "cross-env RUN_ENV=prod.env pm2 start dist/main.js --name server_name"
}
```

🔍 查看状态 & 管理服务

```bash
pm2 list                        # 查看所有进程
pm2 logs server_name        # 查看日志
pm2 restart server_name     # 重启
pm2 stop server_name        # 停止
pm2 delete server_name      # 删除进程
```

开机自启

```bash
pm2 startup              # 输出一条命令，复制粘贴执行
sudo env PATH=$PATH:/home/ubuntu/.nvm/versions/node/v18.17.0/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu
pm2 save                 # 保存当前进程状态
```

🧪 结束后检查

```sh
curl http://localhost:端口
```
