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

- 插件进程 (Plugin Process)：负责控制网页使用到的插件

- GPU 进程 (GPU Process)：负责处理整个应用程序的 GPU 任务

## 2、事件源

获取事件源：通过[回调](https://so.csdn.net/so/search?q=回调&spm=1001.2101.3001.7020)函数中的 e 参数的 target 属性即可获取事件源（e.target）

### 2.1 事件模型

1、原始事件模型（DOM0 级）

- HTML 代码中直接绑定

```js
<input type="button" onclick="fun()">
```

- 通过`JS`代码绑定

```js
var btn = document.getElementById('.btn');
btn.onclick = fun;
```

- 只支持冒泡，不支持捕获
- 同一个类型的事件只能绑定一次

2、标准事件模型（DOM2 级）

事件绑定监听函数的方式如下:

```js
addEventListener(eventType, handler, useCapture);
```

- 事件捕获阶段：事件从`document`一直向下传播到目标元素, 依次检查经过的节点是否绑定了事件监听函数，如果有则执行
- 事件处理阶段：事件到达目标元素, 触发目标元素的监听函数
- 事件冒泡阶段：事件从目标元素冒泡到`document`, 依次检查经过的节点是否绑定了事件监听函数，如果有则执行

3、IE 事件模型（基本不用）

事件绑定监听函数的方式如下:

```text
attachEvent(eventType, handler)
```

- 事件处理阶段：事件到达目标元素, 触发目标元素的监听函数。
- 事件冒泡阶段：事件从目标元素冒泡到`document`, 依次检查经过的节点是否绑定了事件监听函数，如果有则执行

**IE 阻止冒泡**

```js
window.event.cancelBubble = true;
```

### 2.2 事件流

#### 事件捕获阶段(capture phase)

#### 处于目标阶段(target phase)

#### 事件冒泡阶段(bubbling phase)

事件冒泡是一种从下往上的传播方式，由最具体的元素（触发节点）然后逐渐向上传播到最不具体的那个节点，也就是`DOM`中最高层的父节点

**阻止事件冒泡**：

①event.preventDefault()方法，这是阻止默认事件的方法，调用此方法是，连接不会被打开，但是会发生冒泡，冒泡会传递到上一层的父元素；`event.stopPropagation()` 阻止冒泡

② 将回调函数中的返回值 设为 false 也可以阻止默认事件。

### 2.3 Event 对象

event 每个事件函数都有的内置对象，里面储存着事件发生之后的信息

## 3、Event Loop（事件循环机制）

javascript 中先分【同步和异步】，然后事件任务分为【宏任务和微任务】, 执行顺序是先执行微任务再执行宏任务。(异步顺序也是如此)

宏任务：当前调用栈中执行的代码成为宏任务。（定时器等等）。如：整体代码 script,setTimeout, setInterval

微任务：当前（此次事件循环中）宏任务执行完，在下一个宏任务开始之前需要执行的任务,可以理解为回调事件。（promise.then，proness.nextTick 等等）。[Promise](https://so.csdn.net/so/search?q=Promise&spm=1001.2101.3001.7020).then(非 new Promise）

注：如果 then 不是回调函数，new 的 promise 就是同步执行

核心：**同步-->微任务-->宏任务依次执行-->单个宏任务中的同步、微任务、宏任务-->下一个宏任务..**

## 4、浏览器缓存
