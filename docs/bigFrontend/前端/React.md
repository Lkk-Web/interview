---
order: 5
---

# React

## 1、事件机制

React 基于浏览器的事件机制自身实现了一套事件机制，包括事件注册、事件的合成、事件冒泡、事件派发等，在 React 中这套事件机制被称之为合成事件。

在原生事件中，可以通过返回 false 方式来阻止默认行为，但是在 React 中，需要显式使用 e.preventDefault() 方法来阻止。

#### 1.1 setState 的同步与异步

- 在组件生命周期或 React 合成事件中，setState 是异步；
- 在 setTimeout 或者原生 dom 事件中，setState 是同步；

##### 1.1.1 为什么设计异步？

`setState`设计为异步，可以显著的提升性能；

- 如果每次调用 setState 都进行一次更新，那么意味着 render 函数会被频繁调用，界面重新渲染，这样同步更新的效率是很低；
- 如果我们知道可能会得到多个更新，最好批量更新。

如果同步更新了 state，但是还没有执行 render 函数，那么 state 和 props 不能保持同步；

- state 和 props 不能保持一致性，会在开发中产生很多的问题；

##### 1.1.2 setState 为 defer

setState 是一个伪异步，或者可以称为 defer，即延迟执行但本身还在一个事件循环，所以它的执行顺序在同步代码后、异步代码前。

## 2、生命周期

### 2.1 类式编写 生命周期

componentDidMount

componentDidUpdate

componentWillUnmount

### 2.2 useEffect 模拟生命周期

## 3、组件

### 3.1 HOC

### 3.2 受控组件和非受控组件

- 受控组件

一个表单组件，如果它的值是可以被 state 控制的，再通过 onChange 事件与 setState()结合更新 state 属性，那就是受控组件。

- 非受控组件

它的值只能由用户设置，而不是以编程方式设置。如果它的值不能 state 控制的，那就是不受控制组件。如：

```html
<input type="file" />
```

```tsx
import React from 'react';
import { Modal } from 'interview';

export default () => (
  <Modal title="Input file Demo" component={<input type="file" disable="true" />}></Modal>
);
```

## 4、HashRoute

今天部署遇到一个奇怪的问题，前端打包后的文件，在访问的时候没有 basePath，会自动到根目录去寻找，答案是少配置了 HashRoute。

什么是 HashRoute?首先得了解 SPA

### 4.1 SPA

SPA，即单页面应用。单页应用程序 (SPA) 是加载单个 HTML 页面并在用户与应用程序交互时动态更新该页面的 Web 应用程序。浏览器一开始会加载必需的 HTML 、 CSS 和 JavaScript ，所有的操作都在这张页面上完成，都由 JavaScript 来控制。

### 4.2 hash 的特点

- hash 变化会触发网页跳转，即浏览器的前进和后退。

- hash 可以改变 url ，但是不会触发页面重新加载（hash 的改变是记录在 window.history 中），即不会刷新页面。也就是说，所有页面的跳转都是在客户端进行操作。因此，这并不算是一次 http 请求，所以这种模式不利于 SEO 优化。hash 只能修改 # 后面的部分，所以只能跳转到与当前 url 同文档的 url 。

- hash 通过 window.onhashchange 的方式，来监听 hash 的改变，借此实现无刷新跳转的功能。

回到之前的问题，为什么会自动到根目录去寻找。首先因为没有配置 basePath，导致应用根据根路径来映射。然后是 SPA 应用，每次跳转页面，都会导致加上子路径重新变成根路径（并不是相对路劲），因此需要配置 HashRoute。
