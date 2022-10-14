---
order: 4
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

### 3.2 可控组件和不可控组件

一个表单组件，如果它的值是可以被 state 控制的，那就是受控组件。如果它的值不能 state 控制的，那就是不受控制组件
