---
order: 5
---

# React

React 18:

- [Concurrent Mode](/big-frontend/前端/react#72-react-18-concurrent-mode)
- [startTransition](/big-frontend/前端/react#73-starttransition)
- [自动批处理 Automatic Batching](/big-frontend/前端/react#74-自动批处理-automatic-batching)
- [流式 SSR](/big-frontend/前端/react#75-流式-ssr)
- 新 Hooks:[useDeferredValue](/big-frontend/前端/react#45-usedeferredvalue)、[useSyncExternalStore](/big-frontend/前端/react#46-usesyncexternalstore)、[useInsertionEffect](/big-frontend/前端/react#47-useinsertioneffect)

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

- componentDidMount

componentDidMount() 在组件挂载后 (插入 DOM 树后) 立即调用，componentDidMount() 是发送网络请求、启用事件监听方法的好时机，并且可以在 此钩子函数里直接调用 setState()

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

### 4.5 useDeferredValue

React 18 新 hook,useDeferredValue 可以让一个 state 延迟生效，**只有当前没有紧急更新时，该值才会变为最新值**。useDeferredValue 和 startTransition 一样，都是标记了一次非紧急更新。

```js
const deferredValue = useDeferredValue(value);
```

### 4.6 useSyncExternalStore

useSyncExternalStore 能够让 React 组件在 Concurrent Mode 下安全地有效地读取外接数据源。

在 Concurrent Mode 下，React 一次渲染会分片执行(以 fiber 为单位)，中间可能穿插优先级更高的更新。**假如在高优先级的更新中改变了公共数据(比如 redux 中的数据)，那之前低优先的渲染必须要重新开始执行，否则就会出现前后状态不一致的情况**。useSyncExternalStore 一般是`三方状态管理库`使用，一般我们不需要关注。

```ts
const state = useSyncExternalStore(subscribe, getSnapshot[, getServerSnapshot]);
```

### 4.7 useInsertionEffect

这个 Hooks 只建议 css-in-js 库来使用。这个 Hooks 执行时机在 DOM 生成之后，`useLayoutEffect` 生效之前，一般用于提前注入`<style>`脚本。

SPA（Single Page Application），即单页面应用。单页应用程序 (SPA) 是加载单个 HTML 页面并在用户与应用程序交互时动态更新该页面的 Web 应用程序。浏览器一开始会加载必需的 HTML 、 CSS 和 JavaScript ，所有的操作都在这张页面上完成，都由 JavaScript 来控制。

MPA（Multi Page Application）指有多个独立的页面的应用，每个页面必须重复加载 js,css 等相关资源。多页应用跳转，需要整页资源刷新。

#### 区别

| - | SPA | MPA |
| :-: | :-: | :-: |
| 资源文件(css，js) | 组件公用的资源只需要加载一次 | 每个页面都要自己加载公用的资源 |
| 路由模式 | hash / history | 链接跳转 |
| 适用场景(SEO) | 不利于 SEO（可借助 SSR 优化 SEO），适用于经常切换页面的场景和数据传递较多的场景 | 适用于对 SEO 要求较高的应用 |
| 首屏时间 | 首屏时间慢，首屏时需要请求一次 html，同时还要发送一次 js 请求，两次请求回来了，首屏才会展示出来 | 首屏时间快，访问页面的时候，服务器返回一个 html，页面就会展示出来，这个过程只经历了一个 HTTP 请求 |

## 4、HashRoute & HistoryRoute

今天部署遇到一个奇怪的问题，前端打包后的文件，在访问的时候没有 basePath，会自动到根目录去寻找，答案是少配置了 HashRoute/HistoryRoute。

| hash | history |
| :-: | :-: |
| 有 # 号 | 没有 # 号 |
| 兼容到 IE8 | 兼容到 IE8 |
| 实际的 url 之前使用哈希字符，这部分 url 不会发送到服务器，不需要在服务器层面上进行任何处理 | 每访问一个页面都需要服务器进行路由匹配生成 html 文件再发送响应给浏览器，消耗服务器大量资源 |
| 不需要服务器任何配置 | 需要在服务器配置一个回调路由 |

### 7.1 Fiber

### 7.2 React 18 Concurrent Mode

Concurrent Mode(以下简称 CM)翻译叫并发模式，这个概念我已经听了好多年了，并且一度非常担忧

- React 官方憋了好多年的大招，会不会是一个破坏性不兼容的超级大版本?就像 `VUE v3` 和 `v2`。
- 现有的生态是不是都得跟着大版本升级?比如 `ant design`，`ahooks` 等。

> 随着对 CM 的了解，我发现它其实是人畜无害的。

CM 本身并不是一个功能，而是一个底层设计，它使 React 能够同时准备多个版本的 UI。

在以前，React 在状态变更后，会开始准备虚拟 DOM，然后渲染真实 DOM，整个流程是串行的。一旦开始触发更新，只能等流程完全结束，期间是无法中断的。

<img src="https://oss.kyingsoft.cn/blogSource/08dfc4794eccd7a8c11420640db5ab6d6f3fc8.jpeg"/>

在 CM 模式下，React 在执行过程中，每执行一个 `Fiber`，都会看看有没有更高优先级的更新，如果有，则当前低优先级的的更新会被暂停，待高优先级任务执行完之后，再继续执行或重新执行。

<img src="https://oss.kyingsoft.cn/blogSource/61eceb680dc5e91af46167d56f19fb9fadf943.jpeg"/>

不过对于普通开发者来说，我们一般是不会感知到 CM 的存在的，在升级到 React 18 之后，我们的项目不会有任何变化。

我们需要关注的是基于 CM 实现的上层功能，比如 Suspense、Transitions、streaming server rendering(流式服务端渲染)， 等等。

React 18 的大部分功能都是基于 CM 架构实现出来的，并且这这是一个开始，未来会有更多基于 CM 实现的高级能力

### 7.3 startTransition

React 的状态更新可以分为两类：

- 紧急更新(Urgent updates)：比如打字、点击、拖动等，需要立即响应的行为，如果不立即响应会给人很卡，或者出问题了的感觉
- 过渡更新(Transition updates)：将 UI 从一个视图过渡到另一个视图。不需要即时响应，有些延迟是可以接受的。

很遗憾的是，CM 只是提供了可中断的能力，默认情况下，所有的更新都是紧急更新。

这是因为 React 并不能自动识别哪些更新是优先级更高的。所以它提供了 `startTransition` 让我们手动指定哪些更新是紧急的，哪些是非紧急的。

```js
// 紧急的
setInputValue(e.target.value);
startTransition(() => {
  setSearchQuery(input); // 非紧急的
});
```

光用文字描述大家可能没有体验，接下来我们通过一个示例来认识下可中断渲染对性能的爆炸提升。

如下图，我们需要画一个毕达哥拉斯树，通过一个 `Slider` 来控制树的倾斜。

<img src="https://kyingsoft.oss-cn-hangzhou.aliyuncs.com/blogSource/c58212327f13004d07a1500ed193edae49719e.gif" />

当数的节点足够大时，已经卡到爆炸了。在 React 18 以前，我们是没有什么好的办法来解决这个问题的。但基于 React 18 CM 的可中断渲染机制，我们可以将树的更新渲染标记为低优先级的，就不会感觉到卡顿了。

我们通过 `startTransition` 标记了非紧急更新，让树的更新变成低优先级的，可以被随时中止，保证了高优先级的 `Slider` 的体验。

React 18 提供了 `useTransition` 来跟踪 `transition` 状态。

```js
const [treeLeanInput, setTreeLeanInput] = useState(0);
const [treeLean, setTreeLean] = useState(0);
// 实时监听 transition 状态
const [isPending, startTransition] = useTransition();
function changeTreeLean(event) {
  const value = Number(event.target.value);
  setTreeLeanInput(value);
  React.startTransition(() => {
    setTreeLean(value);
  });
}
return (
  <>
    <input type="range" value={treeLeanInput} onChange={changeTreeLean} />
    <Spin spinning={isPending}>
      <Pythagoras lean={treeLean} />
    </Spin>
  </>
);
```

### 7.4 自动批处理 Automatic Batching

批处理是指 React 将多个状态更新，聚合到一次 render 中执行，以提升性能。

React 18 之前，React 只会在`事件回调`中使用批处理，而在 Promise、setTimeout、原生事件等场景下，是不能使用批处理的。

```js
setTimeout(() => {
  setCount((c) => c + 1);
  setFlag((f) => !f);
  // React 会 render 两次，每次 state 变化更新一次
}, 1000);
```

- 而在 React 18 中，所有的状态更新，都会自动使用批处理，不关心场景。

```js
function handleClick() {
  setCount((c) => c + 1);
  setFlag((f) => !f);
  // React 只会 re-render 一次，这就是批处理
}
setTimeout(() => {
  setCount((c) => c + 1);
  setFlag((f) => !f);
  // React 只会 re-render 一次，这就是批处理
}, 1000);
```

如果你在某种场景下不想使用批处理，你可以通过 `flushSync` 来强制同步执行(比如：你需要在状态更新后，立刻读取新 DOM 上的数据等。)

```js
import { flushSync } from 'react-dom';
function handleClick() {
  flushSync(() => {
    setCounter((c) => c + 1);
  });
  // React 更新一次 DOM
  flushSync(() => {
    setFlag((f) => !f);
  });
  // React 更新一次 DOM
}
```

### 7.5 流式 SSR

SSR 一次页面渲染的流程大概为：

1. 服务器 fetch 页面所需数据。
2. 数据准备好之后，将组件渲染成 `string` 形式作为 `response` 返回。
3. 客户端加载资源。
4. 客户端合成(hydrate)最终的页面内容。

在传统的 SSR 模式中，上述流程是串行执行的，如果其中有一步比较慢，都会影响整体的渲染速度。

而在 React 18 中，基于全新的 `Suspense`，支持了流式 SSR，也就是允许服务端一点一点的返回页面。

在 React18 以前，如果 Comments 数据请求很慢，会拖慢整个流程。

在 React 18 中，我们通过 `Suspense` 包裹，可以告诉 React，我们不需要等这个组件，可以先返回其它内容，等这个组件准备好之后，单独返回。

```html
<Layout>
  <NavBar />
  <Sidebar />
  <RightPane>
    <Post />
    <Suspense fallback={<Spinner />}>
      <Comments />
    </Suspense>
  </RightPane>
</Layout>
```

当`<Comments />` 组件准备好之后，React 会通过同一个`流(stream)`发送给浏览器(`res.send`替换成 `res.socket`)，并替换到相应位置。
