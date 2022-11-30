---
order: 6
---

# 前端社区

## 一、Native、Web App、Hybrid、WAP？

一句话概要： Native、Web App、Hybrid、React Native（后面以 RN 简称）、Weex 间的异同点，后期同步小程序 和 PWA。

### 1.1 Native App

传统的原生 App 开发模式，有 iOS 和 aOS 两大系统，需要各自语言开发各自 App。

优点：性能和体验都是最好的。

缺点：开发和发布成本高。

应用技术：Swift，OC(Objective-C)，Java。

### 1.2 WebApp

移动端的网站，常被称为`H5应用`，说白了就是特定运行在移动端浏览器上的网站应用。一般泛指 SPA(Single Page Application)模式开发出的网站。

WAP:说到 Web App 不少人会联想到 WAP，或者有人认为，WAP 就是 WebApp，其实不然。

WebApp 与 WAP 最直接的区别就是功能层面。WAP 更侧重使用网页技术在移动端做展示，包括文字、媒体文件等。而 Web App 更侧重“功能”，是使用网页技术实现的 App。总的来说，Web App 就是运行于网络和标准浏览器上，基于网页技术开发实现特定功能的应用。

优点：开发和发布成本最低。

缺点：性能和体验不能讲是最差的，但也受到浏览器处理能力的限制，多次下载同样会占用用户一定的流量。

应用技术：ReactJS，RegularJS，VueJS 等等。

### 1.3 WAP

Wap 是无线应用协议(WirelessApplicationProtocol，简称 Wap)，它定义了一个通用平台，可以将当前 `InternetHTML` 语言中的信息转换为 WML(无线标记语言)中描述的信息，并将其显示在移动电话的显示屏上。

Wap 和 Web 并称的时候，前者是指基于 `WAP` 协议的手机网站，后者是指基于 `HTTP` 协议的电脑网站，支持 WAP 的手机可以直接访问 WAP 站点，手机访问 WEB 站点则需要经过网关转换；同样，电脑可以直接访问 WEB 站点，电脑访问 WAP 站点也需要经过网站转换

发展前景：

1. 有必要为移动 web 开发语言,通过它可以在 web 方面,多平台兼容性访问,不需要单独的平台来开发新的网站,减少开发成本,移动应用程序,因为它有存储的功能,它可以根据开发技术应用,因为它是跨平台的兼容性,可以开发一个版本使用更多的平台,降低公司成本。

2. wap 技术随着移动互联网的发展，wap 技术主要针对低端手机接入智能手机的快速发展，基于 wap 技术的手机网站单一，不适合维护，将在不久的将来被淘汰。

### 1.4 Hybrid App

混合模式移动应用，介于 Web App、Native App 这两者之间的 App 开发技术，兼具“Native App 良好交互体验的优势”和“Web App 跨平台开发的优势”（百度百科解释）

主要的原理是，由 Native 通过 `JSBridge` 等方法提供统一的 API，然后用 Html+Css 实现界面，JS 来写逻辑，调用 API，最终的页面在 `Webview` 中显示，这种模式下，Android、iOS 的 API 一般有一致性，所以 Hybrid App 有跨平台效果

优点：开发和发布都比较方便，效率介于 Native App、Web App 之间。

缺点：学习范围较广，需要原生配合。

应用技术：PhoneGap，AppCan，Wex5，APICloud 等。

### 1.5 React Native

Facebook 发现 Hybrid App 存在很多缺陷和不足，于是发起开源的一套新的 App 开发方案 RN。使用 JSX 语言写原生界面，js 通过 JSBridge 调用原生 API 渲染 UI 交互通信。

优点：效率体验接近 Native App，发布和开发成本低于 Native App。

缺点：学习有一定成本，且文档较少，免不了踩坑。

### 1.6 Weex App

阿里巴巴开发团队在 RN 的成功案例上，重新设计出的一套开发模式，站在了巨人肩膀上并有淘宝团队项目做养料，广受关注，2016 年 4 月正式开源，并在 v2.0 版本官方支持 Vue.js，与 RN 分庭抗礼。

优点：单页开发模式效率极高，热更新发包体积小，并且跨平台性更强。

缺点：刚刚起步，文档欠缺；社区没有 RN 活跃，功能尚不健全，暂不适合完全使用 Weex 开发 App。

### 1.7 PWA

PWA 全称 Progressive Web Apps（渐进式 WebApp），是通过现代 API 来构建和增强的，这些 API 提供了与原生 App 相似的能力、可靠性、可安装性，而且具备一套代码即可触达任何人、任何地方、任何设备。

PWA 的核心还是 WebApp，通过渐进式增强，新的功能被现代浏览器实现。通过使用 `service worker` 和 `app manifest`，可以让你的 WebApp 具备可靠性和可安装性。如果浏览器不支持这些功能，你的网站的核心功能也不受影响。

优点：当然使用 PWA 还有很多其他的惊喜，App 的体积上更小了，如果说一个 30M 的原生 App 换成 PWA，可能只有 3M 不到。另外，PWA 的应用的可触达性是继承了 WebApp 的，可以通过搜索引擎让触达更多用户，或者通过分享的方式。最后，PWA 的应用可随时更新，无需用户下载安装。
