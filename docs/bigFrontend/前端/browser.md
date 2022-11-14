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

### 4.2 强缓存与协商缓存

### 4.3 CDN 缓存

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
