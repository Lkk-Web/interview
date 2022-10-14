---
group:
  order: 2
order: 1
---

主要记录不记得的常见面试题

# HTML

## 1、HTMl

### 1.HTML5 新增 API 属性

- draggable 可拖拽
- contenteditable 富文本编辑器

### 2.优雅降级和渐进增强

渐进增强 ：针对低版本浏览器进行构建页面，保证最基本的功能，然后再针对高级浏览器进行效果、交互等改进和追加功能达到更好的用户体验。

优雅降级 ：一开始就构建完整的功能，然后再针对低版本浏览器进行兼容。

### 3.Canvas 与 SVG

canvas：HTML5 的 canvas 元素使用 JavaScript 在网页上绘制图像。画布是一个矩形区域，可以控制其每一像素。canvas 拥有多种绘制路径、矩形、圆形、字符以及添加图像的方法。

svg：可伸缩矢量图形

### 4.不常用标签

#### 4.1\<label>

用于绑定一个[表单](https://so.csdn.net/so/search?q=表单&spm=1001.2101.3001.7020)元素, 当点击 label 标签的时候, 被绑定的表单元素就会获得输入焦点。

```html
<label> 用户名： <input type="radio" name="usename" value="请输入用户名" /> </label>
```

#### 4.2\<iframe>

iframe 元素会创建包含另外一个文档的内联框架（即行内框架）。这是官方文档的原话，有点难以理解，实际上就是在你的页面上外链一个页面出来，以窗口的形式呈现在你的页面中。

- 可以用于嵌入第三方资源，比如广告、视频或音频等等。使用 iframe 可以保证页面代码的简洁，还能让文挡之间有隔离不用担心相互之间有影响

#### 4.3\<script>

\<script>标签打开 defer 或 async 属性，脚本就会异步加载。渲染引擎遇到这一行命令，就会开始下载外部脚本，但不会等它下载和执行，而是直接执行后面的命令。

##### 4.3.1 defer

`defer`要等到整个页面在内存中正常渲染结束（DOM 结构完全生成，以及其他脚本执行完成），才会执行；

HTML5 规范要求脚本按照它们出现的先后顺序执行，因此第一个延迟脚本会先于第二个延迟脚本执行，而这两个脚本会先于`DOMContentLoaded`事件执行。**在现实当中**，延迟脚本并不一定会按照顺序执行，也不一定会在`DOMContentLoad`时间触发前执行，因此最好只包含一个延迟脚本。

##### 4.3.2 async

`async`一旦下载完，渲染引擎就会中断渲染，执行这个脚本以后，再继续渲染。

与`defer`不同的是，标记为`async`的脚本并不保证按照它们的先后顺序执行。第二个脚本文件可能会在第一个脚本文件之前执行。因此确保两者之间互不依赖非常重要。指定`async`属性的目的是不让页面等待两个脚本下载和执行，从而异步加载页面其他内容。

#### 4.4title 与 h1 的区别、b 与 strong 的区别、i 与 em 的区别？

##### title 与 h1 的区别

title 是网站标题，title 概括网站信息，可以直接告诉搜索引擎和用户这 个网站是关于什么主题和内容的，是显示在网页 Tab 栏里的；

h1 是文章主题，h1 突出文章主题，面对用户，更突出其视觉效果，指向 页面主体信息，是显示在网页中的。

##### b 与 strong 的区别

b(bold)是实体标签，用来给文字加粗，b 标签只是加粗的样式，没有实际含义，常用来表达无强调或着重意味的粗体文字，比如文章摘要中的关键词、 评测文章中的产品名称、文章的导言；

strong 是逻辑标签，作用是加强字符语气。strong 表示标签内字符重要，用以强调，其默认格式是加粗，但是可以通 过 CSS 添加样式，使用别的样式强调。

建议：为了符合 CSS3 的规范，b 应尽量少用而改用 strong

##### i 与 em 的区别

i(italic)是实体标签，用来使字符倾斜，

em(emphasis)是逻辑标签，作用是强调文本内容

区别：

i 标签只是斜体的样式，没有实际含义，常用来表达无强调或着重意味的斜体，比如生物学名、术语、外来语；

em 表示标签内字符重要，用以强调，其默认格式是斜体，但是可以通过 CSS 添加样式。

建议：为了符合 CSS3 的规范，i 应尽量少用而改用 em

##### p 与 span 的区别

一般标签都有语义,p 标签是指一个段落，而且默认是一个块级元素，span 是一个行内元素的代表，没有什么意思，一般可以放文字等行内元素

p 块级元素，一般用于一段。

span 行内元素，一般用于一行。

### 4.5**img srcset 属性**

img 元素的 srcset 属性用于浏览器根据宽、高和像素密度来加载相应的图片资源。

```html
<img
  src="images/gun.png"
  srcset="images/bg_star.jpg 1200w, images/share.jpg 800w, images/gun.png 320w"
  sizes="(max-width: 320px) 300w, 1200w"
/>
```

### 5.HTML5 离线缓存

在 html 标签中引入 manifest 文件，这个属性指向一个 manifest 的文件，这个文件指明了当前页面哪些资源需要进行离线缓存

HTML5 的离线存储是基于一个新建的.appcache 文件的，通过这个文件上的解析清单离线存储资源 ，这些资源就会像 cookie 一样被存储了下来。之后当网络在处于离线状态下时，浏览器会通过被离线存储的数据进行页面展示

```
<!DOCTYPE HTML>
<html manifest="/static/manifest/home.appcache">
...
</html>
```

### 6.src 和 href 的区别

**href**标识超文本引用，用在**link**和**a**等元素上，**href**是引用和页面关联，是在当前元素和引用资源之间建立联系

**src**表示引用资源，表示替换当前元素，用在**img**，**script**，**iframe**上，src 是页面内容不可缺少的一部分。

### 7.常用的 meta 标签

meta 元素共有三个可选属性（http-equiv、name 和 scheme）和一个必选属性（content），content 定义与 http-equiv 或 name 属性相关的元信息

```html
name属性

<!-- 页面作者 -->

<meta name="author" content="yangzai" />

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

### 8.空元素

空（void）元素，即没有内容的 HTML 元素。空元素是在开始标签中关闭的，也就是说空元素没有闭合标签的。

```html
<area />、
<base />
<br />
<col />
<colgroup>
  <command>
    <embed />
    <hr />
    <img />
    <input />
    <keygen>
      <link />
      <meta />
      <param />
      <source />
      <track /></keygen
  ></command>
</colgroup>
```

### 9.web worker

Web Worker 的作用，就是为 JavaScript 创造多线程环境，允许主线程创建 Worker 线程，将一些任务分配给后者运行。在主线程运行的同时，Worker 线程在后台运行，两者互不干扰。等到 Worker 线程完成计算任务，再把结果返回给主线程。这样的好处是，一些计算密集型或高延迟的任务，被 Worker 线程负担了，主线程（通常负责 UI 交互）就会很流畅，不会被阻塞或拖慢。

Worker 线程一旦新建成功，就会始终运行，**不会被主线程上的活动（比如用户点击按钮、提交表单）打断**。这样有利于随时响应主线程的通信。但是，这也造成了 Worker 比较耗费资源，不应该过度使用，而且一旦使用完毕，就应该关闭。

#### 9.1worker 线程

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

#### 9.2Worker 线程完成轮询

- 轮询是按照某种算法进行顺序触发，轮询时会保存**当前执行后的索引**，以便于下次执行时可以拿到**开始索引位置**，以达到负载均衡的目的。
