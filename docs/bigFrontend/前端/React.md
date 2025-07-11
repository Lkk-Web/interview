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

## 一、基础务实

### 1.1 事件机制

React 基于浏览器的事件机制自身实现了一套事件机制，包括`事件注册`、`事件合成`、`事件冒泡`、`事件派发`等，在 React 中这套事件机制被称之为合成事件。

在原生事件中，可以通过返回 false 方式来阻止默认行为，但是在 React 中，需要显式使用 `e.preventDefault()` 方法来阻止。

#### 1.1.1 事件在 JSX 中的转化

以下代码为为我们在 jsx 中所书写的：

```js
class Index extends React.Component {
  handerClick = (value) => console.log(value);
  render() {
    return (
      <div>
        <button onClick={this.handerClick}> 按钮点击 </button>
      </div>
    );
  }
}
```

首先会经过 babel 转换成 React.createElement 形式

<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/effeeb9ea7f7475faa34eb552995b77c~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp"/>

最终然后会被转成 [fiber](/big-frontend/前端/react#71-fiber) 对象形式如下

<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a499072aa0ad469e9e292ac986be7975~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp"/>

> fiber 对象上的 memoizedProps 和 pendingProps 保存了我们的事件。

### 1.2 合成事件

React 合成事件（SyntheticEvent）是 React 模拟原生 DOM 事件所有能力的一个事件对象，即浏览器原生事件的跨浏览器包装器。它根据 W3C 规范 来定义合成事件，兼容所有浏览器，拥有与浏览器原生事件相同的接口。

即在 react 中，我们绑定的事件 onClick 等，并不是原生事件，而是由原生事件合成的 React 事件，比如 click 事件合成为 onClick 事件。比如 `blur` , `change` , `input` , `keydown` , `keyup` 等 , 合成为 onChange。在 React 中，所有事件都是合成的，不是原生 DOM 事件，但可以通过 e.nativeEvent 属性获取 DOM 事件.

合成事件解决的问题：

1. 进行浏览器兼容，实现更好的跨平台

2. 避免垃圾回收
   - 事件对象可能会被频繁创建和回收，因此 React 引入事件池，在事件池中获取或释放事件对象。即 React 事件对象不会被释放掉，而是存放进一个数组中，当事件触发，就从这个数组中弹出，避免频繁地去创建和销毁(垃圾回收) 。

#### 1.2.1 setState 的同步与异步

- 在组件生命周期或 React 合成事件中，setState 是异步；
- 在 setTimeout 或者原生 dom 事件中，setState 是同步；

#### 1.1.2 为什么设计异步？

`setState`设计为异步，可以显著的提升性能；

- 如果每次调用 setState 都进行一次更新，那么意味着 render 函数会被频繁调用，界面重新渲染，这样同步更新的效率是很低；
- 如果我们知道可能会得到多个更新，最好批量更新。

如果同步更新了 state，但是还没有执行 render 函数，那么 state 和 props 不能保持同步；

- state 和 props 不能保持一致性，会在开发中产生很多的问题；

> Warning: setState 是一个伪异步，或者可以称为 defer，即延迟执行但本身还在一个事件循环，所以它的执行顺序在同步代码后、异步代码前。

### 1.3 .env 环境变量

`.env` 文件用于配置项目运行时的环境变量，例如接口地址、CDN 路径、API 密钥等。

```env
REACT_APP_API_URL=https://api.example.com
```

env 变量读取

```ts
import dotenv from 'dotenv';

//通过 defineConfig().define 注入变量
dotenv.config();
```

- 在 `CRA（Create React App）`中使用: 变量名必须以 `REACT_APP_`开头

tsx 中访问

```
const SERVER_URL = process.env.REACT_APP_SERVER_SOURCE_URL;
```

- 在 `Vite + React` 中使用: 变量名必须以 `VITE_`开头

```
const api = import.meta.env.VITE_API_URL;
```

- 在 `Dumi / Umi` 中使用，`.env `不会自动注入 process.env，需要手动配置

```ts
import { defineConfig } from 'dumi';
export default defineConfig({
  define: {
    REACT_APP_SERVER_SOURCE_URL: process.env.REACT_APP_SERVER_SOURCE_URL,
  },
});
```

tsx 中使用

```
// ✅ 直接写变量名
console.log(REACT_APP_SERVER_SOURCE_URL);
```

需要创建类型声明：根目录创建 `env.d.ts`文件

```ts
// env.d.ts
declare const REACT_APP_SERVER_SOURCE_URL: string;
```

Tips:

1. .env 文件不要上传到 Git（可用 .gitignore 忽略）
2. 可以创建 .env.production、.env.development 来分环境管理
3. 在浏览器项目中不要写敏感密钥（比如数据库密码、私钥）

## 二、生命周期

### 2.1 类式编写 生命周期

- componentDidMount

componentDidMount() 在组件挂载后 (插入 DOM 树后) 立即调用，componentDidMount() 是发送网络请求、启用事件监听方法的好时机，并且可以在 此钩子函数里直接调用 setState()

- componentDidUpdate

组件更新结束之后执行，在初始化 render 时不执行

tips:在 componentDidMount 里面 setState 导致组件更新，组件更新后会执行 componentDidUpdate，此时你又在 componentDidUpdate 里面 setState 又会导致组件更新，造成成死循环了，如果要避免死循环，需要谨慎的在 componentDidUpdate 里面使用 setState。

- componentWillUnmount

componentWillUnmount() 方法在组件卸载及销毁之前直接调用。

componentWillUnmount() 方法中不应调用 setState()，因为该组件将永远不会重新渲染。组件实例卸载后，将永远不会再挂载它。

### 2.2 useEffect 模拟生命周期

- 实现 `componentDidMount`

```js
const Home: React.FC<Iprops> = () => {
  useEffect(() => {
    getList() // 调用方法发起异步请求
  }, [])；

 return (
      <div> hello world</div>
  )
}
```

useEffect 的第二个参数，传入了一个[]，表示我们只需在页面初始化时候执行副作用，此处为发起请求。

- 实现 `componentDidUpdate`

```js
const Home: React.FC<Iprops> = () => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    getList(); // 调用发起异步请求
  }, [count]); // 仅在count更改时更新
  return <div>hello world</div>;
};
```

useEffect 的第二个参数，传入[count]，只有 count 的值发生改变，执行副作用 此处为重新发起请求。count 也可换成其他依赖项。

- 实现 componentDidUpdate

```js
useEffect(() => {
  getList();
  return () => {
    console.log('组件注销, 实现componentWillUnmount');
  };
}, []);
```

useEffect 第一个参数， return 一个函数，可以用来清除副作用.

## 三、组件

### 3.1 HOC

> 高阶组件（HOC）是 React 中用于复用组件逻辑的一种高级技巧。HOC 自身不是 React API 的一部分，它是一种基于 React 的组合特性而形成的设计模式。

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

## 四、Hooks

### 4.1 useState

### 4.2 useEffect

用途：

- 获取数据
- 事件监听或订阅
- 监控/改变 DOM
- 设置定时器，输出日志
- 该 Hook 接收一个包含命令式、且可能有副作用代码的函数。

```js
useEffect(() => {
  console.log('执行副作用'); // 普通函数，执行副作用，可以实现componentDidMount、componentDidUpdate
  return () => {
    // return函数, 组件销毁时清除副作用，可以实现componentWillUnmount
    console.log('清除副作用');
  };
}, [count]);
```

- useEffect 是在 render 结束之后才执行的

每次重新渲染，都会导致原组件（包含子组件）的销毁，以及新组件（包含子组件）的诞生。

结论：

1、首先渲染，并不会执行 useEffect 中的 return

2、变量修改后，导致的重新 render，会先执行 useEffect 中的 return，再执行 useEffect 内除了 return 部分代码。

3、return 内的回调，可以用来清理遗留垃圾，比如订阅或计时器 ID 等占用资源的东西。

#### 4.2.1 useLayoutEffect

`useLayoutEffect` 和 `useEffect` 的结构、功能相同，区别只是它们在事件循环中的调用时机不同。

useEffect 的回调函数是`异步宏任务`，在下一轮事件循环才会执行。

- `好处`：这使得它适用于许多常见的副作用场景，比如设置订阅和事件处理等情况，因为绝大多数操作不应阻塞浏览器对屏幕的渲染更新。

- `坏处`：产生二次渲染问题，第一次渲染的是旧的状态，接着下一个事件循环中，执行改变状态的函数，组件又携带新的状态渲染，在视觉上，就是二次渲染。

而 `useLayoutEffect` 与 componentDidMount、componentDidUpdate 生命周期钩子是`异步微任务`，在渲染线程被调用之前就执行。这意味着回调内部执行完才会更新渲染页面，没有二次渲染问题.

- `好处`：没有二次渲染问题，页面视觉行为一致。

- `坏处`：在回调内部有一些运行耗时很长的代码或者循环时，页面因为需要等 JS 执行完之后才会交给渲染线程绘制页面，等待时期就是白屏效果，即`阻塞了渲染`

### 4.3 useCallback

### 4.4 useMemo

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

### 4.8 useRef

## 五、React-Router

### 5.1 SPA & MPA

MPA（Multi Page Application）指有多个独立的页面的应用，每个页面必须重复加载 js,css 等相关资源。多页应用跳转，需要整页资源刷新。

区别:

| - | SPA | MPA |
| :-: | :-: | :-: |
| 资源文件(css，js) | 组件公用的资源只需要加载一次 | 每个页面都要自己加载公用的资源 |
| 路由模式 | hash / history | 链接跳转 |
| 适用场景(SEO) | 不利于 SEO（可借助 SSR 优化 SEO），适用于经常切换页面的场景和数据传递较多的场景 | 适用于对 SEO 要求较高的应用 |
| 首屏时间 | 首屏时间慢，首屏时需要请求一次 html，同时还要发送一次 js 请求，两次请求回来了，首屏才会展示出来 | 首屏时间快，访问页面的时候，服务器返回一个 html，页面就会展示出来，这个过程只经历了一个 HTTP 请求 |

### 5.2 hash & history 的特点

- hash 变化会触发网页跳转，即浏览器的前进和后退。

- hash 可以改变 url ，但是不会触发页面重新加载（hash 的改变是记录在 window.history 中），即不会刷新页面。也就是说，所有页面的跳转都是在客户端进行操作。因此，这并不算是一次 http 请求，所以这种模式不利于 SEO 优化。hash 只能修改 # 后面的部分，所以只能跳转到与当前 url 同文档的 url 。

- hash 通过 `window.onhashchange` 的方式，来监听 hash 的改变，借此实现无刷新跳转的功能。

回到之前的问题，为什么会自动到根目录去寻找。首先因为没有配置 basePath，导致应用根据根路径来映射。然后是 SPA 应用，每次跳转页面，都会导致加上子路径重新变成根路径（并不是相对路径），因此需要配置 HashRoute。

#### 5.2.1 hash 的原理

hash 是通过监听浏览器 `onhashchange()` 事件变化，查找对应路由应用。通过改变 `location.hash` 改变页面路由。

#### 5.2.2 history 的原理

浏览器窗口有一个 history 对象，用来保存浏览历史。比如，该窗口先后访问了三个地址，那么 history 对象就包括三项，length 属性等于 3。而要监听路由变化则要使用订阅-发布模式实现。

HTML5 为 history 对象添加了两个新方法，`history.pushState()` 和 `history.replaceState()`，用来在浏览历史中添加和修改记录。所有主流浏览器都支持该方法（包括 IE10）。

`pushState`,允许用户可以手动的添加一条历史记录，主要特别注意的是，该条记录不会刷新页面

#### 5.2.3 HashRoute & HistoryRoute

今天部署遇到一个奇怪的问题，前端打包后的文件，在访问的时候没有 basePath，会自动到根目录去寻找，答案是少配置了 HashRoute/HistoryRoute。

| hash | history |
| :-: | :-: |
| 有 # 号 | 没有 # 号 |
| 兼容到 IE8 | 兼容到 IE8 |
| 实际的 url 之前使用哈希字符，这部分 url 不会发送到服务器，不需要在服务器层面上进行任何处理 | 每访问一个页面都需要服务器进行路由匹配生成 html 文件再发送响应给浏览器，消耗服务器大量资源 |
| 不需要服务器任何配置 | 需要在服务器配置一个回调路由 |

## 六、数据管理方案

## 七、React 特性

### 7.1 Fiber

`React Fiber` 是针对就协调器重写的完全向后兼容的一个版本。React 的这种新的协调算法被称为 Fiber Reconciler，它经常被用来表示 DOM 树的节点。

这就是 React Fiber 协调器使之有可能将工作分为多个工作单元。它设置每个工作的优先级，并使**暂停、重用和中止工作单元**成为可能。在 fiber 树中，单个节点保持跟踪，这是使上述事情成为可能的需要。每个 fiber 都是一个链表的节点，它们通过子、兄弟节点和返回引用连接起来。

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
