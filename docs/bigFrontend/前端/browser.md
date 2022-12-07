---
order: 6
---

# 浏览器

## 一、浏览器进程

在 Chrome 中，主要的进程有 4 个：

- 浏览器进程 (Browser Process)：负责浏览器的 TAB 的前进、后退、地址栏、书签栏的工作和处理浏览器的一些不可见的底层操作，比如网络请求和文件访问。

- 渲染进程 (Renderer Process)：负责一个 Tab 内的显示相关的工作，也称渲染引擎。

  - JavaScript 引擎线程
  - 事件触发线程
  - 定时触发器线程
  - 异步 http 请求线程
  - GUI 渲染引擎线程

  GUI 线程就是渲染页面的，解析 HTML 和 CSS，然后构建成 DOM 树和渲染树。渲染过程如下：

  ```
  A.处理html生成 DOM（Document Object Model）Tree
  B.处理css生成 CSSOM（CSS Object Model）Tree
  C.DOM树与CSS-DOM树合并为Render树
  D.对Render树进行布局计算
  E.遍历Render树的每一个节点绘制到屏幕
  ```

  [DOM 构建过程](https://xie.infoq.cn/article/9066d97f021319a6bac5f9eb5)： 首先浏览器的 HTML 解析器会先将其解析成字节码，然后通过 DOCTYPE 解析对应的浏览器模式和编码（比如 utf-8），而如何构建其实就是对编码后格式的 DOM 所有节点进行深度遍历，当遍历到当前节点如果有挂在 css 资源，将会去生成 `CSSOM Tree`(此时是异步生成的)，而如果遇到 js(此处是同步，异步可自行推演)则会去立刻下载 js 文件，同时阻塞 dom 的构建，而执行则是在 CSSOM 树生成完后，render 树生成前执行。

- GPU 进程 (GPU Process)：负责处理整个应用程序的 GPU 任务
- 网络进程
- 插件进程 (Plugin Process)：负责控制网页使用到的插件

## 二、事件源

获取事件源：通过回调函数中的 e 参数的 target 属性即可获取事件源（e.target）

### 2.1 事件模型

1、原始事件模型（`DOM0 级`）

- 特性

  - 绑定速度快
  - 只支持冒泡，不支持捕获
  - 同一个类型的事件只能绑定一次

- HTML 代码中直接绑定

```html
<input type="button" onclick="fun()" />
<script>
  var btn = document.getElementById('.btn');
  btn.onclick = fun;
</script>
```

- 只支持冒泡，不支持捕获
- 同一个类型的事件只能绑定一次

2、标准事件模型（`DOM2级`）

- 特性

  - 可以在一个 DOM 元素上绑定多个事件处理器，各自并不会冲突
  - 执行时机

    当第三个参数(useCapture)设置为 true 就在捕获过程中执行，反之在冒泡过程中执行处理函数

DOM2 级事件处理程序，其中定义了两个方法：

```js
addEventListener(eventType, handler, useCapture); //监听
removeEventListener(eventType, handler, useCapture); //取消监听
/*
函数均有3个参数，
第一个参数是要处理的事件名(不带on前缀的才是事件名)
第二个参数是作为事件处理程序的函数
第三个参数是一个boolean值，默认false表示使用冒泡机制，true表示捕获机制。
*/
```

3、IE 事件模型（基本不用）

事件绑定监听函数的方式如下:

```js
attachEvent(eventType, handler);
```

#### 事件流

- 事件捕获阶段：事件从`document`一直向下传播到目标元素, 依次检查经过的节点是否绑定了事件监听函数，如果有则执行
- 事件处理阶段：事件到达目标元素, 触发目标元素的监听函数
- 事件冒泡阶段：事件从目标元素冒泡到`document`, 依次检查经过的节点是否绑定了事件监听函数，如果有则执行

**阻止事件冒泡**

```js
event.stopPropagation(); // 执行捕获阶段，阻止事件冒泡
event.preventDefault(); // 执行事件冒泡，阻止捕获阶段
return false; // 同时阻止捕获阶段，同时阻止事件冒泡
window.event.cancelBubble = true; // （已弃用）执行捕获阶段，阻止事件冒泡
```

### 2.2 Event 对象

event 每个事件函数都有的内置对象，里面储存着事件发生之后的信息

## 三、Event Loop（事件循环机制）

### 3.1 JavaScript 单线程

JavaScript 语言的一大特点就是单线程，也就是说，同一个时间只能做一件事。那么，为什么 JavaScript 不能有多个线程呢？这样能提高效率啊。

JavaScript 的单线程，与它的用途有关。作为浏览器脚本语言，JavaScript 的主要用途是与用户互动，以及操作 DOM。这决定了它只能是单线程，否则会带来很复杂的同步问题。比如，假定 JavaScript 同时有两个线程，一个线程在某个 DOM 节点上添加内容，另一个线程删除了这个节点，这时浏览器应该以哪个线程为准？

所以，为了避免复杂性，从一诞生，JavaScript 就是单线程，这已经成了这门语言的核心特征，将来也不会改变。

为了利用多核 CPU 的计算能力，HTML5 提出 [Web Worker](/big-frontend/前端/html#9web-worker) 标准，允许 JavaScript 脚本创建多个线程，但是`子线程完全受主线程控制，且不得操作 DOM`。所以，这个新标准并没有改变 JavaScript 单线程的本质。

### 3.2 任务队列

单线程就意味着，所有任务需要排队，前一个任务结束，才会执行后一个任务

javascript 中先分【同步和异步】，然后事件任务分为【宏任务和微任务】, 执行顺序是先执行微任务再执行宏任务。(异步顺序也是如此)

`同步任务`：在主线程上排队执行的任务，只有前一个任务执行完毕，才能执行后一个任务；

`异步任务`：不进入主线程、而进入"任务队列"（task queue）的任务，只有"任务队列"通知主线程，某个异步任务可以执行了，该任务才会进入主线程执行。

`宏任务`：当前调用栈中执行的代码成为宏任务。（定时器等等）。如：整体代码 script,setTimeout, setInterval

`微任务`：当前（此次事件循环中）宏任务执行完，在下一个宏任务开始之前需要执行的任务,可以理解为回调事件。（promise.then，proness.nextTick 等等）。Promise.then(非 new Promise）

注：如果 then 不是回调函数，new 的 promise 就是同步执行

核心：**同步任务-->微任务-->宏任务依次执行-->单个宏任务中的同步、微任务、宏任务-->下一个宏任务..**

微任务和宏任务在宏观上看是属于异步，也就是说，先执行同步任务，到异步任务节点时加入任务队列（宏任务，微任务），继续执行同步任务

### 3.2.1 宏任务

|                       | 浏览器 | Node |
| :-------------------: | :----: | :--: |
|          I/O          |   ✅   |  ✅  |
|      setTimeout       |   ✅   |  ✅  |
|      setInterval      |   ✅   |  ✅  |
|     setImmediate      |   ❌   |  ✅  |
| requestAnimationFrame |   ✅   |  ❌  |

#### setImmediate

该方法用于分解长时间运行的操作，并在浏览器完成事件和显示更新等其他操作后立即运行回调函数.即在当前"任务队列"的尾部添加事件，也就是说，它指定的任务总是在下一次 Event Loop 时执行，与 setTimeout(fn, 0)很像。

```js
setImmediate(function A() {
  console.log(1);
  setImmediate(function B() {
    console.log(2);
  });
});
console.log(3);
setTimeout(() => {
  console.log(4);
}, [0]);
//3 1 2
```

上面代码中，setImmediate 与 setTimeout(fn,0)各自添加了一个回调函数，都是在下一次 Event Loop 触发。那么，哪个回调函数先执行呢？答案是`不确定`。运行结果可能是 3 4 1 2 也有可能是 3 1 4 2.(但大多数情况下`setTimeout(fn,0)`比`setImmediate`先执行)

#### requestAnimationFrame

requestAnimationFrame 姑且算是宏任务，requestAnimationFrame 在 MDN 的定义为，下次页面重绘前所执行的操作，而重绘也是作为宏任务的一个步骤来存在的，且该步骤晚于微任务的执行

- 用法：缓冲函数

```js
/**
 * 缓冲函数
 * @param {Object} dom 目标dom
 * @param {Number} destination 目标位置
 * @param {Number} rate 缓动率
 * @param {Function} callback 缓动结束回调函数 两个参数分别是当前位置和是否结束
 */
export const easeout = (dom, destination, rate, callback) => {
  let position = dom.scrollTop;
  if (position === destination || typeof destination !== 'number') {
    return false;
  }
  destination = destination || 0;
  rate = rate || 2;
  // 不存在原生`requestAnimationFrame`，用`setTimeout`模拟替代
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (fn) {
      return setTimeout(fn, 17);
    };
  }
  const step = function () {
    position += (destination - position) / rate;
    if (Math.abs(destination - position) < 1) {
      callback && callback(destination, true);
      return;
    }
    callback && callback(position, false);
    requestAnimationFrame(step);
  };
  step();
};
```

- `cancelAnimationFrame()`方法通过调用取消先前安排的动画帧请求

### 3.2.2 微任务

|                                  | 浏览器 | Node |
| :------------------------------: | :----: | :--: |
|         process.nextTick         |   ❌   |  ✅  |
| Promise.then catch finally await |   ✅   |  ❌  |
|         MutationObserver         |   ✅   |  ✅  |

#### process.nextTick

process.nextTick 方法可以在`当前执行栈`的尾部----下一次 Event Loop（主线程读取"任务队列"）之前----触发回调函数。也就是说，它指定的任务总是发生在所有异步任务之前

```js
process.nextTick(function A() {
  console.log(1);
  process.nextTick(function B() {
    console.log(2);
  });
});

setTimeout(function timeout() {
  console.log('3');
}, 0);
console.log('4');

// 4 1 2 3
```

上面代码中，由于 process.nextTick 方法指定的回调函数，总是在当前"执行栈"的尾部触发，所以不仅函数 A 比 setTimeout 指定的回调函数 timeout 先执行，而且函数 B 也比 timeout 先执行。这说明，如果有多个 process.nextTick 语句（不管它们是否嵌套），将全部在`当前执行栈`执行。

process.nextTick 和 setImmediate 的一个重要`区别`：多个 process.nextTick 语句总是在当前"执行栈"一次执行完，多个 setImmediate 可能则需要多次 loop 才能执行完。

#### MutationObserver

`MutationObserver` 是用于代替 `Mutation events` 作为观察 DOM 树结构发生变化时，做出相应处理的 API；

```js
let box = document.querySelector('#box'),
  config = { attributes: true };

let observer = new MutationObserver((mutations) => {
  console.log(mutations);
  // => 返回一个监听到的MutationRecord对象
  // MutationRecord对象是每修改一个就会在数组里面追加一个
});

observer.observe(box, config); // 监听的box元素和config配置项
box.setAttribute('name', '张三'); // 修改属性
```

##### Mutation Events

```js
document.getElementById('list').addEventListener(
  'DOMSubtreeModified',
  function () {
    console.log('列表中子元素被修改');
  },
  false,
);
```

`Mutation Events`遇到的问题：

- 浏览器兼容性问题

- 性能问题

  Mutation Events 是同步执行的：

  - 它的每次调用，都需要从事件队列中取出事件并执行，然后事件队列中移除，期间需要移动队列元素；如果事件触发的较为频繁的话，每一次都需要执行上面的这些步骤，那么浏览器会被拖慢；

  - Mutation Events 本身是事件，所以捕获是采用的是事件冒泡的形式；如果冒泡捕获期间又触发了其他的 Mutation Events 的话，很有可能就会导致阻塞 Javascript 线程，甚至导致浏览器崩溃；

#### 混合使用

```js
console.log(1);
setImmediate(function A() {
  console.log('setImmediate');
});
setTimeout(() => {
  console.log('setTimeout');
}, [0]);
process.nextTick(() => {
  console.log(4);
});

let a = new Promise((resolve, reject) => {
  console.log(2);
  resolve();
  console.log(3);
}).then(() => {
  console.log(5);
});

// 1 2 3 4 5
```

## 四、浏览器缓存

### 4.1 强缓存与协商缓存（http 缓存）

`HTTP Cache` 是我们开发中接触最多的缓存，它分为强缓存和协商缓存。

强缓存：直接从本地副本比对读取，**不去请求服务器**，返回的状态码是 **200**。

协商缓存：**会去服务器比对**，若没改变才直接读取本地缓存，返回的状态码是 **304**。若不一致，说明资源有更新，则返回 200、新资源，同时响应头返回「资源修改时间」后者「资源最新的实体标识」。

http 缓存规则由`响应首部字段`进行控制，其中的关键字段有`Expires`，`Cache-Control` ，`Last-Modified` ，`Etag` 四个字段，Expires 和 Cache-Control 用来确定确定缓存的存储时间，Last-Modified 和 Etag 则用来确定缓存是否要被更新。

- expires: `HTTP1.0`中用来控制缓存时间的参数，响应头包含日期/时间，即在此时间之后，响应过期。
- cache-control: `HTTP1.1`中用来控制缓存时间的参数
  - public: 表明响应可以被任何对象（包括：发送请求的客户端，代理服务器，等等）缓存
  - private: 表明响应只能被单个用户缓存，不能作为共享缓存（即代理服务器不能缓存它）。
  - max-age=`<seconds>`: 设置缓存存储的最大周期，相对于请求的时间缓存 seconds 秒，在此时间内，访问资源直接读取本地缓存，不向服务器发出请求。（与 expires 同时出现时，max-age 优先级更高）
  - no-store: 不缓存服务器响应的任何内容，每次访问资源都需要服务器完整响应
  - no-cache: 缓存资源，但立即过期，每次请求都需要跟服务器对比验证资源是否被修改。（等同于 max-age=0）
- Last-modified: 源头服务器认定的资源做出修改的日期及时间。精确度比 Etag 低。包含有 If-Modified-Since 或 If-Unmodified-Since 首部的条件请求会使用这个字段。
- Etag: HTTP 响应头是资源的特定版本的标识符。

> 如果只设置了`expires`而没设置`cache-control` 可能会导致什么？

`cache-control`表示的时间是浏览器相对时间，优先级也是最高的`。Expires` 表示缓存的过期时间，时间代表的是服务端的时间。如果本地时间小于 Expires 的时间，则在有效期内。浏览器会直接读取缓存，不会发起 HTTP 请求。 Expires: Sun, 14 Jun 2020 02:50:57 GMT。

由于过期策略不同，Expires 受限于本地时间，如果本地时间修改，则可能会导致缓存失效。

> 如果只设置了`Last-modified`而没设置`Etag` 可能会导致什么？

Last-Modified 表示本地文件的最后修改日期（精确到秒级）。当浏览器发起资源请求时，会将文件的 Last-Modified 值，放入 If-Modified-Since 中，发送给服务端，询问该文件在该日期后，是否有更新。

由于精确度比 `Etag` 低，如果当本地编辑缓存文件时，则会导致 Last-Modified 日期被修改，缓存会失效。（虽然内容可能没改动）

> 如果什么缓存策略都没设置，可能会导致什么？

浏览器会采用一个启发式的算法，通常会取响应头中的 Date 减去 Last-Modified 值的 10% 作为缓存时间。

```js
//response header
Access-Control-Allow-Origin: *
Cache-Control: no-store, no-cache, no-transform, must-revalidate, max-age=0
Connection: keep-alive
Content-Type: application/json; charset=UTF-8
Date: Tue, 15 Nov 2022 14:35:37 GMT
Keep-Alive: timeout=5
Transfer-Encoding: chunked
Vary: Origin
```

<image src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/11/8/166f2735c584653e~tplv-t2oaga2asx-zoom-in-crop-mark:4536:0:0:0.image' />

重点关注 1: 缓存是否过期

基于该资源上次响应缓存规则同时满足下列条件则视为缓存未过期。需要注意的是，判断缓存是否过期只跟客户端有关系，与服务端无关。1&2&3 同时满足即认为缓存未过期，相反则是已过期

1. cache-control 值为 max-age
2. max-age > 0
3. 当前 date < 上次请求时的 date + max-age

重点关注 2: 询问服务器资源是否修改

判断资源是否修改，需要客户端与服务器共同协作，客户端在首次拿到资源缓存后会存储 Etag（若有）和 Last-Modified（若有）,在下次缓存过期时会将 Etag 写在请求头部中的 If-None-Match 中，将 Last-Modified 值写在请求头部中的 If-Modified-Since 中，服务端优先对 Etag 进行对比，然后再对比 Last-Modified，完全通过后即视为缓存没有修改，有一项不通过则认为资源已被修改，缓存失效。

#### 4.2.1 缓存配置

从上述规则和与流程图中我们可以看到，缓存规则的配置其实并不复杂，除开 Etag 和 Last-Modified 用于缓存对比（实际使用中只需要开启该功能即可），我们需要关注的其实只是 cache-control（expires 可转化为 max-age 形式，不再赘述），方案如下：

1. cache-control: no-store：不缓存，每次访问都从服务下载所有资源。
2. cache-control: no-cache 或 cache-control: max-age=0：`协商缓存`，缓存当前资源，但每次访问都需要跟服务器对比，检查资源是否被修改。
3. cache-control: max-age=seconds //seconds > 0：`强缓存`，缓存当前资源，在一定时期内，再次请求资源直接读取本地缓存。

> 注：强缓存下资源也并非不可更新，例如 chrome 的 ctrl + f5 等同于直接触发方案 1，f5 或者 webview 的刷新键会直接触发方案 2，但都是基于客户端操作，不建议纳入实际项目考虑。

- 对于 img，css，js，fonts 等非 html 资源，我们可以直接考虑`强缓存`，并且 max-age 配置的时间可以尽可能久，类似于缓存规则案例中，cache-control: max-age=31535000 配置 365 天的缓存，需要注意的是，这样配置并不代表这些资源就一定一年不变，其根本原因在于目前前端构建工具在静态资源中都会加入戳的概念（例如，webpack 中的[hash]，gulp 中的 gulp-rev），**每次修改均会改变文件名或增加 query 参数，本质上改变了请求的地址**，也就不存在缓存更新的问题。

  - HTML：使用协商缓存。
  - CSS&JS&图片：使用强缓存，文件命名带上 hash 值。

- 对于 html 资源，我们建议根据项目的更新频度来确定采用哪套方案。html 作为前端资源的入口文件，一旦被强缓存，那么相关的 js，css，img 等均无法更新。对于高频维护的业务类项目，建议采用方案 2，或是方案 3 但 max-age 设置一个较小值，例如 3600，一小时过期。对于一些活动项目，上线后不会进行较大改动，建议采用方案 3，不过 max-age 也不要设置过大，否则一旦出现 bug 或是未知问题，用户无法及时更新。

除了以上考虑，有时候其他因素也会影响缓存的配置，例如 QQ 红包除夕活动，高并发大流量很容易给服务器带来极大挑战，这时我们作为前端开发，就可以采用方案 3 来避免用户多次进入带来的流量压力。

#### 补充：后端需要怎么设置

浏览器是根据响应头的相关字段来决定缓存的方案的。所以，后端的关键就在于，根据不同的请求返回对应的缓存字段。 以 nodejs 为例，如果需要浏览器强缓存，我们可以这样设置：

```js
res.setHeader('Cache-Control', 'public, max-age=xxx');
```

如果需要协商缓存，则可以这样设置：

```js
res.setHeader('Cache-Control', 'public, max-age=0');
res.setHeader('Last-Modified', xxx);
res.setHeader('ETag', xxx);
```

### 4.2 CDN 缓存

cdn 缓存是一种服务端缓存，CDN 服务商将源站的资源缓存到遍布全国的高性能加速节点上，当用户访问相应的业务资源时，用户会被调度至最接近的节点最近的节点 ip 返回给用户，在 web 性能优化中，它主要起到了，缓解源站压力，优化不同用户的访问速度与体验的作用。

#### 缓存规则

与 http 缓存规则不同的是，这个规则并不是规范性的，而是由 cdn 服务商来制定，我们以腾讯云举例，打开 cdn 加速服务配置，提供给我们的配置项只有文件类型（或文件目录）和刷新时间，意义也很简单，针对不同文件类型，在 cdn 节点上缓存对应的时间。

<image src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/11/8/166f2735f65e8be9~tplv-t2oaga2asx-zoom-in-crop-mark:4536:0:0:0.image'/>

#### http 缓存与 cdn 缓存的结合

当我们分别理解了 http 缓存配置和 cdn 缓存配置后，我们还有一件事情，就是理解二者结合时，请求的流向问题.

当用户访问我们的业务服务器时，首先进行的就是 http 缓存处理，如果 http 缓存通过校验，则直接响应给用户，如果未通过校验，则继续进行 cdn 缓存的处理，cdn 缓存处理完成后返回给客户端，由客户端进行 http 缓存规则存储并响应给用户。

### 4.3 service worker

`Service Worker` 是服务于前端页面的后台线程，基于 [Web Worker](/big-frontend/前端/html#9web-worker) 实现。有着独立的 js 运行环境，分担、协助前端页面完成前端开发者分配的需要在后台悄悄执行的任务。基于它可以实现拦截和处理网络请求、消息推送、静默更新、事件同步等服务.

#### Service Worker 优势及典型应用场景

- 离线缓存：可以将 H5 应用中不变化的资源或者很少变化的资源长久的存储在用户端，提升加载速度、降低流量消耗、降低服务器压力。如中重度的 H5 游戏、框架数据独立的 web 资讯客户端、web 邮件客户端等

- 消息推送：激活沉睡的用户，推送即时消息、公告通知，激发更新等。如 web 资讯客户端、web 即时通讯工具、h5 游戏等运营产品。

- 事件同步：确保 web 端产生的任务即使在用户关闭了 web 页面也可以顺利完成。如 web 邮件客户端、web 即时通讯工具等。
- 定时同步：周期性的触发 Service Worker 脚本中的定时同步事件，可借助它提前刷新缓存内容。如 web 资讯客户端。

要使用 Service Worker，首先需要注册一个 sw，通知浏览器为该页面分配一块内存，然后 sw 就会进入安装阶段。

```js
// register 注册
// 要使用Service Worker，首先需要注册一个sw，通知浏览器为该页面分配一块内存，然后sw就会进入安装阶段。
const isLocalHost = window.location.hostname === 'localhost';
if ('serviceWorker' in navigator && !isLocalHost) {
  //如果指定的属性在指定的对象或其原型链中，则 in 运算符返回 true。
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-wroker.js') //注册
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

self.addEventListener('install', function (event) {
  //调试时跳过等待过程
  self.skipWaiting();
  // Perform install steps
  //首先 event.waitUntil 你可以理解为 new Promise，
  //它接受的实际参数只能是一个 promise，因为,caches 和 cache.addAll 返回的都是 Promise，
  //这里就是一个串行的异步加载，当所有加载都成功时，那么 SW 就可以下一步。
  //另外，event.waitUntil 还有另外一个重要好处，它可以用来延长一个事件作用的时间，
  //这里特别针对于我们 SW 来说，比如我们使用 caches.open 是用来打开指定的缓存，但开启的时候，
  //并不是一下就能调用成功，也有可能有一定延迟，由于系统会随时睡眠 SW，所以，为了防止执行中断，
  //就需要使用 event.waitUntil 进行捕获。另外，event.waitUntil 会监听所有的异步 promise
  //如果其中一个 promise 是 reject 状态，那么该次 event 是失败的。这就导致，我们的 SW 开启失败。
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('[SW]: Opened cache');
      return cache.addAll(allAssets);
    }),
  );
});

// activated
//如果是第一次加载sw，在安装后，会直接进入activated阶段，而如果sw进行更新，情况就会显得复杂一些
//sw激活阶段,说明上一sw已失效
self.addEventListener('activate', function (event) {
  event.waitUntil(
    // 遍历 caches 里所有缓存的 keys 值
    caches.keys().then(deleteOldCaches),
  );
});

//idle
//这个空闲状态一般是不可见的，这种一般说明sw的事情都处理完毕了，然后处于闲置状态了。
//浏览器会周期性的轮询，去释放处于idle的sw占用的资源。

//fetch
//该阶段是sw最为关键的一个阶段，用于拦截代理所有指定的请求，并进行对应的操作。
//所有的缓存部分，都是在该阶段，这里举一个简单的例子：
//监听浏览器的所有fetch请求，对已经缓存的资源使用本地缓存回复
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      //该fetch请求已经缓存
      if (response) {
        return response;
      }
      return fetch(event.request);
    }),
  );
});
```

该示例展示了 Service Worker 最基本的离线缓存应用，前端在原来的 web 应用中使用 Service Worker 只需要三大步：

1. 切入到`https`；由于 Service Worker 可以劫持连接，伪造和过滤响应，所以保证其在传输过程中不被篡改非常重要。

2. 在`页面加载`的恰当时机注册 Service Worker；示例中在 index 页面的 body onload 事件中注册了同 path 下的 serviceWorker.js 作为 index 页面的服务线程。

3. 编写 serviceWorker 脚本逻辑；serviceWorker 是事件驱动型服务线程，所以 serviceWorker 脚本逻辑中基本都是以事件监听作为逻辑入口，示例中在 serviceWorker 脚本被安装的 `install` 事件中缓存 index 页面主资源及子资源，在 `fetch` 事件中，拦截前端页面发起的资源请求并到之前缓存的 cache 中匹配。

该示例部署到服务器上之后，用户**第一次打开 index 页面，仍然会从服务器上拉取，之后便去安装 Service Worker**，执行 Service Worker 中的 install 事件，浏览器会再次拉取需要缓存的资源，这一次的缓存是否从网络拉取取决于资源设置的过期时间。当 install 事件中的资源均拉取成功，Service Worker 算是安装成功。如果有一个资源拉取失败，此次 Service Worker 安装失败，若用户下次再打开该页面，浏览器仍然会重复之前的安装流程尝试安装。

如果 index 页面的 Service Worker 安装成功，用户再次打开 index 页面发起的资源请求便会先经过 Service Woker 脚本的 `fetch` 事件，在该事件中前端开发可以通过编写逻辑控制请求从网络拉取还是从 cache 中读取或者自己构造一个 response 丢给前端。

#### 需要注意点

1. Service Worker 线程运行的是 js，有着独立的 js 环境，不能直接操作 DOM 树，但可以通过`postMessage`与其服务的前端页面通信。

2. **Service Worker 服务的不是单个页面，它服务的是当前网络 path 下所有的页面**，只要当前 path 的 Service Worker 被安装，用户访问当前 path 下的任意页面均会启动该 Service Worker。当一段时间没有事件过来，浏览器会自动停止 Service Worker 来节约资源，所以 Service Worker 线程中不能保存需要持久化的信息。

3. Service Worker 安装是在后台悄悄执行，更新也是如此。每次新唤起 Service Worker 线程，它都会去检查 Service Worker 脚本是否有更新，如有一个字节的变化，它都会新起一个 Service Worker 线程类似于安装一样去安装新的 Service Worker 脚本，当旧的 Service Worker 所服务的页面都关闭后，新的 Service Worker 便会生效。

### 4.4 WorkBox

由于直接写原生的 sw.js，比较繁琐和复杂，所以一些工具就出现了，而 Workbox 是其中的佼佼者，由 google 团队推出。

#### 使用者

有很多团队也是启用该工具来实现 Service Worker 的缓存，比如说：

- 淘宝首页

- 网易新闻 wap 文章页

- 百度的 Lavas

#### 基本配置

首先，需要在项目的 sw.js 文件中，引入 Workbox 的官方 js，这里是网易有道的静态资源：

```ts
importScripts(
  'https://edu-cms.nosdn.127.net/topics/js/workbox_9cc4c3d662a4266fe6691d0d5d83f4dc.js',
);
```

其中 importScripts 是 webworker 中加载 js 的方式。

Workbox 的缓存分为两种，一种的 `precache`，一种的 `runtimecache`。

##### precache

precache 对应的是在 installing 阶段进行读取缓存的操作。它让开发人员可以确定缓存文件的时间和长度，以及在不进入网络的情况下将其提供给浏览器，这意味着它可以用于创建 Web 离线工作的应用。

工作原理：

首次加载 Web 应用程序时，Workbox 会下载指定的资源，并存储具体内容和相关修订的信息在 indexedDB 中。当资源内容和 sw.js 更新后，Workbox 会去比对资源，然后将新的资源存入 Cache，并修改 [indexedDB](/big-frontend/前端/browser#84-indexdb) 中的版本信息。

```ts
workbox.precaching.precacheAndRoute(['./main.css']);
```

`indexedDB` 中会保存其相关信息，这个时候我们把 main.css 的内容改变后，再刷新页面，会发现除非强制刷新，否则 Workbox 还是会读取 Cache 中存在的老的 main.css 内容。即使我们把 main.css 从服务器上删除，也不会对页面造成影响。所以这种方式的缓存都需要配置一个版本号（hash 参数）。在修改 sw.js 时，对应的版本也需要变更。

使用实践：

一般我们的一些不经常变的资源，都会使用 cdn，所以这里自然就需要支持域外资源了，配置方式如下：

```ts
var fileList = [
  {
    url: 'https://edu-cms.nosdn.127.net/topics/js/cms_specialWebCommon_js_f26c710bd7cd055a64b67456192ed32a.js',
  },
  {
    url: 'https://static.ws.126.net/163/frontend/share/css/article.207ac19ad70fd0e54d4a.css',
  },
];

// precache 适用于支持跨域的cdn和域内静态资源
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(fileList, {
  ignoreUrlParametersMatching: [/./],
});
```

这里需要对应的资源配置跨域允许头，否则是不能正常加载的。且文件都要以版本文件名的方式，来确保修改后 Cache 和 indexDB 会得到更新。

因此这种方式适合于上线后就不会经常变动的静态资源。

##### runtimecache

运行时缓存是在 install 之后，activated 和 fetch 阶段做的事情。既然在 fetch 阶段发送，那么 runtimecache 往往应对着各种类型的资源，对于不同类型的资源往往也有不同的缓存策略。

- Stale While Revalidate

这种策略的意思是当请求的路由有对应的 Cache 缓存结果就直接返回

- Network First

这种策略就是当请求路由是被匹配的，就采用`网络优先`的策略，也就是优先尝试拿到网络请求的返回结果，如果拿到网络请求的结果，就将结果返回给客户端并且写入 Cache 缓存。

- Cache First

这个策略的意思就是当匹配到请求之后直接从 Cache 缓存中取得结果,即`缓存优先`，如果 Cache 缓存中没有结果，那就会发起网络请求，拿到网络请求结果并将结果更新至 Cache 缓存，并将结果返回给客户端。

- Network Only

比较直接的策略，直接强制使用正常的网络请求，并将结果返回给客户端，这种策略比较适合对实时性要求非常高的请求。

- Cache Only

这个策略也比较直接，直接使用 Cache 缓存的结果，并将结果返回给客户端，这种策略比较适合一上线就不会变的静态资源请求。

#### Workbox 工具库原理

简单提几个 Workbox 源码的亮点。

##### 通过 Proxy 按需依赖

熟悉了 Workbox 后会得知，它是有很多个子模块的，各个子模块再通过用到的时候按需 importScript 到线程中。

做到按需依赖的原理就是通过 Proxy 对全局对象 Workbox 进行代理：

```js
new Proxy(this, {
  get(t, s) {
    //如果workbox对象上不存在指定对象，就依赖注入该对象对应的脚本
    if (t[s]) return t[s];
    const o = e[s];
    return o && t.loadModule(`workbox-${o}`), t[s];
  },
});
```

如果找不到对应模块，则通过 importScripts 主动加载：

```js
/**
 * 加载前端模块
 * @param {Strnig} t
 */
loadModule(t) {
  const e = this.o(t);
  try {
    importScripts(e), (this.s = !0);
  } catch (s) {
    throw (console.error(`Unable to import module '${t}' from '${e}'.`), s);
  }
}
```

## 五、浏览器兼容

### 5.1 browserslist

在不同前端工具之间共享目标浏览器和 Node.js 版本的配置。在不同前端工具之间共享目标浏览器和 Node.js 版本的配置。 它用于：

- [Autoprefixer](https://github.com/postcss/autoprefixer)

- [Babel](https://github.com/babel/babel/tree/master/packages/babel-preset-env)，也可以看看站内介绍[Babel](/big-frontend/dev-ops/babel)

- [postcss-preset-env](https://github.com/csstools/postcss-preset-env)

#### 5.1.1 编写规则

defaults: Browserslist 的默认浏览器（>0.5%, last 2 versions, FIrefox ESR, not dead）

5%：通过全球使用情况统计信息选择的浏览器版本

dead：24 个月内没有官方支持或更新的浏览器。目前是 IE 10，IE_Mob 11

last 2 versions：每个浏览器的最新 2 个版本

还有一些不太常用的配置可以查看官网 [browserslist](https://github.com/browserslist/browserslist)

#### 5.1.2 使用方法

在 `package.josn` 中添加 browserslist 字段或根目录下添加 `.browserslistrc` 文件

```json
{
  "browserslist": {
    "production": [">0.2%", "not dead", "not op_mini all"]
  }
}
```

## 六、场景

### 6.1 chrome 查看元素里面灰色的 CSS 属性和被划横线的 CSS 属性分别是什么意思？

灰色：该属性本来就是不可继承的（如 background），该元素类别决定其不可继承的（如有些属性不允许外联元素继承，如 div 是外联元素，其不能继承其父的 color 属性），差不多就这些。

划横线：首先是写错了的或是不支持的（有些浏览器前面会带黄色感叹号），可继承的但是由于优先级问题没有继承被抛弃的。

### 6.2 postMessage

`postMessage()`方法允许来自不同源的脚本采用异步方式进行有限的通信，可以实现跨文本档、多窗口、跨域消息传递。

postMessage 的优点

1. 两个跨域页面的消息传递
2. 多窗口之间的消息传递
3. 嵌套 iframe 的数据传递

`postMessage(data,origin)`方法接受两个参数

- data:要传递的数据，html5 规范中提到该参数可以是 JavaScript 的任意基本类型或可复制的对象，然而并不是所有浏览器都做到了这点儿，部分浏览器只能处理字符串参数，所以需要使用`JSON.stringify()`方法对对象参数序列化.
- origin：字符串参数，指明目标窗口的源，`协议+主机+端口号[+URL]`，URL 会被忽略，所以可以不写，这个参数是为了安全考虑，postMessage()方法只会将 message 传递给指定窗口，当然如果愿意也可以建参数设置为"\*"，这样可以传递给任意窗口，如果要指定和当前窗口`同源的话设置为"/"`。

A 页面: http://a.com

```js
const data = document.getElementById('name').value;
window.frames[0].postMessage(data, 'http://b.com');
```

B 页面监听 message:[http://b.com]

```ts
window.addEventListener(
  'message',
  function (event) {
    // 当我们是父子窗口进行消息传递时，可以使用此判断，只接受父窗口传递来的消息,
    if (event.source !== window.parent) return;
    // 或直接判断源
    if (event.origin !== 'http://example.org:8080') return;
    var data = event.data;
    console.info('message from parent:', data);
  },
  false,
);
```

通过这样的一个传递和接受的过程可以实现一个完整的消息传递。不管 A,B 是否跨域，是否存在嵌套关系，都可以使用 `postMessage` 的方式实现消息传递。

而对于对于`cookie`和`token`等鉴权等问题也可以通过`postMessage`的方式传递

- 安全问题如果您不希望从其他网站接收 message，请不要为 message 事件添加任何事件侦听器。 这是一个完全万无一失的方式来避免安全问题。

如果您确实希望从其他网站接收 message，请始终使用 `origin` 和 `source` 属性验证发件人的身份。任何窗口都可以向任何其他窗口发送消息，并且您不能保证未知发件人不会发送恶意消息。但是，验证身份后，您仍然应该始终验证接收到的消息的语法。否则，您信任只发送受信任邮件的网站中的安全漏洞可能会在您的网站中打开跨网站脚本漏洞。

当您使用 postMessage 将数据发送到其他窗口时，**始终指定精确的目标 origin，而不是 \*。** 恶意网站可以在您不知情的情况下更改窗口的位置，因此它可以拦截使用 postMessage 发送的数据。

无法检查 origin 和 source 属性会导致[跨站点脚本攻击](/big-frontend/运维/frontend-secure#一-跨站点脚本攻击xss)。

### 6.3 浏览器强制刷新是怎么实现的

网站的缓存设置一般是这样的：入口设置 `no-cache` 其他资源设置 `max-age`，这样入口文件会缓存但是每次都协商，保证能及时更新，而其他资源不发请求，减轻服务端压力。

可以通过 is 过滤器来过滤 from-cache 的请求，也就是强缓存的请求：

<img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bf212b412c63418296b7151d96da6b65~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?" />

一般我们都会用强制刷新，也就是 command + shift + R。为什么这样就可以拿到最新的资源了呢？为啥不走强缓存了呢？

探究这个的原理就要抓包来看了：

**会发现这个请求的 Cache-Control 变成了 no-cache，也就是和服务端协商是否要更新本地缓存，这就是强制刷新的实现原理！**

有的同学可能问了，浏览器除了强制刷新，还有一个清空缓存并强制刷新呀，那个是啥意思？

其实很容易理解，强制刷新是设置 `no-cache`，也就是和服务端协商决定用本地的缓存还是下载新的，但有的时候你想更新本地的缓存结果服务端让你用本地的缓存呢？

这时候就可以`清空本地`强缓存再刷新了，也就是这个选项的意思。

## 七、前端数据库

### 7.1 LocalStorage

### 7.2 cookie

### 7.3 sessionStorage；

### 7.4 IndexDB
