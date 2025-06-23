---
order: 1
---

# 前端工程化

模块化、组件化、规范化、自动化 4 个方面

**模块化**：

模块化就是把一个大的文件，拆分成多个相互依赖的小文件，按一个个模块来划分

> 为什么会出现模块化

随着前端和 JavaScript 的快速发展，JavaScript 代码变得越来越复杂了，ajax 的出现，SPA 的出现，Node 的实现等。

所以，模块化已经是 JavaScript 一个非常迫切的需求：

- 但是 JavaScript 本身，直到 ES6（2015）才推出了自己的模块化方案；
- 在此之前，为了让 JavaScript 支持模块化，涌现出了很多不同的模块化规范：[AMD](/big-frontend/前端/javascript#10amd-规范)、[CMD](/big-frontend/后端/node#15-cmd-规范)、[CommonJS](/big-frontend/后端/node)、[ESModule](/big-frontend/前端/typescript#31-esmodule)、[UMD](/big-frontend/前端/javascript#11umd-规范) 等；

没有模块化带来的问题：

- 命名冲突的问题（因为根据 js 文件的加载顺序，后面加载的 js 文件在执行的时候会将其它文件中重复声明的变量重新赋值）
  - 能够用[立即执行函数](/big-frontend/前端/javascript#3立即执行函数)（IIFE）来解决
- 多人协作问题

因此：

- 我们需要制定一定的规范来约束每个人都按照这个规范去编写模块化的代码；
- 这个规范中应该包括核心功能：模块本身可以导出暴露的属性，模块又可以导入自己需要的属性

**组件化**：

页面上所有的东西都可以看成组件，页面是个大型组件，可以拆成若干个中型组件，然后中型组件还可以再拆，拆成若干个小型组件

- 组件化 ≠ 模块化。模块化只是在文件层面上，对代码和资源的拆分；组件化是在设计层面上，对于 UI 的拆分
- 目前市场上的组件化的框架，主要的有 Vue，React，Angular2

**规范化**：

在项目规划初期制定的好坏对于后期的开发有一定影响。包括的规范有

- 目录结构的制定
- 编码规范
- 前后端接口规范
- 文档规范
- 组件管理
- Git 分支管理
- Commit 描述规范
- 定期 codeReview
- 视觉图标规范

**自动化**：

也就是简单重复的工作交给机器来做，自动化也就是有很多自动化工具代替我们来完成，例如持续集成、自动化构建、自动化部署、自动化测试等等

## 一、设计模式

### 1.观察者模式

### 2.发布-订阅模式

发布-订阅模式其实是一种对象间一对多的依赖关系，当一个对象的状态发送改变时，所有依赖于它的对象都将得到状态改变的通知。

订阅者（Subscriber）把自己想订阅的事件注册（Subscribe）到调度中心（Event Channel），当发布者（Publisher）发布该事件（Publish Event）到调度中心，也就是该事件触发时，由调度中心统一调度（Fire Event）订阅者注册到调度中心的处理代码。

[手撕发布订阅](/interview/frontend-shred-code#41-发布订阅模式)

## 二、策略思想

### 2.1TDD(测试驱动开发)

它要求在编写某个功能的代码之前先编写好测试代码，然后只编写使测试通过的功能代码，通过测试来推动整个开发的进行。这有助于编写简洁可用和高质量的代码，并加速开发过程。

### 2.2 灰度策略

灰度，就是存在于黑与白之间的一个平滑过渡的区域。对于互联网产品来说，上线和未上线就是黑与白之分，而实现未上线功能平稳过渡的一种方式就叫做灰度发布。

AB test 就是一种灰度发布方式，让一部分用户继续用 A，一部分用户开始用 B，如果用户对 B 没有什么反对意见，`那么逐步扩大范围`，把所有用户都迁移到 B 上面来。灰度发布可以保证整体系统的稳定，在初始灰度的时候就可以发现、调整问题，以保证其影响度。

#### 测试驱动开发的优缺点

从以上的 TDD 周期图中也可以看出，测试驱动开发最大的优点就是重构了，不断迭代，不断地对现有代码进行重构，不断优化代码的内部结构，最终实现对整体代码的改进。以此不断减少一些设计冗余、代码冗余、接口复杂度等等。

另外，对于一些前期需求不明确，甚至需求信息量特别少，且后期又会有大量业务功能修改时，传统的开发模式需要加班加点以此赶工开发，测试，缺陷修复，人工、时间成本且不说，最重要的产品质量也无法得到保证。当然 ，这种模式下也最适合采用原型法、敏捷开发模式了，毕竟拥抱变化是敏捷的宗旨 。而测试驱动开发也是敏捷开发模式的基础，这样无论是来自客户的紧急需求还是项目团队的一次技术改革，都可以通过重构设计、增加测试脚本来实现了。

## 三、页面指标

### 2.1 性能指标

面试中经常问到前端性能监控相关指标，你知道 FP、FCP、FMP、LCP、ATF、TTL 代表什么事件吗？它们的先后顺序如何呢？如何计算？前端性能监控中常用哪些指标？

最初，评价前端页面加载性能有两个指标：`DOMContentLoaded`和`load`事件，分别代表`DOM构造完成`和`首屏资源加载完成`。

但对于现代复杂的单页应用，都是`通过JS操作DOM向页面`添加主要内容，对于这种场景，DOMContentLoaded 和 load 事件就不能很好地衡量首屏显示时间了。

于是有 FP、FCP、FMP 被提出来，它们关注的不是`加载`，而是`渲染`，因此能更好地表现用户看到的情况。

FP、FCP 这两个指标虽然表达了渲染的事件，但对“用户关注的内容”没有体现，比如首屏渲染出来一个背景，或者一个 loading，可能对于用户来说和白屏区别不大。FMP 虽然体现了“关键内容”的要素，但它是复杂的、模糊的，甚至是错误的，并不能准确识别页面主要内容的加载时机。

后来 LCP 指标被提出来，表示“用于度量视口中最大的内容元素何时可见”，它用来代替 FMP，表征页面的关键元素何时可以被用户看到。

除了加载性能，还有`可交互时间`、`稳定性指标`、`流畅性指标`，在不同的业务场景都可以被监控用来作为提升用户体验的依据。

谷歌一直十分重视网站的用户体验，移动友好性，页面加载速度和 HTTPS 是 Google 已经使用的页面排名因素，而 2020 年，谷歌将 Core Web Vitals 新纳入的用户体验指标。其中核心的 3 个就是 LCP、FID、CLS。后面会详细说明。

- `load（Onload Event）`，它代表页面中依赖的所有资源加载完的事件。
- `DCL（DOMContentLoaded）`，[OMContentLoaded](/big-frontend/前端/html#111-domcontentloaded)，DOM 解析完毕。
- `FP（First Paint）`，表示渲染出第一个像素点。FP 一般在 HTML 解析完成或者解析一部分时候触发。
- `FCP（First Contentful Paint）`，表示渲染出第一个内容，这里的“内容”可以是文本、图片、canvas。
- `FMP（First Meaningful Paint）`，首次渲染有意义的内容的时间，“有意义”没有一个标准的定义，FMP 的计算方法也很复杂。
- `LCP（largest contentful Paint）`，最大内容渲染时间。

> FP = 白屏时间 = 地址栏输入网址后回车 - 浏览器出现第一个元素

> FCP = 首屏时间 = 地址栏输入网址后回车 - 浏览器第一屏渲染完成

#### 指标计算

FP、FCP 和 LCP 时间都可以通过 performance API 计算

```ts
// load
// loadEventStart是load事件发送给文档，也即load回调函数开始执行的时间
// loadEventEnd是load回调函数执行完成的时间
const loadTime = performance.timing.loadEventStart - performance.timing.fetchStart;

// DCL
const dcl =
  performance.timing.domContentLoadedEventEnd - performance.timing.domContentLoadedEventStart;

// FP
const fp = performance
  .getEntries('paint')
  .filter((entry) => entry.name == 'first-paint')[0].startTime;

// FCP
const fcp = performance
  .getEntries('paint')
  .filter((entry) => entry.name == 'first-contentful-paint')[0].startTime;

// Onload Event
const l = performance.timing.loadEventEnd - performance.timing.navigationStart;

// LCP
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    console.log('LCP candidate:', entry.startTime, entry);
  }
}).observe({ type: 'largest-contentful-paint', buffered: true });

// LCP也可以通过web-vitals计算
import { getLCP, getFID, getCLS } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getLCP(console.log);
```

FMP 计算比较复杂，lighthouse 的计算的大体思路是，将页面中最大布局变化后的第一次渲染事件作为 FMP 事件，并且计算中考虑到了可视区的因素。

### 2.2 可交互时间

文档`首次可交互时间`可以用来衡量`页面可交互`的性能。

首次可交互，即 DOM 加载并解析完成后，界面上的元素可以交互（如输入框可以输入、按钮可以点击、超长元素可以滚动）。其时间用 performance.timing.domInteractive 计算。

performance.timing.domInteractive：当前网页 DOM 结构结束解析、开始加载内嵌资源的时间，document.readyState  变成`interactive`，并将抛出"readyStateChange"事件（注意只是 DOM 树解析完成，这时候并没有开始加载网页内的资源）

```ts
const timeToInteractive = performance.timing.domInteractive - performance.timing.fetchStart;
```

#### TTI

用于标记应用已`进行视觉渲染并能可靠响应用户输入`的时间点

这里定义一下什么是完全可交互状态的页面：

1. 页面已经显示有用内容。
2. 页面上的可见元素关联的事件响应函数已经完成注册。
3. 事件响应函数可以在事件发生后的 50ms 内开始执行（主线程无 Long Task）。

计算方法描述如下：

1. 从 FCP 时间开始，向前搜索一个不小于 5s 的静默窗口期。（静默窗口期定义：窗口所对应的时间内没有 Long Task，且进行中的网络请求数不超过 2 个）
2. 找到静默窗口期后，从静默窗口期向后搜索到最近的一个 Long Task，Long Task 的结束时间即为 TTI。
3. 如果一直找到 FCP 时刻仍然没有找到 Long Task，以 FCP 时间作为 TTI。

`Long Task`：阻塞主线程达 50 毫秒或以上的任务，可以通过 PerformanceObserver 获取。

#### FID

FID（First Input Delay） 用于度量用户第一次与页面交互的延迟时间，是`用户第一次与页面交互到浏览器真正能够开始处理事件处理程序以响应该交互`的时间。

相对于 TTI，FID 表示实际的用户操作的延时，更能从用户角度反映网页的交互性能。

其计算使用简洁的 PerformanceEventTiming API 即可，回调的触发时机是用户首次与页面发生交互并得到浏览器响应（点击链接、输入文字等）。

### 2.3 稳定性指标 CLS

CLS（Cumulative Layout Shift）是对`在页面的整个生命周期中发生的每一次意外布局变化的最大布局变化得分的度量`，布局变化得分越小证明你的页面越稳定

听起来有点复杂，这里做一个简单的解释：

- 不稳定元素：一个非用户操作但发生较大偏移的可见元素称为不稳定元素。
- 布局变化得分：元素从原始位置偏移到当前位置影响的页面比例 \* 元素偏移距离比例。

网站应努力使 `CLS` 分数小于 0.1 。

可以通过 `web-vitals` 获取 CLS。

```ts
import { getCLS } from 'web-vitals';
getCLS(console.log);
```

#### 动画和过渡

动画和过渡，如果做得好，对用户而言是一个不错的更新内容的方式，这样不会给用户“惊喜”。突然出现的或者预料之外的内容，会给用户一个很差的体验。但如果是一个动画或者过渡，用户可以很清楚的知道发生了什么，在状态变化的时候可以很好的引导用户。

CSS 中的 `transform` 属性可以让你在使用动画的时候不会产生布局偏移。

用 transform:scale() 来替换 width 和 height 属性用 transform:translate() 来替换 top, left, bottom, right 属性

### 2.4 流畅性指标

- `FPS`

Chrome DevTool 中有一栏 Rendering 中包含 FPS 指标，但目前浏览器标准中暂时没有提供相应 API ，只能手动实现。这里需要借助 `requestAnimationFrame` 方法模拟实现，浏览器会在下一次重绘之前执行 rAF 的回调，因此可以通过计算每秒内 rAF 的执行次数来计算当前页面的 FPS。

FPS 过低会让用户感觉卡顿，因此这个计算可以用来监控页面卡顿情况。

- `longTask`

长任务监听，PerformanceObserver 监听，参考上面 TTI 一节中长任务的监听。

### 2.5 Core Web Vitals

Core Web Vitals 是用户体验和 SEO 的重要指标。

关键的指标包括

- LCP，用来衡量页面加载性能，为了提供良好的用户体验，LCP 应该在页面首次开始加载后的 2.5 秒内发生
- FID，衡量交互性能，为了提供良好的用户体验，页面的 FID 应该小于 100 毫秒。
- CLS，测量视觉稳定性。为了提供良好的用户体验，页面应该保持 CLS 小于 0.1。

```ts
import { getLCP, getFID, getCLS } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getLCP(console.log);
```

## 四、性能优化

### 3.1 网络方面

### 3.2 请求方面

#### 3.2.1 BSR、SSG、SSR

[React SSR 原理](https://github.com/lgwebdream/FE-Interview/issues/930)

[Next.js 的三种渲染方式（BSR、SSG、SSR）](https://zhuanlan.zhihu.com/p/341229054)

### 3.3 构建渲染方面

### 3.4 缓存方面

## 五、CICD

CICD 是 持续集成（Continuous Integration）和持续部署（Continuous Deployment）简称。指在开发过程中自动执行一系列脚本来减低开发引入 bug 的概率，在新代码从开发到部署的过程中，尽量减少人工的介入。

| 阶段     | 简称 | 内容                                                |
| -------- | ---- | --------------------------------------------------- |
| 持续集成 | CI   | 自动化测试、构建、检查代码质量（但不部署）          |
| 持续部署 | CD   | 构建后将产物发布上线（如上传到服务器、存储桶、CDN） |

```yaml
# CI：
- checkout 源码
- 安装依赖
- 运行构建命令（如 npm run build）
- 跑测试

# CD：
- 清空  R2 某目录
- 上传 dist/ 到 R2
- 自动更新缓存或触发 CDN 刷新
```

### 5.1 CI

### 5.2 CD

#### 5.2.1 cloudflare R2

使用 S3 凭证访问 R2 存储桶

✅ 步骤一：创建 R2 存储桶

1. 登录 Cloudflare 控制台：https://dash.cloudflare.com/
2. 选择你的账户 > 进入 R2 控制面板
3. 点击【创建存储桶】
   - 存储桶名称：例如 my-bucket
   - 区域（Region）：默认就好（如 auto）

✅ 步骤二：创建 S3 API Access 密钥

1. 在左侧选择【API Tokens】 > 【R2 兼容密钥】
2. 点击【创建访问密钥】
3. 记录以下信息（仅出现一次）：

```yaml
Default Region: auto
Access Key: （你的 access key）
Secret Key: （你的 secret）
S3 Endpoint: <account_id>.r2.cloudflarestorage.com
Use HTTPS: Yes
```

✅ 步骤三：package.json 脚本执行

1. `npm install @aws-sdk/client-s3`
2. 项目根目录创建 [upload-to-r2.js](https://stb.kying.org/data/script/upload-to-r2.js)
3. 添加 package.json 脚本

```json
{
  "scripts": {
    "upload": "node upload-to-r2.js",
    "deploy": "npm run docs:build && npm run upload"
  }
}
```

### 3.1 webhooks

## 六、微前端

## 七、monorepo

## 八、埋点平台

## 九、ServeLess

## 十、前端监控

### 10.1 性能监控

## 十一、Elasticsearch 应用及平台建设

## 十二、Low Code

## 十三、webrtc

## 十四、其他

## 14.1 鉴权 - SSO

单点登录 SSO(Single Sign On),是一个多系统共存的环境下，用户在一处登录后，就不用在其他系统中登录，也就是用户的一次登录得到其他所有系统的信任

单点登录原理:

单点登录有`同域`和`跨域`两种场景

- 同域

适用场景：都是企业自己的系统，所有系统都使用同一个一级域名通过不同的二级域名来区分。

门户系统设置的`cookie`的 domain 为`一级域名`也是 zlt.com，这样就可以共享门户的 cookie 给所有的使用该域名 xxx.alt.com 的系统

使用 Spring Session 等技术让所有系统共享 Session

这样只要门户系统登录之后无论跳转应用 1 或者应用 2，都能通过门户 Cookie 中的 sessionId 读取到 Session 中的登录信息实现单点登录

- 跨域

单点登录之间的系统域名不一样，例如第三方系统。由于域名不一样`不能共享 Cookie` 了，需要的一个独立的授权系统，即一个独立的认证中心(passport),子系统的登录均可以通过 passport，子系统本身将不参与登录操作，当一个系统登录成功后，passprot 将会颁发一个令牌给子系统，子系统可以拿着令牌去获取各自的保护资源，为了减少频繁认证，各个子系统在被 passport 授权以后，会建立一个局部会话，在一定时间内无需再次向 passport 发起认证

1. 用户第一次访问应用系统的时候，因为没有登录，会被引导到认证系统中进行登录；
2. 根据用户提供的登录信息，认证系统进行身份校验，如果通过，返回给用户一个认证凭据-令牌；
3. 用户再次访问别的应用的时候，带上令牌作为认证凭证；
4. 应用系统接收到请求后会把令牌送到认证服务器进行校验，如果通过，用户就可以在不用登录的情况下访问其他信任的业务服务器。

<img src="https://camo.githubusercontent.com/c18faf88be3e1a7af3c216083cf5b7e1922303fc788770068b4c13be70e9d1bc/687474703a2f2f696d672d7374617469632e796964656e6778756574616e672e636f6d2f77786170702f69737375652d696d672f7169642d3638392d73736f2e706e67" />

如：

<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1a48ed47dd4a46de9e6f4379628a2fb4~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image" />
```
