---
order: 5
toc: menu
---

# 前端场景题

### 1. 实现垂直居中

1. Flex 布局

```css
.parent {
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
}
```

2. line-height 方法（单行文本） 行高等于高度

```css
.parent {
  height: 200px;
  line-height: 200px;
  text-align: center;
}
```

3. 绝对定位 + transform

```css
.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

### 2. 回流和重绘

1. 回流（Reflow，布局阶段）

- 触发条件：当元素的几何属性变化时，浏览器需要重新计算布局。

- 典型操作：

  - 改变元素大小（width, height, padding, margin, border）
  - 改变元素位置（top, left）
  - DOM 节点的增加/删除
  - 获取尺寸相关属性（offsetTop, clientHeight, scrollTop 等，会强制触发回流）

- 代价：比较昂贵，会影响所有子节点甚至父节点。

2. 重绘（Repaint，绘制阶段）

- 触发条件：当元素的外观（样式）发生变化，但不影响布局。

  • 典型操作： • color • background-color • visibility • outline

- 代价：比回流小，但也会触发渲染。

3. 优化
   - 避免逐条修改样式 → 使用 class 切换
   - 批量 DOM 操作 → documentFragment
   - 使用 transform 和 opacity 替代 top/left 和 visibility
   - will-change: transform; 提前告诉浏览器做 GPU 加速

### 3.flex 的复合属性

flex 是 flex-grow、flex-shrink、flex-basis 的缩写。

```css
flex: <flex-grow> <flex-shrink> <flex-basis>;
```

1. flex-grow

剩余空间的分配比例（默认值 0，不放大）。

2. flex-shrink

空间不足时的压缩比例（默认值 1，允许收缩）

3. flex-basis

项目的初始大小（默认 auto = 根据内容或宽度）

#### 3.1 flex 的常见简写写法

1. `flex: 1;` 元素均分容器宽度

```css
flex-grow: 1;
flex-shrink: 1;
flex-basis: 0%;
```

2.`flex: auto;` 根据内容大小分配，多余空间再平分

```css
flex-grow: 1;
flex-shrink: 1;
flex-basis: auto;
```

3. `flex: none;` 固定大小，不伸缩。

```css
flex-grow: 0;
flex-shrink: 0;
flex-basis: auto;
```

4. `flex: initial;` 初始值，保持内容大小，空间不足时可以压缩。

```css
flex-grow: 0;
flex-shrink: 1;
flex-basis: auto;
```

### 4. Promise 函数底层实现

Promise 是一个 状态机 + 回调队列 的实现。

- 三种状态：pending（进行中）、fulfilled（已成功）、rejected（已失败）
- 状态不可逆：只能从 pending → fulfilled 或 pending → rejected，不能再变。
- 回调异步执行：.then() 注册的回调会放入微任务队列，等待当前宏任务执行完再执行。

简化实现：

```js
class MyPromise {
  constructor(executor) {
    this.state = 'pending';
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      if (this.state === 'pending') {
        this.state = 'fulfilled';
        this.value = value;
        this.onFulfilledCallbacks.forEach((fn) => fn());
      }
    };

    const reject = (reason) => {
      if (this.state === 'pending') {
        this.state = 'rejected';
        this.reason = reason;
        this.onRejectedCallbacks.forEach((fn) => fn());
      }
    };

    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  then(onFulfilled, onRejected) {
    if (this.state === 'fulfilled') {
      queueMicrotask(() => onFulfilled(this.value));
    } else if (this.state === 'rejected') {
      queueMicrotask(() => onRejected(this.reason));
    } else {
      this.onFulfilledCallbacks.push(() => queueMicrotask(() => onFulfilled(this.value)));
      this.onRejectedCallbacks.push(() => queueMicrotask(() => onRejected(this.reason)));
    }
  }
}
```

### 5. qiankun 的原理，和 monorepo 的区别

1. qiankun 的原理（微前端方案）

qiankun 基于 single-spa，实现了一个微前端框架，核心思想是：

> 把不同技术栈的前端应用（React、Vue、Angular 等）像 “微服务” 一样整合在一起，主应用统一调度，子应用独立运行。

核心原理：

    HTML Entry 入口加载
    •	子应用通过 entry（通常是一个 HTML 地址）注册到主应用
    •	qiankun 会下载子应用的 HTML、JS、CSS，并解析注入到主应用中。

    应用沙箱隔离
    •	JS 沙箱：通过 Proxy 或快照（snapshot）机制隔离 window 上的全局变量，避免污染主应用和其他子应用。
    •	CSS 隔离：通过 scoped css（样式前缀）、shadow DOM 或 dynamic style patching 来避免样式冲突。

    生命周期管理
    •	每个子应用都需要暴露 bootstrap、mount、unmount 等生命周期函数。
    •	qiankun 根据路由切换，决定什么时候加载/销毁子应用。

    通信机制
    •	主子应用之间可通过 全局事件总线 或 qiankun initGlobalState 实现状态共享。

✅ 作用：实现多个独立项目的聚合，允许不同技术栈共存，升级/发布相对独立。

2. Monorepo 的原理

Monorepo（单一仓库）是一种 代码管理方式，指的是：

> 把多个项目（package）放在一个 Git 仓库中，通过工具（pnpm workspace、lerna、turborepo、nx 等）来统一管理依赖、构建和发布。

✅ 作用：更方便开发、测试、发布，尤其是团队内多个 package 的协作。

3. qiankun vs Monorepo 的区别

| 对比点 | **qiankun（微前端）** | **Monorepo（单仓库）** |
| --- | --- | --- |
| **定位** | 运行时解决方案（应用聚合、运行时加载） | 工程化管理方案（代码组织、依赖管理） |
| **目标** | 多个独立应用聚合在一个壳里运行 | 多个 package 统一管理开发/构建/发布 |
| **适用场景** | 多团队、跨技术栈、需要独立部署/升级的前端项目 | 单团队、同技术栈、多 package 协同开发 |
| **耦合度** | 运行时解耦，部署粒度是应用 | 开发时耦合更紧，部署粒度是 package |
| **解决的问题** | 兼容多技术栈、渐进式迁移、独立部署 | 提升工程效率、共享依赖、减少重复、优化构建 |
| **代表工具/框架** | qiankun、single-spa、EMP 等 | lerna、pnpm workspace、turborepo、nx 等 |

• qiankun：微前端框架，解决运行时不同前端应用的集成问题，像微服务一样拆应用。

• monorepo：代码管理模式，解决代码组织、依赖共享和构建优化问题，适合组件库和大型项目协作。
