# 前端结构化面试题

## 释义

P2 = **[MUST]**

P2.5 ~ P3 =** [>= 2.5]**

P3 ~ above =** [>= 3]**

加分项 = **[*]**

在候选人声明拥有某项知识背景下 (e.g. Typescript / Rxjs / React)，则必须掌握的 = **[*Required]**

## 专业能力

### 开发语言技能

考察点:代码质量, 前端基础, 开发工具, 异步编程

- 了解 ECMAScript 最新规范并了解常用的特性以及最新的 HTML5 内容

  - ES6

    - let、const 区别是什么 **[MUST]**

      - const 定义的 Array 中间元素能否被修改 ? 如果可以,那 const 修饰对象有什么意义 **[MUST]**

      - 哪些语法中会存在块级作用域 **[MUST]**

    - new 的过程中做了什么事 **[MUST]**

    - 箭头函数有什么作用 **[MUST]**

    - Map、Set 是什么，它们和传统的 object 有什么区别 **[MUST]**

    - WeakMap 和 WeakSet 呢？什么场景下使用它们 **[*]**

    - Proxy 是什么 **[>= 2.5]**

    - 如何实现迭代器 **[>= 2.5]**

    - Generator 有什么作用 (非异步控制的场景下) **[>= 2.5]**

    - 在 ES6 的语境下如何实现一个 Private 属性 **[*]**

    - 如何使用 call/apply 实现一个 ES3 compitable 的 bind **[MUST]**

    - 什么是临时性死区 **[>= 2.5]**

    - 什么是严格模式 **[MUST]**

    - Object.defineProperty 的使用方法 **[MUST]**

    - for-of 的使用方法, 如何创建一个对象并允许被使用 for-of 迭代 **[>= 2.5]**

    - 引用传递和值传递的区别是什么 **[MUST]**，JS 的采取的策略又是什么

      - 正确答案是 call by sharing (可以理解为 CoW - copy on write)

  - HTML5

    - SSE (server sent event) 是什么 **[*]**

    - prefetch、preconnect、preload 是什么，使用过吗 **[>= 2.5]**

    - localStorage 和 sessionStorage 的区别是什么 **[MUST]**

    - service-worker 是什么？除了可以缓存离线资源以外，它还有什么用处 (Push API，fully network I/O control etc) **[>= 2.5]**

    - requestAnimationFrame 是什么，有什么作用，它和 setTimeout 的区别是什么？**[MUST]**

    - requestIdleCallback 是什么 **[*]**

    - web-worker 有什么作用 **[*]**

      - 如何和 web-worker 通讯

    - WebRTC 是什么 **[*]**

    - shadow-dom 是什么，Web Components 是什么 **[>= 2.5]**

  - JS

    - debounce/throuttle 是什么，分别适用什么场景 **[MUST]**

    - 什么时候会使用 css3 做动画？什么时候使用 js 做动画？ **[MUST]**

    - 请简述 UMD，CommonJS 规范 **[MUST]**

      - 以及 ES module **[*]**

    - 请简述中 Javascript 中的 this **[MUST]**

      - 哪些情况下，this 可能出现非预期的行为 (指向混乱)，怎么解决

- 熟悉 HTTP 协议，熟悉 RESTful 规范

  - 如何解决跨域问题 **[MUST]**

  - 知道哪些常用的 HTTP 状态码 ? **[MUST]**

  - HTTP 协议大概组成是什么 **[MUST]**

  - cookie 和 session 的区别是什么 **[MUST]**

  - e-tag 是什么 **[MUST]**

  - cache-control 是什么 **[MUST]**

    - 强制缓存 / 协商缓存

  - 如何指定一个自定义头部 **[MUST ]**

  - keep-alive 是什么意思

  - GET / POST 的区别是什么 **[MUST]**

  - 如何解析一个 HTTP packet

  - HTTP2 有哪些特性 **[>= 2.5]**

  - QUIC 是什么 **[*]**

  - RESTful 规范是什么 **[MUST]**

  - 请手绘一个 B/S 架构下，一次 GET 请求的流程，并尽可能标明相关可能参与的技术点，细节越详细越好 **[MUST]**

- 了解浏览器安全规范、Web 安全标准

  - XSS 和 CSRF 是什么 **[MUST]**

    - 有哪些手段可以防御 XSS ?

    - 存储型 XSS 和 反射型 XSS 区别是什么

    - 如何防御 CSRF，现代的 SPA 架构下如何防御 CSRF

  - 假设您现在正在逛微博，此时发现微博上有一个 XSS 漏洞，请问您可以做什么，怎么做。

    - 假设您是微博的前端工程师，请问如何防御

  - 什么是 ReDoS (REGEXP) **[*]**

  - 什么是 哈希洪水攻击 **[*]**

  - 什么是 SQL injection **[*]**

  - 请解释一下 JavaScript 的同源策略，为什么需要同源策略 **[MUST]**

- 熟练使用 Callback、Promise、async/await 编程

  - Promise 是什么，解决了什么问题 **[MUST]**

  - Promise 的三个状态 (Rejected、Pending、Fullfuiled) 是什么 **[MUST]**

  - Promise.race 、Promise.all **[MUST] **以及最新的 Promise.any 分别有什么作用 **[*]**

  - Promise.then 是什么时候执行的 **[MUST]**

  - async/await 和 co-yield 的编程模型有什么区别 **[>= 2.5]**

  - async - await 的编译原理 **[*]**

- 熟练使用 Git 工具 **[MUST]**

  - git push

  - git rebase

  - git cherry-pick

  - git stash

- 浏览器 & Javascript engine

  - 事件循环是什么? 宏任务和微任务是什么 **[>= 2.5]**

  - js script 文件异步加载的方式 **[MUST]**

  - 事件捕获和事件冒泡的基本流程? **[MUST]**

    - 听说过 passive 吗，有什么作用 **[*]**

  - 请描述浏览器渲染一个页面的大致流程 **[>= 2.5]**

  - 浏览器跨标签通信 **[*]**

    - service-worker

    - shared-worker (safari 因为安全问题拒绝实现 )

    - local-storage event

    - boardcast-channel

  - 请简述 CSS3 GPU 加速的原理，为什么可以加速 **[>= 2.5][*required]**

    - 有缺点吗

  - 浏览器的内存回收机制是什么

    - 新 / 老生代

      - 新生代用的 copying GC

      - 全局默认采用 incremental marking + lazy sweeping

    - 如何观察当前页面是否存在内存泄漏 **[>= 2.5]**

    - minor GC / major GC **[*]**

    - 标记清除 (mark-sweep) **[>= 2.5]**

      - 标记清除的流程是什么样的

      - 可达性分析算法

    - STW (stop the world)

    - 引用计数 (古老知识，optional) **[*]**

      - 有什么缺点

      - IE 为什么会发生内存泄漏

    - safari 使用并发 GC 机制 - Riptide **[*]**

      - [**https://webkit.org/blog/7122/introducing-riptide-webkits-retreating-wavefront-concurrent-garbage-collector/**](https://webkit.org/blog/7122/introducing-riptide-webkits-retreating-wavefront-concurrent-garbage-collector/)

  - WebAssembly 是什么，你对它有什么看法 **[*]**

  - binaryAST 是什么 **[*]**

  - v8 hidden class 是什么 **[*]**

  - Crankshaft、Ignition、TurboFan 是什么 **[*]**

- CSS

  - 请大致描述 Flex 和 Grid

  - 重排重绘是什么，什么场景下可能发生重排、重绘 **[MUST]**

  - CSS 的优先级大致如何计算 **[MUST]**

  - 了解过什么是格式化上下文 (Formatting Contexts) 吗

  - visbility: hidden 和 display: none 有什么区别 **[MUST]**

  - web animation 标准 **[*]**

  - CSS houdini 是什么，有什么作用 **[*]**

  - etc ...

- 精通 ECMAScript / Typescript，了解并阅读过规范 **[>= 3]**

- 精通浏览器内存回收机制，性能优化 **[>= 3]**

- 能主导大型/重要的功能或者模块开发，提供完整的、可执行、可伸缩的解决方案 **[>= 3]**

- 擅长、掌握 Web 体系中的多个领域 (安全、性能优化、组件化体系、编程语言、浏览器机制、端到端方案设计) **[>= 3]**

- 对大型前端应用设计、架构拥有丰富经验 (>= 15w lines) **[>= 3]**

- 了解、掌握 Rxjs **[\***]\*\*

  - 什么是 switchMap **[*Required]**

  - Subject 和 Observable 有什么区别 **[*Required]**

  - cold / hot observable 是什么意思

  - rxjs 的 scheduler 是什么，有什么作用

### React

主要考察: React 基础、React 理解、组件设计模式

- React.Component、React.PureComponent 以及 Functional Component 有什么区别 **[*Required]**

- 什么是合成事件，有什么用 **[>= 2.5]**

  - 如何在合成事件中访问到原始事件对象

  - 假如我要在获取了合成事件后，需要在之后的某个 setTimeout 回调中使用该事件应该怎么办

  - 如何在 React 中使用事件捕获

- 使用过 React.hook 吗 ? 谈谈你的看法 **[*]**

  - 你觉得它有什么缺点 ?

  - 为什么 React 官方要求 hook 不能被嵌套必须写在 top-level **[>= 2.5]**

- 对 React 新的生命周期有什么了解 **[*Required]**? 你知道 React Core Team 为什么要设计新的生命周期吗 **[*]**

- React DOM Diff 的过程是什么样的 **[*Required]**

  - 为什么传统树的 Diff 复杂度是 O(n3) 而 React 可以做到 O(n) **[*Required]**

  - key 在其中有什么作用，有什么好的 key 的取值策略吗 **[*Required]**

- render calback pattern 是什么 **[*]**

- 如何解决 props 层级过深的问题

- 对 React 16 有什么了解

  - 什么是 Fiber **[>= 2.5]**

  - 为什么 Fiber 可以做到非栈执行，明明 JS 的语义是 run to completion **[>= 3]**

- 假设公司的业务中需要你沉淀一个组件 (Tab) 请问你会怎么设计 ? **[>= 2.5]**

  - 接口设计

  - 实例的 API 设计

  - Dumb/Smart (受控组件/非受控组件)

  - 场景以及使用模式

  - 灵活性

  - 单元测试

  - 文档

## 前端工程化

- 怎么看待 Gulp 和 Webpack？**[MUST]**

  - Webpack 的编译原理、构建流程

- 如何加速 Webpack 的编译 **[>= 2.5]**

- 有没有写过 Webpack 的 loader 或者 plugin？**[*]**

  - 两者有什么区别 **[*Required]**

- 有没有写过 babel / typescript 的插件或者 eslint / tslint plugin **[*]**

- dva 是什么 ? 您觉得它解决了什么问题，**有什么缺点吗 [*Required]**

- redux 是什么 ? 您觉得它解决了什么问题，**有什么缺点吗 [*Required]**

- 你觉得前端工程化应该做一些什么？**[>= 2.5]**

- 介绍几种你使用过的 CSS Preprocessors，并分别举例它们的优缺点 ** [*Required]**

- 你认为应该如何设计一个健康的 CI/CD 流程 **[>= 2.5]**

## 计算机科学

### 基础

- 冒泡排序和快速排序的区别是什么 **[MUST]**

- heap (堆) / stack (栈) 的区别

- 如何实现二叉树翻转

  - 或者考二叉树路径求和

- 给定一个有序的数字数组，请问如何最快找到目标元素 **[MUST]**

  - 如何实现该算法 ？

- 听说过 CRDT / OT 算法吗 **(thoughts optional)**

- 正则表达式中的 +、\*、? 分别代表什么意思 **[MUST]**

- 解释一下什么是 并行/并发，并给出一个例子

- 如何判断链表是否有环

- TCP / UDP  的区别

- 假设现在有一个产品经理，需要你实现一个上传文件的功能: **[MUST]**

  - 有一个文件列表，其中 10 个文件，如何让它们依序上传 ？

  - 只能用 Promise

  - 若干个呢

### 设计模式

- 你如何看待 GoF (设计模式) 这本书 **[*]**

  - 尽信书则不如无书

  - 完全通篇批判则又过于偏激

  - **期待候选人辩证的看设计模式**

- 如何编写单元测试，需要注意的点有哪些 **[>= 2.5]**

  - 如何保证自己的代码是易测的

  - 如果两个模块有依赖关系，你会如何实现它们的依赖关系？import？constructor？如果要测试这两个模块怎么办？

- 什么是 IoC、DI **[*Required]**

- 面向对象的六个设计模式 **[\*][>= 3]**

  - SRP (Single Responsibility Principle) 单一职能

  - LSP (Liskov Substiution Principle) 里式替换

  - OCP (Open Close Principle) 开闭原则

  - DIP (Dependence Inversion Principle) 依赖倒置

  - ISP (InterfaceSegregation Principles) 接口隔离

  - LOD (Law of Demeter) 迪米特原则

- 什么是响应式编程模式 (Reactive Programming) **[>= 3]**

  - 什么场景适合这个模式

- 是什么是 DDD 以及 CQRS **[>= 3]**

### 编程语言

- babel 是如何将 ES6+ 代码转换为 ES3/ES5 的 **[>= 2.5]**

  - 基本认知即可 (source to source transpile)，但候选人说的越详细越好

- 什么是 JIT 、AOT **[*]**

- 什么是编译期，什么是运行时，请举个例子 **[MUST]**

- 除了 Javascript，您是否还掌握其他语言 **[*]**

  - 满分 10 分，请为它们打一个分

  - 请分别谈谈你对它们的看法

- Typescript **[**]\*\*

  - 如何看待静态类型 **[*Required]**

  - 什么是泛型 **[*Required]**

    - 如何写泛型约束

    - 默认泛型是什么意思

  - Conditional Type 是什么

  - Type Guard 是什么 **[*Required]**

  - 基于表达式的 control flow 是什么

  - 如何做手动类型收敛 **[*Required]**

  - 类型擦除 (Type Erasure) 是什么 **[*]**

- 什么是 Sum Type、什么是 Product Type **[*]**

- ad-hoc polymorphism / parameter polymorphism 是什么 **[*]**

- 什么是协变和逆变 **[*]**

- 你对函数式编程有什么了解？ **[*]**

  - 纯函数

  - 副作用

  - 引用透明

  - 可预测性

  - 无竞争 / 天然易并行

  - 声明式

  - lambda 的加持下，拥有高度灵活性

  - 函数是一等公民

  - 可缓存

  - 组合性

  - etc

### **Node.js**

- node.js 侧的事件循环与浏览器侧有什么区别

- 为什么 node.js 可以实现高并发

- 掌握 node.js 异步编程

- 掌握 node.js stream/ http/ events 等核心模块

- node.js 中的 Buffer 如何应用

- nextTick, setTimeout 以及 setImmediate 三者有什么区别 ?

- TCP 粘包是怎么回事，如何处理 ? UDP 有粘包吗 ?

## 开放性问题

- 假设您在上一个迭代刚上线了一个新功能，和您对接的客服同学说：用户反馈现在该页面**很慢**，请问您怎么分析这个问题，**请给出推导逻辑，结果不重要。** **[>= 2.5] **

- 假设有一个 SPA 的页面，此时正在进行 M 个 ajax 请求，突然用户切换了当前页面，请问此时这些请求应该怎么处理？

- 假设你现在在家，你曾经在过去的某一天访问过 百度，那么请问，此时你重新在浏览器里输入 www.baidu.com 回车，此时你看到的可能是哪种缓存，为什么。 (考察用户对于 http 缓存模型的认识)

- 假设你现在要面临一个 to B 的 HR 领域产品需要搭建，在前端领域，做系统设计你会有哪些考虑点，技术栈会如何取舍，现在流行的技术、概念如何在里面运用？

## 学习能力

- 按照要求，自觉完成任务 **[MUST]**

- 当职责范围内出现问题时，主动承担责任、寻找解决方案 **[MUST]**

- 面对困难和障碍展现出坚持并积极寻找解决的办法 **[MUST]**

- 积极正面的看待问题，敢于接受不熟悉的任务 **[MUST]**

- 不满足现状，敢于突破舒适区，勇于尝试挑战性任务

- 关注公司长远利益，实施为长期战略打下坚实基础的行为

## 项目管理

- 给自己的开发工作指定细分的开发计划，控制整个开发进度 **[MUST]**

- 在项目中协调其他部门指定技术方案 **[MUST]**

- 项目相关方有效沟通，管理其需要、关注、期望

- 熟练掌握项目的完整生命周期

- 熟练控制项目多个制约因素 (范围、质量、进度、预算、资源、风险)

## 业务能力

- 快速响应产品需求 **[MUST]**

- 努力澄清需求，并能准确分析出对应的技术细节 **[MUST]**

- 掌握需求内容，熟悉领域知识 **[MUST]**

- 对技术难点能够自助进行前期调研 **[MUST]**

- 能够在负责的业务上有独立的见解，能出合理的意见

- 对领域知识点有较深的见解

- 能组织团队一起分析需求难点

- 能前期通过沟通降低风险以及控制规模复杂度

- 能够全局规划和解决产品线的业务问题

## 笔试题

> 请手动实现一个简单版本的 JSON.stringify 方法 **[MUST]**

```typescript
function stringify(target: object, indent: number): string {
  // write your code
}
```

> 实现一个 getElementById 方法 **[MUST]**

- 给定一个 document 节点，找到其子节点中符合目标 ID 的节点

- 允许用递归实现

- 如果不用递归怎么实现

```typescript
function getByElementId(el: HTMLElement, id: strirng): HTMLElement | null {
  // write your code
}
```

> 实现一个 requests 函数，要求可以对多个 url 进行请求，可以指定最大并发数，以及指定自定义头部 **[MUST]**

```none
请从函数签名开始设计
```
