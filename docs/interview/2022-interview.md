---
order: 2
toc: menu
---

# 2022 年面试经验

## 网易有道一面（1 个小时）

1、在一个 div 里实现富文本编辑器，可放入图片（类似于 web 微信聊天框）如果从其他地方复制过来的图片在编辑器中怎么显示 contenteditable

2、移动端中用 email 或 iPhone 会被系统识别为超链接，用 html 标签屏蔽 (`<mate>`)

3、垂直居中的所有方法（浅提重绘）

4、flex 的复合属性

5、space-between 和 space-around 的区别

6、简述下 js 阻塞的机制（浏览器 js 引擎）

7、简述下 Promise 函数底层实现

8、普通函数与箭头函数的区别

9、项目中有无单链表的实现，请简述下实现了什么功能

10、二分查找（思路）

11、有看过 React 底层吗

12、Hooks 的所有用法

13、在循环、判断、选择中为什么不能使用 setState

14、除了 setState 能改变状态值，还有什么方法

15、当并发大时，setState 失效应如何解决

16、遇到的技术难题，如何解决，在这个项目中做了哪些难点工作

反问：

1、面试官所在组的技术栈

## 网易雷火一面（40 分钟）

1、自我介绍

2、状态码 304、403

3、强缓存、协商缓冲

4、浏览器内核

5、手撕 lodash find 方法

6、Typescript 的类型 Partial 、required

7、RN 和安卓开发的区别

8、flex 的三个属性（flex-grow，flex-shrink，flex-basis）

9、typeof 和 instanceof

```typescript
typeof 1; // 'number'
typeof '1'; // 'string'
typeof undefined; // 'undefined'
typeof true; // 'boolean'
typeof Symbol(); // 'symbol'
typeof null; // 'object'
typeof []; // 'object'
typeof {}; // 'object'
typeof console; // 'object'
typeof console.log; // 'function'
typeof arguments; // 'object'
```

10、React 中的 Context

11、有没有自动定义过 Hooks

反问：

1、建议和评价

## 滴滴一面（时长 1 个半小时）

全程手撕代码，多考察代码能力

第一部分

1、手撕 promise.all 方法

2、手撕深拷贝

3、手撕检测原型链

第二部分

css 以及一些打印输出函数（较简单，略）

第三部分 算法

二分查找

反问：

1、项目组用的是什么技术栈

2、React 中的 fiber tree、Babel 在项目中有无使用，主要是解决什么问题

3、对我的建议和评价

## 丁香园

### 一、笔试

1、什么是纯函数

2、promise.all 的作用

3、parseFloat、toFixed 方法

4、哪些 css 属性会引起重排（回流）、重绘

5、数组删除和增加的四个方法

### 二、一面

1、flex 的三个属性名

2、简述下 promise

3、promise.all 是串行还是并行的 并发操作、串行执行

4、箭头函数的 this 指向

5、防抖和节流

无反问环节

## 第四范式一面（1 小时）

2022.8.5

1、项目难点

2、js 中的数据类型

3、引用数据类型和基本数据类型有什么区别

4、引用数据类型的 console.log()

5、对剩余参数的处理有了解吗 （组合与管道）

6、解释下 arguments

7、了解 Map 吗

8、Map 和 Object 有什么区别

JS 项目中究竟应该使用 Object 还是 Map？ - 知乎 (zhihu.com)

9、compose 函数手撕

反问：

1、项目组用的是什么技术栈

React + Hooks + Nestjs

2、如果用 React，项目一般用的 React 的类式编程还是函数式编程？

类式编程比较少（老项目会用），现在基本函数式编程

## 字节跳动，data 一面（50 分钟）

2022.8.23

1、为什么会选择前端

2、怎么学习前端

3、Taro 为什么能构建小程序

4、虚拟 dom 的作用

5、事件循环

6、宏任务、微任务有哪些

7、script 标签中 defer 和 async 的区别

8、手撕发布订阅

9、最近关注的前端社区的技术

反问：

1、项目组用的是什么技术栈

React + Hooks + Nodejs 提供数据服务

2、建议和评价

深度欠缺，原生 js 不熟练

## 网易有道一面（8.25 25 分钟）

1、怎么学习的前端（因为我 24 届，比较好奇）

2、项目难点，怎么解决

3、React 的可控组件和不可控组件

4、promise 的 api

5、js 的基本数据类型

6、数组的方法

7、push 返回什么

反问：

1、面试流程

2、评价和建议（感觉我都知道，但有点紧张）

## 知乎日常（1 个小时 OC）

2022.9.5

1、flex 实现三栏布局

2、实现一个元素的隐藏（答了 4 种）

3、实现垂直居中（答了 3 种）

4、数据类型（顺提 const 引用打印）

5、Array 的方法，哪些不改变原数组

6、异步输出题

7、React dva

8、React 如何命中路由

9、git rebase 和 git merge 区别

反问：

1、所在业务、部门

2、评价

3、聊天（面试官和我说可能就只有一面，果然第二天 hr 面了）

## 百度商业智能一面(1 个小时)

2022.9.9

1、对 React Hooks redux dva 的理解

2、p 和 span 的区别

3、src 和 href 的区别

4、script 的 defer 和 async 的区别，执行顺序

5、display none 和 visible hidden 的区别（浅提重绘）

6、this 的理解

7、作用域的理解

8、call apply bind 的区别

9、老规矩 浅拷贝题、异步输出题

```js
var b = 20;
function fn() {
  var a = 10;
  function c() {
    console.log(a + b);
  }
  c();
}
b = 200; // 同步执行时，被覆盖成200
fn(); //210   答错了，丢人
```

10、--proto-- 和 prototype 的区别

11、算法题

- 股票最大利润
- 忘记了（中等题）

---

知乎实习后面试

## 小红书 安全一面（1 个小时）

11.25

1、个人介绍及介绍项目

2、常用的 webpack `Loader` 和 `plugin`，如何实现一个 Loader

3、`React 18 `有哪些改进

4、 了解 React18 中的 `Concurrent` 吗

5、code review 的 diff 和 React diff 算法的相同点

6、有哪些优化策略

7、CDN 缓存原理

8、做题

- 手撕防抖
- 手撕发布订阅

反问：

1、业务线

2、评价和建议

经验较丰富，沟通很舒服，但 coding 基础也要注意

3、办公地点是否可选

## 字节 搜索一面（1 个半小时）

12.1

1、自我介绍

2、Webpack 怎么调优

3、webpack `Loader` 和 `plugin` 的区别

4、Babel 是怎么编译的

5、Babel 的 html 和 css 是怎么处理的

6、权限路由怎么做的

7、cookie 和 token

8、在 https 下 cookie 怎么设置为不可更改

9、hashRoute 和 historyRoute 依赖的 api 是什么

10、history.push 为什么能渲染

11、https 的过程

12、简单说下微前端

13、如何确认一个 html 被加载完毕

14、九宫格怎么实现，多种方案

15、简单说下 React18

16、React 18 中什么 Api 可以决定渲染时机

17、React 18 的 流式 SSR 是什么原理

18、网页的性能指标是什么？

19、如何实现懒加载（嘴撕）

20、Taro 是怎么编译的

21、node 中的 Event Loop

22、怎么学习前端，方向，途径

23、做题

1. [最接近的三数之和](https://leetcode.cn/problems/3sum-closest/description/)

反问：

1、业务线

2、有用 node 的业务吗

3、建议

1. 某些方面基础还是不够
2. 工程化方案要整理和务实一下

## 百度 HCG 智慧医疗部

### 一面（12.8）50 分钟

1、自我介绍

2、实现左侧固定右侧自适应

3、回流和重绘

4、从 CSS 方面怎么优化性能

5、怎么判断数据的类型

6、「 ？？」逻辑运算符的用法和场景

7、var、let、const

8、浏览器 Event Loop

9、Promise 什么时候是异步的

10、Hooks 为什么不能在 if 或循环中使用

11、React key 作用

12、实习项目为什么采用微前端

13、实习期间做过什么优化

14、聊天（20mins）

反问：

1、为什么这么简单

2、业务线

3、工作强度怎么样

### 二面（12.14 OC）30 分钟

1、自我介绍

2、挖项目
