---
group:
  # title: '前端'
  order: 2
order: 1
---

# HTML

## 1.HTML5 新增 API 属性

- draggable 可拖拽
- div：contenteditable 富文本编辑器

## 2.优雅降级和渐进增强

渐进增强 ：针对低版本浏览器进行构建页面，保证最基本的功能，然后再针对高级浏览器进行效果、交互等改进和追加功能达到更好的用户体验。

优雅降级 ：一开始就构建完整的功能，然后再针对低版本浏览器进行兼容。

## 3.Canvas 与 SVG

canvas：HTML5 的 canvas 元素使用 JavaScript 在网页上绘制图像。画布是一个矩形区域，可以控制其每一像素。canvas 拥有多种绘制路径、矩形、圆形、字符以及添加图像的方法。

svg：可伸缩矢量图形

## 4.不常用标签

### 4.1\<label>

用于绑定一个[表单](https://so.csdn.net/so/search?q=表单&spm=1001.2101.3001.7020)元素, 当点击 label 标签的时候, 被绑定的表单元素就会获得输入焦点。

```html
<label> 用户名： <input type="radio" name="usename" value="请输入用户名" /> </label>
```

### 4.2\<script>

当浏览器加载 HTML 时遇到 \<script /> 标签，浏览器就不能继续构建 DOM。它必须立刻执行此脚本。对于外部脚本 \<script src="..." />也是一样的：浏览器必须等脚本下载完，并执行结束，之后才能继续处理剩余的页面。

这会导致两个重要的问题：

1. 脚本不能访问到位于它们下面的 DOM 元素，因此，脚本无法给它们添加处理程序等。
2. 如果页面顶部有一个笨重的脚本，它会“阻塞页面”。在该脚本下载并执行结束前，用户都不能看到页面内容：

\<script>标签打开 defer 或 async 属性，脚本就会异步加载。渲染引擎遇到这一行命令，就会开始下载外部脚本，但不会等它下载和执行，而是直接执行后面的命令。

在实际开发中，`defer` 用于需要整个 DOM 的脚本或脚本的相对执行顺序很重要的时候。 `async` 用于独立脚本，例如计数器或广告，这些脚本的相对执行顺序无关紧要。

#### 4.2.1 defer

`defer`要等到整个页面在内存中正常渲染结束（DOM 结构完全生成，以及其他脚本执行完成），才会`执行`；

HTML5 规范要求脚本按照它们出现的先后顺序执行，因此第一个延迟脚本会先于第二个延迟脚本执行，而这两个脚本会先于[DOMContentLoaded](/big-frontend/前端/html#111-domcontentloaded)事件执行。

**在实现当中**，延迟脚本并不一定会按照顺序执行，也不一定会在`DOMContentLoad`时间触发前执行，因此最好只包含一个延迟脚本。这一点在 HTML5 中已经明确规定，因此支持 HTML5 的实现会忽略给嵌入脚本设置的 defer 属性。

#### 4.2.2 async

`async`一旦下载完，渲染引擎就会中断渲染，执行这个脚本以后，再继续渲染。

与`defer`不同的是，标记为`async`的脚本并不保证按照它们的先后顺序执行。第二个脚本文件可能会在第一个脚本文件之前执行。因此确保两者之间互不依赖非常重要。

指定`async`属性的目的是不让页面等待两个脚本下载和执行，从而异步加载页面其他内容。

#### 4.2.3 跨源策略

要允许跨源访问，`<script>`标签需要具有 crossorigin 特性，并且远程服务器必须提供特殊的 header。

这里有三个级别的跨源访问：

需要服务器发送回带有我们的源的 `header Access-Control-Allow-Origin` 和 `Access-Control-Allow-Credentials: true`

- 无 crossorigin 特性 —— 禁止访问。
- crossorigin="anonymous" —— 浏览器不会将授权信息和 cookie 发送到远程服务器。
- crossorigin="use-credentials" —— 浏览器会将授权信息和 cookie 发送到远程服务器。

### 4.3\<iframe>

iframe 元素会创建包含另外一个文档的内联框架（即行内框架）。这是官方文档的原话，有点难以理解，实际上就是在你的页面上外链一个页面出来，以窗口的形式呈现在你的页面中。

- 可以用于嵌入第三方资源，比如广告、视频或音频等等。使用 iframe 可以保证页面代码的简洁，还能让文挡之间有隔离不用担心相互之间有影响

### 4.4\<webview>

webview 是一个可视化的组件，是作为原生 APP 或 小程序 的视觉部分。可以内嵌在移动端，实现前端的混合式开发，大多数混合式开发框架都是基于 WebView 模式进行二次开发的。比如：APIcloud、uni-app、Taro、RN 等等的框架。

#### 相关概念

1. 我们通常是用浏览器来浏览网页，你很清楚的知道你正在使用浏览器，要么是 PC 客户端，要么是手机上的 app。但是 webview 是一个嵌入式的浏览器，是嵌入在原生应用中的，你可能都意识不到你在用浏览器。

2. 传统浏览器分为两个部分，UI(地址栏、导航栏)和浏览器引擎。webview 就是原生应用中的浏览器引擎。

3. webview 只是一个可视化的组件，是作为原生 APP 的视觉部分。

4. 用 webview 展示的内容是不需要存储在本地的，可以直接从服务器获取。

5. 运行在 webview 中的 JS 代码有能力调用原生的系统 API，没有传统浏览器沙箱的限制。

6. 沙箱的存在是因为，你永远不能完全信任加载的 web 内容，所以不能允许它调用原生的系统 API。而在 webview 中开发人员通常可以完全控制加载的内容，恶意代码进入并在设备上造成混乱的可能性很低。

7. 在 webview 中，JS 代码可以跟原生应用代码相互通信，也可以调用原生 API 集成酷炫的系统级功能，如传感器、存储、日历、联系人等。

#### webview 的用法

1、作为 APP 内置浏览器，显示链接的内容。

2、用来显示广告。

3、完全承载 APP 内的所有交互。从技术角度看这些仍是原生应用，但它做的唯一原生操作就是托管 webview，这种应用被称为混合应用。从部署和更新的角度来看，混合应用非常方便。

4、作为原生应用的扩展。许多原生应用会提供加载项或扩展程序来扩展其功能，由于 web 技术的简单性和强大，这些加载项和扩展通常以 HTML、CSS、JS 而不是 C++、C#或其他来构建。

#### webview 的精髓

webview 其实只是一个再应用中设置好位置和大小的浏览器，而且不会放置任何花哨的 UI。

在大多数情况下，除非你调用了原生 API，否则不必在 webview 中专门测试 web 应用。

### 4.5\<img>

#### 4.5.1 预加载

实现预加载要做的只有一件事情，那就是在用到图片之前让浏览器提前缓存图片。

1. 通过 html：在 index 页面末尾定义多个 img 标签，达到提前下载的目的。

```html
<!-- 批量定义要下载的图片资源，定义display 阻止他们渲染到页面 -->
<img src="xxx.xxx.xxx/static/img/xx1.xxx" style="display: none" />
<img src="xxx.xxx.xxx/static/img/xx2.xxx" style="display: none" />
<img src="xxx.xxx.xxx/static/img/xx3.xxx" style="display: none" />
```

2. 通过 css：在 css 文件中通过 background-image 属性批量下载图片

```html
<div id="preload" style="display:none"></div>
#preload{ 　　// url中的图片会依次次请求过来。 background:url('./src/static/images/goods1.png');
background:url('./src/static/images/goods2.png'); background:url('./src/static/images/goods3.png');
}
```

3. 通过 js：批量创建 Image 对象，为它们的 src 属性赋上我们需要下载的图片 URL

#### 4.5.2 srcset 属性

img 元素的 srcset 属性用于浏览器根据宽、高和像素密度来加载相应的图片资源。

```html
<img
  src="images/gun.png"
  srcset="images/bg_star.jpg 1200w, images/share.jpg 800w, images/gun.png 320w"
  sizes="(max-width: 320px) 300w, 1200w"
/>
```

### 4.6\<title> 与 \<h1> 的区别、\<b> 与 \<strong> 的区别、\<i> 与 \<em> 的区别？

#### title 与 h1 的区别

title 是网站标题，title 概括网站信息，可以直接告诉搜索引擎和用户这 个网站是关于什么主题和内容的，是显示在网页 Tab 栏里的；

h1 是文章主题，h1 突出文章主题，面对用户，更突出其视觉效果，指向 页面主体信息，是显示在网页中的。

#### b 与 strong 的区别

b(bold)是实体标签，用来给文字加粗，b 标签只是加粗的样式，没有实际含义，常用来表达无强调或着重意味的粗体文字，比如文章摘要中的关键词、 评测文章中的产品名称、文章的导言；

strong 是逻辑标签，作用是加强字符语气。strong 表示标签内字符重要，用以强调，其默认格式是加粗，但是可以通 过 CSS 添加样式，使用别的样式强调。

建议：为了符合 CSS3 的规范，b 应尽量少用而改用 strong

#### i 与 em 的区别

i(italic)是实体标签，用来使字符倾斜，

em(emphasis)是逻辑标签，作用是强调文本内容

区别：

i 标签只是斜体的样式，没有实际含义，常用来表达无强调或着重意味的斜体，比如生物学名、术语、外来语；

em 表示标签内字符重要，用以强调，其默认格式是斜体，但是可以通过 CSS 添加样式。

建议：为了符合 CSS3 的规范，i 应尽量少用而改用 em

#### p 与 span 的区别

一般标签都有语义,p 标签是指一个段落，而且默认是一个块级元素，span 是一个行内元素的代表，没有什么意思，一般可以放文字等行内元素

p 块级元素，一般用于一段。

span 行内元素，一般用于一行。

## 5.HTML5 离线缓存

在 html 标签中引入 `manifest` 属性，这个属性指向一个 manifest 的文件，这个文件指明了当前页面哪些资源需要进行离线缓存

- 离线浏览 - 用户可在应用离线时使用它们。
- 速度 - 已缓存资源加载得更快。
- 减少服务器负载 - 浏览器将只从服务器下载更新过或更改过的资源。

HTML5 的离线存储是基于一个新建的.appcache 文件的，通过这个文件上的解析清单离线存储资源 ，这些资源就会像 cookie 一样被存储了下来。之后当网络在处于离线状态下时，浏览器会通过被离线存储的数据进行页面展示

1、首先在文档的 html 标签中设置 manifest 属性，引用 manifest 文件 。

2、然后配置 manifest 文件，在 manifest 文件中编写离线存储的资源。

3、最后操作 window.applicationCache 进行需求实现。

4、此外，必须要在服务器端正确的配置 MIME-type。

step1：在文档的 html 标签中设置 manifest 属性，引用 manifest 文件 。

```html
<!DOCTYPE html>
<html manifest="/static/manifest/home.appcache">
  ...
</html>
```

step2：配置 manifest 文件，在 manifest 文件中编写离线存储的资源。

```bash
CACHE MANIFEST  # 写在第一行
#version 1.0
CACHE：  # 在此标题下列出的文件将在首次下载后进行缓存
    img.jpg
NETWORK: # 在此标题下列出的文件需要与服务器连接，且不会被缓存。
    *     # 可以使用*，表示除CACHE 外的所有其他资源/文件都需要因特网连接。

FALLBACK: # 在此标题下列出的文件规定当页面无法访问时的替代页面。
    /demo/ /404.html
```

step3：操作 window.applicationCache 进行需求实现。

window.applicationCache 对象是对浏览器的应用缓存的编程访问方式。其 status 属性可用于查看缓存的当前状态。

status 属性值：

0（UNCACHED） :无缓存， 即没有与页面相关的应用缓存。

1（IDLE） :闲置，即应用缓存未得到更新。

2 （CHECKING） :检查中，即正在下载描述文件并检查更新。

3 （DOWNLOADING） :下载中，即应用缓存正在下载描述文件中指定的资源。

4 （UPDATEREADY） :更新完成，所有资源都已下载完毕。

5 （IDLE） :废弃，即应用缓存的描述文件已经不存在了，因此页面无法再访问应用缓存。

以下代码使用 status 属性为当前通过网页所加载的文档确定应用程序缓存的状态。

```javascript
var oAppCache = window.applicationCache;
var sCacheStatus = "Not supported";
switch (oAppCache.status) {
    case 0: // UNCACHED == 0
       sCacheStatus ='（UNCACHED） : 无缓存， 即没有与页面相关的应用缓存';
    break;
    case 1: // IDLE == 1
        sCacheStatus = '（IDLE） : 闲置，即应用缓存未得到更新';
    break;
    case 2: // CHECKING == 2
        sCacheStatus = '（CHECKING） : 检查中，即正在下载描述文件并检查更新';
    break;
    case 3: // DOWNLOADING == 3
        sCacheStatus ='（DOWNLOADING） : 下载中，即应用缓存正在下载描述文件';
    break;
    case 4: // UPDATEREADY == 4
        sCacheStatus ='（UPDATEREADY） : 更新完成，所有资源都已下载完毕';
    break;
    case 5: // OBSOLETE == 5
        sCacheStatus ='（IDLE） : 废弃，即应用缓存的描述文件已经不存在了，因此页面无法再访问应用缓存');
    break;
    default:
        console.log( 'UKNOWN CACHE STATUS');
    break;
};
```

浏览器会对下载进度、应用缓存更新和错误状态等情况触发相应事件。

step4：在服务器端正确的配置 MIME-type。

若遇到如此报错“Application Cache Error event: Manifest fetch failed (404)”,其原因是 manifest 文件需要正确的配置 MIME-type（描述该消息的媒体类型），即“text/cache-manifest”，必须在服务器端进行配置。不同服务器配置方式不一样，举在 tomcat 服务器配置的例子。

在 tomcat 服务器中的 conf/web.xml 中添加：

```xml
<mime-mapping>
    <extension>manifest</extension>
    <mime-type>text/cache-manifest</mime-type>
</mime-mapping>
```

在开发者工具的 Network 面板下，可以看到 img.jpg 的 Size 为(from disk cache)，意味着是从缓存中读取的。

### 5.1 更新缓存

一旦应用被缓存，它就会保持缓存直到发生下列情况：

- 用户清空浏览器缓存。
- manifest 文件被修改。
- 由程序来更新应用缓存。
- 由程序来更新应用缓存:

```javascript
oAppCache.addEventListener(
  'updateready',
  function () {
    oAppCache.swapCache(); // 更新本地缓存
    location.reload(); //重新加载页面页面
  },
  false,
);
```

## 6.src 和 href 的区别

**href**标识超文本引用，用在**link**和**a**等元素上，**href**是引用和页面关联，是在当前元素和引用资源之间建立联系

**src**表示引用资源，表示替换当前元素，用在**img**，**script**，**iframe**上，src 是页面内容不可缺少的一部分。

## 7.常用的 meta 标签

meta 元素共有三个可选属性（http-equiv、name 和 scheme）和一个必选属性（content），content 定义与 http-equiv 或 name 属性相关的元信息

```html
name属性

<!-- 页面作者 -->

<meta name="author" content="Xing" />

<!-- 页面描述 -->

<meta name="description" content="meta元素共有三个可选属性(不超过150字符)" />

<!-- 页面关键词 -->

<meta name="keywords" content="meta标签总结,meta标签" />

<!-- 页面修改信息 -->

<meta name="revised" content="story,2015/07/22" />

<!-- 版权信息 -->

<meta name="copyright" content="All Rights Reserved" />

<!-- cookie设置 -->

<meta
  http-equiv="set-cookie"
  content="cookie value=xxx;expires=Wed,22-Jul-201511:11:11GMT；path=/"
/>

<!-- 去除iphone 识别数字为号码、不识别邮箱、禁止跳转至地图 -->

<meta name="format-detection" content="telephone=no,email=no,adress=no" />
```

## 8.空元素 & 可替换元素 & 非替换元素

### 8.1 空元素

空（void）元素，即没有内容的 HTML 元素。空元素是在开始标签中关闭的，也就是说空元素没有闭合标签的。

```html
<area />
<base />
<br />
<col />
<embed />
<hr />
<img />
<input />
<link />
<meta />
<param />
<source />
<track />
```

### 8.2 可替换元素

替换元素就是浏览器根据元素的标签和属性，来决定元素的具体显示内容。替换元素是其内容不受 CSS 视觉格式化模型控制的元素，(x)html 中的 img , input , textarea , select , object 都是替换元素，这些元素没有实际的内容，即是个空元素。

### 8.3 非替换元素

(X)HTML 的大多数元素是非替换元素，他们将内容直接告诉浏览器，将其显示出来。如：

```html
<p>p的内容</p>
<label>label的内容</label>
```

## 9.web worker

Web Worker 的作用，就是为 JavaScript 创造多线程环境，允许主线程创建 Worker 线程，将一些任务分配给后者运行。在主线程运行的同时，Worker 线程在后台运行，两者互不干扰。等到 Worker 线程完成计算任务，再把结果返回给主线程。这样的好处是，一些计算密集型或高延迟的任务，被 Worker 线程负担了，主线程（通常负责 UI 交互）就会很流畅，不会被阻塞或拖慢。

Worker 线程一旦新建成功，就会始终运行，**不会被主线程上的活动（比如用户点击按钮、提交表单）打断**。这样有利于随时响应主线程的通信。但是，这也造成了 Worker 比较耗费资源，不应该过度使用，而且一旦使用完毕，就应该关闭。

### 9.1worker 线程

主线程采用`new`命令，调用`Worker()`构造函数，新建一个 Worker 线程。

```
var worker = new Worker('work.js');
```

`Worker()`构造函数的参数是一个脚本文件，该文件就是 Worker 线程所要执行的任务。由于 Worker 不能读取本地文件，所以这个脚本必须来自网络。如果下载没有成功（比如 404 错误），Worker 就会默默地失败。

然后，主线程调用`worker.postMessage()`方法，向 Worker 发消息。

> ```javascript
> worker.postMessage('Hello World');
> worker.postMessage({ method: 'echo', args: ['Work'] });
> ```

`worker.postMessage()`方法的参数，就是主线程传给 Worker 的数据。它可以是各种数据类型，包括二进制数据。

接着，主线程通过`worker.onmessage`指定监听函数，接收子线程发回来的消息。

> ```javascript
> worker.onmessage = function (event) {
>   console.log('Received message ' + event.data);
>   doSomething();
> };
>
> function doSomething() {
>   // 执行任务
>   worker.postMessage('Work done!');
> }
> ```

### 9.2Worker 线程完成轮询

- 轮询是按照某种算法进行顺序触发，轮询时会保存**当前执行后的索引**，以便于下次执行时可以拿到**开始索引位置**，以达到负载均衡的目的。

## 10.DOCTYPE

<!DOCTYPE> 声明必须位于 HTML5 文档中的第一行，也就是位于 <html> 标签之前。该标签告知浏览器文档所使用的 HTML 规范。

doctype 声明不属于 HTML 标签；tag; 它是一条指令，告诉浏览器编写页面所用的标记的版本。

在所有 HTML 文档中规定 doctype 是非常重要的，这样浏览器就能了解预期的文档类型。

HTML 4.01 中的 doctype 需要对 DTD 进行引用，因为 HTML 4.01 基于 SGML。而 HTML 5 不基于 SGML，因此不需要对 DTD 进行引用，但是需要 doctype 来规范浏览器的行为（让浏览器按照它们应该的方式来运行。）。

**浏览器本身分为两种模式，一种是标准模式，一种是怪异模式，浏览器通过 doctype 来区分这两种模式，doctype 在 html 中的作用就是触发浏览器的标准模式，如果 html 中省略了 doctype，浏览器就会进入到 Quirks 模式的怪异状态**，在这种模式下，有些样式会和标准模式存在差异，而 html 标准和 dom 标准值规定了标准模式下的行为，没有对怪异模式做出规定，因此不同浏览器在怪异模式下的处理也是不同的，所以一定要在 html 开头使用 doctype。

注：<!DOCTYPE> 对大小写不敏感。

```HTML
<!DOCTYPE HTML>
```

### 10.1 浏览器模式

浏览器按照 W3C 标准解析执行代码；

标准模式：浏览器按照 W3C 标准解析执行代码；

怪异模式：浏览器根据自己向后兼容的方式解析执行代码；

#### 获取当前模式

在控制台输入 document.compatMode 就可以知道当前的模式。

- BackCompat：怪异模式

- CSS1Compat：标准模式

#### 标准模式与怪异模式区别

盒模型宽高：

- 在怪异模式下，盒模型为怪异盒模型 ，宽高包含 padding 和 border；

- 在标准模式下，盒模型为标准盒子模型，宽高为内容宽高不包含 padding 和 border；

图片垂直对齐方式：

- 对于行内元素和 table-cell 元素，标准模式下 vertical-align 属性默认值是 baseline；

- 在怪异模式下，table 单元格中的图片的 vertical-align 属性默认值是 bottom，因此在图片底部会有几像素的空间；

元素中的字体：

- css 中 font 的属性都是可以继承的；

- 怪异模式下，对于 table 元素，字体的某些元素不能从其他封装元素继承中得到，特别是 font-size 属性

内联元素的尺寸：

- 标准模式下，non-replaced inline 元素无法自定义大写；

- 怪异模式下，定义元素的宽高会影响元素的尺寸；

元素的百分比高度：

- 当一个元素使用百分比高度时，在标准模式下，高度取决于内容变化；

- 在怪异模式下，百分比被准确应用；

元素溢出的处理：

- 标准模式下，overflow 取值默认值为 visible；

- 在怪异模式下，这个溢出会被当做扩展 box 对待，就是元素的大小由内容决定，溢出不会裁剪，元素框自动调整，包含溢出内容；

## 11.页面生命周期

HTML 页面的生命周期包含三个重要事件：

1. DOMContentLoaded —— 浏览器已完全加载 HTML，并构建了 DOM 树，但像 `<img>` 和样式表之类的外部资源可能尚未加载完成。
2. load —— 浏览器不仅加载完成了 HTML，还加载完成了所有外部资源：图片，样式等。
3. beforeunload/unload —— 当用户正在离开页面时。

### 11.1 DOMContentLoaded

DOMContentLoaded 事件发生在 `document` 对象上。

我们必须使用 `addEventListener` 来捕获它：

在示例中，DOMContentLoaded 处理程序在页面加载完成后触发，所以它可以查看所有元素，包括它下面的 `<img>`元素。

但是，它不会等待图片加载。因此，alert 显示其大小为零。

```html
<script>
  function ready() {
    alert('DOM is ready');
    // 图片目前尚未加载完成（除非已经被缓存），所以图片的大小为 0x0
    alert(`Image size: ${img.offsetWidth}x${img.offsetHeight}`);
  }
  document.addEventListener('DOMContentLoaded', ready);
</script>

<img id="img" src="https://domload" />
```

#### 11.1.1 DOMContentLoaded 和脚本

当浏览器处理一个 HTML 文档，并在文档中遇到 `<script>`标签时，就会在继续构建 DOM 之前运行它。这是一种防范措施，因为脚本可能想要修改 DOM，甚至对其执行 `document.write` 操作，所以 DOMContentLoaded 必须等待脚本执行结束。

- 不会阻塞 DOMContentLoaded 的脚本此规则：

  1. 具有 async 特性的脚本不会阻塞 DOMContentLoaded。
  2. 使用 document.createElement('script') 动态生成并添加到网页的脚本也不会阻塞 DOMContentLoaded。

#### 11.1.2 DOMContentLoaded 和样式

外部样式表不会影响 DOM，因此 DOMContentLoaded 不会等待它们。

但这里有一个陷阱。如果在样式后面有一个脚本，那么**该脚本必须等待样式表加载完成**：

```html
<link type="text/css" rel="stylesheet" href="style.css" />
<script>
  // 在样式表加载完成之前，脚本都不会执行
  alert(getComputedStyle(document.body).marginTop);
</script>
```

原因是，脚本可能想要获取元素的坐标和其他与样式相关的属性，如上例所示。因此，它必须等待样式加载完成。

当 DOMContentLoaded 等待脚本时，它现在也在等待脚本前面的样式。

#### 11.1.3 浏览器内建的自动填充

Firefox，Chrome 和 Opera 都会在 DOMContentLoaded 中自动填充表单。

例如，如果页面有一个带有登录名和密码的表单，并且浏览器记住了这些值，那么在 DOMContentLoaded 上，浏览器会尝试自动填充它们（如果得到了用户允许）。

因此，如果 DOMContentLoaded 被需要加载很长时间的脚本延迟触发，那么自动填充也会等待。你可能在某些网站上看到过（如果你使用浏览器自动填充）—— 登录名/密码字段不会立即自动填充，而是在页面被`完全加载前`会延迟填充。这实际上是 DOMContentLoaded 事件之前的延迟。

### 11.2 window.onload

当整个页面，包括样式、图片和其他资源被加载完成时，会触发 window 对象上的 load 事件。可以通过 onload 属性获取此事件。

下面的这个示例正确显示了图片大小，因为 `window.onload` 会等待所有图片加载完毕：

```html
<script>
  window.onload = function () {
    // 也可以用 window.addEventListener('load', (event) => {
    alert('Page loaded');
    // 此时图片已经加载完成
    alert(`Image size: ${img.offsetWidth}x${img.offsetHeight}`);
  };
</script>

<img id="img" src="https://pageload" />
```

### 11.3 window.onunload

当访问者离开页面时，window 对象上的 `unload` 事件就会被触发。我们可以在那里做一些不涉及延迟的操作，例如关闭相关的弹出窗口。

有一个值得注意的特殊情况是发送分析数据。

假设我们收集有关页面使用情况的数据：鼠标点击，滚动，被查看的页面区域等。

由于是 `xhr` 请求是异步发送，很可能在它即将发送的时候，页面已经卸载了。自然地，当用户要离开的时候，我们希望通过 `unload` 事件将数据保存到我们的服务器上。

有一个特殊的 `navigator.sendBeacon(url, data)` 方法可以满足这种需求，详见规范 https://w3c.github.io/beacon/。

它在后台发送数据，转换到另外一个页面不会有延迟：浏览器离开页面，但仍然在执行 sendBeacon。

使用方式如下：

```ts
let analyticsData = {
  /* 带有收集的数据的对象 */
};

window.addEventListener('unload', function () {
  navigator.sendBeacon('/analytics', JSON.stringify(analyticsData));
});
```

- 请求以 `POST` 方式发送。
- 我们不仅能发送字符串，还能发送表单以及其他格式的数据，在 Fetch 一章有详细讲解，但通常它是一个字符串化的对象。一般会用到 `DOMString` , `Blob` 和 `Formdata` 这三种对象作为数据发送到后端
- 数据大小限制在 64kb。

当 sendBeacon 请求完成时，浏览器可能已经离开了文档，所以就无法获取服务器响应（对于分析数据来说通常为空）。

还有一个 keep-alive 标志，该标志用于在 fetch 方法中为通用的网络请求执行此类“离开页面后”的请求。你可以在 Fetch API 一章中找到更多相关信息。

如果我们要取消跳转到另一页面的操作，在这里做不到。但是我们可以使用另一个事件 —— onbeforeunload。

### 11.4 window.onbeforeunload

如果访问者触发了离开页面的导航（navigation）或试图关闭窗口，beforeunload 处理程序将要求进行更多确认。

如果我们要取消事件，浏览器会询问用户是否确定。

你可以通过运行下面这段代码，然后重新加载页面来进行尝试：

```ts
window.onbeforeunload = function () {
  return '有未保存的值。确认要离开吗？';
};
```

### 11.5 readyState

如果我们在文档加载完成之后设置 `DOMContentLoaded` 事件处理程序，会发生什么？

很自然地，它永远不会运行。

在某些情况下，我们不确定文档是否已经准备就绪。我们希望我们的函数在 DOM 加载完成时执行。

document.readyState 属性可以为我们提供当前加载状态的信息。

它有 3 个可能值：

- loading —— 文档正在被加载。
- interactive —— 文档被全部读取。
- complete —— 文档被全部读取，并且所有资源（例如图片等）都已加载完成。

所以，我们可以检查 document.readyState 并设置一个处理程序，或在代码准备就绪时立即执行它。

```ts
function work() {
  /*...*/
}

if (document.readyState == 'loading') {
  // 仍在加载，处理事件
  document.addEventListener('DOMContentLoaded', work);
} else {
  // DOM 已就绪！
  work();
}
```

还有一个 `readystatechange` 事件，会在状态发生改变时触发,它是跟踪文档加载状态的另一种机制，它很早就存在了。现在则很少被使用。

但是为了完整起见，让我们看看完整的事件流。

```html
<script>
  console.log('initial readyState:', document.readyState);
  document.addEventListener('readystatechange', () =>
    console.log('readyState:', document.readyState),
  );
  document.addEventListener('DOMContentLoaded', () => console.log('DOMContentLoaded'));
  window.onload = () => console.log('window onload');
</script>

<iframe src="" onload="console.log('iframe onload')"></iframe>

<img src="http://en.js.cx/clipart/train.gif" id="img" />
<script>
  img.onload = () => console.log('img onload');
</script>
<!-- 
[1]initial readyState: loading
[2]iframe onload
[2]img onload
[3]readyState: interactive
[4]DOMContentLoaded
[4]readyState: complete
[4]window onload
-->
```

方括号中的数字表示发生这种情况的大致时间。标有相同数字的事件几乎是同时发生的（± 几毫秒）。

- 在 `DOMContentLoaded` 之前，document.readyState 会立即变成 `interactive`。它们俩的意义实际上是相同的。
- 当所有资源（iframe 和 img）都加载完成后，document.readyState 变成 complete。这里我们可以发现，它与 img.onload（img 是最后一个资源）和 window.onload 几乎同时发生。
- 转换到 complete 状态的意义与 window.onload 相同。区别在于 window.onload 始终在所有其他 load 处理程序之后运行。

## 12.资源加载

浏览器允许我们跟踪外部资源的加载 —— 脚本，iframe，图片等。

[readystatechange](/big-frontend/前端/html#115-readystate) 事件也适用于资源，但很少被使用，因为 `load/error` 事件更简单

这里有两个事件：

- `onload` —— 成功加载，
- `onerror` —— 出现 error。

### 12.1 onload

假设我们需要加载第三方脚本，并调用其中的函数。

我们可以像这样动态加载它：

```ts
let script = document.createElement('script');
script.src = 'my.js';
document.head.append(script);
```

但如何运行该脚本中声明的函数？我们需要等到该脚本加载完成，之后才能调用它。

```ts
let script = document.createElement('script');

// 可以从任意域（domain），加载任意脚本
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.3.0/lodash.js';
document.head.append(script);

script.onload = function () {
  // 该脚本创建了一个变量 "_"
  alert(_.VERSION); // 显示库的版本
};
```

如果加载失败怎么办？例如，这里没有这样的脚本（error 404）或者服务器宕机（不可用）。

### 12.2 script.onerror

发生在脚本加载期间的 error 会被 error 事件跟踪到。

例如，我们请求一个不存在的脚本：

```ts
let script = document.createElement('script');
script.src = 'https://example.com/404.js'; // 没有这个脚本
document.head.append(script);

script.onerror = function () {
  alert('Error loading ' + this.src); // Error loading https://example.com/404.js
};
```

请注意，在这里我们无法获取更多 HTTP error 的详细信息。我们不知道 error 是 404 还是 500 或者其他情况。只知道是加载失败了。

onload/onerror 事件仅跟踪加载本身。在脚本处理和执行期间可能发生的 error 超出了这些事件跟踪的范围。也就是说：如果脚本成功加载，则即使脚本中有编程 error，也会触发 `onload` 事件。如果要跟踪脚本 error，可以使用 `window.onerror` 全局处理程序。

- 大多数资源在被添加到文档中后，便开始加载。但是 `<img>` 是个例外。它要等到获得 src (\*) 后才开始加载。
- 对于 `<iframe>` 来说，iframe 加载完成时会触发 iframe.onload 事件，无论是成功加载还是出现 error。
