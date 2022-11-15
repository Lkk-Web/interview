---
order: 6
---

# 浏览器

## 1、浏览器进程

在 Chrome 中，主要的进程有 4 个：

- 浏览器进程 (Browser Process)：负责浏览器的 TAB 的前进、后退、地址栏、书签栏的工作和处理浏览器的一些不可见的底层操作，比如网络请求和文件访问。

- 渲染进程 (Renderer Process)：负责一个 Tab 内的显示相关的工作，也称渲染引擎。

  - JavaScript 引擎线程
  - GUI 渲染引擎线程

  GUI 线程就是渲染页面的，解析 HTML 和 CSS，然后构建成 DOM 树和渲染树。

  ```
  A.处理html生成 DOM（Document Object Model）Tree
  B.处理css生成 CSSOM（CSS Object Model）Tree
  C.DOM树与CSS-DOM树合并为Render树
  D.对Render树进行布局计算
  E.遍历Render树的每一个节点绘制到屏幕
  ```

  - 事件触发线程
  - 定时触发器线程
  - 异步 http 请求线程

- GPU 进程 (GPU Process)：负责处理整个应用程序的 GPU 任务
- 网络进程
- 插件进程 (Plugin Process)：负责控制网页使用到的插件

## 2、事件源

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

## 3、Event Loop（事件循环机制）

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

### 3.2.1 微任务

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

## 4、浏览器缓存

### 4.1 service worker

### 4.2 强缓存与协商缓存（http 缓存）

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

### 4.3 CDN 缓存

cdn 缓存是一种服务端缓存，CDN 服务商将源站的资源缓存到遍布全国的高性能加速节点上，当用户访问相应的业务资源时，用户会被调度至最接近的节点最近的节点 ip 返回给用户，在 web 性能优化中，它主要起到了，缓解源站压力，优化不同用户的访问速度与体验的作用。

#### 缓存规则

与 http 缓存规则不同的是，这个规则并不是规范性的，而是由 cdn 服务商来制定，我们以腾讯云举例，打开 cdn 加速服务配置，提供给我们的配置项只有文件类型（或文件目录）和刷新时间，意义也很简单，针对不同文件类型，在 cdn 节点上缓存对应的时间。

<image src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/11/8/166f2735f65e8be9~tplv-t2oaga2asx-zoom-in-crop-mark:4536:0:0:0.image'/>

#### http 缓存与 cdn 缓存的结合

当我们分别理解了 http 缓存配置和 cdn 缓存配置后，我们还有一件事情，就是理解二者结合时，请求的流向问题.

当用户访问我们的业务服务器时，首先进行的就是 http 缓存处理，如果 http 缓存通过校验，则直接响应给用户，如果未通过校验，则继续进行 cdn 缓存的处理，cdn 缓存处理完成后返回给客户端，由客户端进行 http 缓存规则存储并响应给用户。

## 5、浏览器兼容

### 5.1 browserslist

在不同前端工具之间共享目标浏览器和 Node.js 版本的配置。在不同前端工具之间共享目标浏览器和 Node.js 版本的配置。 它用于：

- [Autoprefixer](https://github.com/postcss/autoprefixer)

- [Babel](https://github.com/babel/babel/tree/master/packages/babel-preset-env)

- [postcss-preset-env](https://github.com/csstools/postcss-preset-env)

#### 5.1.1 编写规则

defaults: Browserslist 的默认浏览器（>0.5%, last 2 versions, FIrefox ESR, not dead）

5%：通过全球使用情况统计信息选择的浏览器版本

dead：24 个月内没有官方支持或更新的浏览器。目前是 IE 10，IE_Mob 11

last 2 versions：每个浏览器的最新 2 个版本

还有一些不太常用的配置可以查看官网

#### 5.1.2 使用方法

在 `package.josn` 中添加 browserslist 字段或根目录下添加 `.browserslistrc` 文件

```json
{
  "browserslist": {
    "production": [">0.2%", "not dead", "not op_mini all"]
  }
}
```
