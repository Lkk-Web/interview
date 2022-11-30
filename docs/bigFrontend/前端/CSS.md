---
order: 2
---

# CSS

## 1.CSS 选择器及其优先级

**!important>行内>id>类=属性=伪类（:）>标签（标签名）=伪元素(::)>通配符（\*）=子类选择器、兄弟选择器（>,+）**

```css
/* 属性选择器存在 title 属性的<a> 元素 */
a[title] {
  color: purple;
}
/* 后代选择器 通常用单个空格（" "）字符表示）组合了两个选择器*/
ul.my-things li {
  margin: 2em;
}
/* 子选择器 */
span {
  background-color: white;
}
div > span {
  background-color: DodgerBlue;
}
/* 兄弟选择符，位置无须紧邻，只须同层级，A~B 选择A元素之后所有同层级B元素。*/
p ~ span {
  color: red;
}

/* 相邻兄弟选择器 (+) 当第二个元素紧跟在第一个元素之后，并且两个元素都是属于同一个父元素的子元素，则第二个元素将被选中*/
li:first-of-type + li {
  color: red;
}
```

组合选择器里面的优先级：选择器的权值加在一起，权值大的优先；权值相同，后面的会覆盖前面的

css 匹配选择器是从右向左进行的 ul.ul-style{color:red;} 先匹配.ul-style 再匹配它前面的 ul 标签，应尽量减少选择器的嵌套。

## 2.盒模型(标准、怪异)

一个完整的盒模型有四部分组成，分别是内容区域 content，内边距 padding，边框 border，以及外边距 margin；其中 margin 不参与计算盒子的大小；盒模型有两种类型，IE 盒模型和标准盒模型；有时候 IE 盒模型也被成为怪异盒模型；

在现代浏览器当中默认是盒子模型，在 IE 盒模型当中，盒子的宽度是我们定义的 width 值，而在标准盒模型当中盒子的宽度是内容的 width + padding + border。

**标准盒模型**=>IE 盒模型：`box-sizing: border-box`

在标准盒模型当中，我们使用 CSS 定义盒子的宽度`width`和高度`height`并不是盒子所占据空间大小。在 IE（怪异）盒模型当中使用 CSS 定义盒子的宽度`width`和高度`height`就是盒子的大小。

## 3.伪类和伪元素

**伪类没有伪造元素，例如 first-child 只是给子元素添加样式而已。而伪元素其实相当于伪造了一个元素，例如 before,first-letter 达到的效果就是伪造了一个元素，然后添加了其相应的效果而已**。

css3 规范中要求使用双冒号（::）表示伪元素，以此来区分伪类和伪元素

比如伪元素 ::before 和::after 等伪元素使用双冒号（::）

伪类 :hover 和:active 伪类使用单冒号

:nth-child(n) 选择满足是其父元素的第 n 个子元素的元素

### 3.1 nth-child 和 nth-of-type 的区别

:nth-child(n) 选择器匹配属于其父元素的第 n 个子元素，不论元素的类型，n 可以是数字、关键词或公式。

:nth-of-type(n) 选择器匹配属于父元素的特定类型的第 n 个子元素的每个元素，n 可以是数字、关键词或公式。

p:nth-of-type(7) 选择的 p 元素所在的父元素，下的第 7 个 P 元素

p:nth-child(6) 选择的 p 元素所在的父元素，下的第 6 个子元素，且该元素是 P 元素

## 4.场景问题

### 4.1 1px 问题，为什么 border 不能小于 1px

- 物理像素： 移动设备出厂时，不同设备自带的不同像素，也称硬件像素；
- 逻辑像素： 即 css 中记录的像素。

在开发中，为什么移动端 CSS 里面写了 1px 或小于 1px，实际上看起来比 1px 粗；了解设备物理像素和逻辑像素的同学应该很容易理解，其实这两个 px 的含义其实是不一样的，UI 设计师要求的 1px 是指设备的物理像素 1px，而 CSS 里记录的像素是逻辑像素，它们之间存在一个比例关系，通常可以用 javascript 中的 `window.devicePixelRatio` 来获取，也可以用媒体查询的 `-webkit-min-device-pixel-ratio` 来获取。当然，比例多少与设备相关。

在手机上 border 无法达到我们想要的效果。这是因为 `devicePixelRatio`DRP 设备像素比 特性导致，iPhone 的 `devicePixelRatio==2`，而 `border-width: 1px;` 描述的是设备独立像素，所以，border 被放大到物理像素 2px 显示，在 iPhone 上就显得较粗。

解决：媒体查询 + transfrom 方案

```css
/* 2倍屏 */
@media only screen and (-webkit-min-device-pixel-ratio: 2) {
  .border-bottom::after {
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
}
/* 3倍屏 */
@media only screen and (-webkit-min-device-pixel-ratio: 3) {
  .border-bottom::after {
    -webkit-transform: scaleY(0.33);
    transform: scaleY(0.33);
  }
}
```

### 4.2 300ms 延迟

300ms 延迟是指当我们点击页面的时候移动端浏览器并不是立即作出反应，而是会等上 300ms 才会出现点击的效果。

而设置这 300ms 的意义在于判断用户的双击行为。

- 方案一：禁用缩放（HTML 文档头部设置 meta 标签）

```html
<meta name="viewport" content="user-scalable=no" />
<meta name="viewport" content="initial-scale=1,maximum-scale=1" />
```

**点击穿透现象**

由于很多时候，我们点击关闭弹窗时，弹窗立马就关闭了，但在移动端还存在一个点击延迟效果，即执行 tap 事件之后 300ms 之后才会触发 click 事件，在这 300ms 以内，因为上层元素隐藏或消失了，于是 click 事件就作用在了弹窗下的元素上，由于 click 事件的滞后性，同样位置的 DOM 元素触发了 click 事件（如果是 input 则触发了 focus 事件）。在代码中，给我们的感觉就是 target 发生了飘移。

点击穿透的原因：

在 pc 端的事件触发顺序：mousedown -> click -> mouseup

在移动端的事件触发顺序：touchstart -> touchmove -> touchend

移动端的事件优先级高，并且会模拟 mouse 事件，所以综合来看，移动端的执行顺序：

touchstart -> touchmove -> touchend -> mousedown -> click -> mouseup

解决方案：

1、使用 fastclick 禁止 300ms 点击延迟。

使用 fastclick 库，其实现思路是，取消 click 事件（参看源码 164-173 行），用 touchend 模拟快速点击行为（参看源码 521-610 行）。

```javascript
FastClick.attach(document.body);
```

2、使用 pointer-events 控制是否可点击。

不允许点击，即让点击穿透 ：pointer-events: none; 允许点击，即禁止穿透（默认值）：pointer-events: auto;

### 4.3 li 与 li 之间有看不见的空白间隔

浏览器的默认行为是把 inline 元素间的空白字符（空格换行 tab）渲染成一个空格，也就是我们上面的代码`<li>`换行后会产生换行字符，而它会变成一个空格，当然空格就占用一个字符的宽度。

**方法一：**既然是因为`<li>`换行导致的，那就可以将`<li>`代码全部写在一排

**方法二：**既然是空格占一个字符的宽度，那我们索性就将`<ul>`内的字符尺寸直接设为 0

### 4.4 CSS 单元(px、em、rem)

在 css 中单位长度用的最多的是 px、em、rem，这三个的区别是：

px 是固定的像素，一旦设置了就无法因为适应页面大小而改变。

em 和 rem 相对于 px 更具有灵活性，他们是相对长度单位，意思是长度不是定死了的，更适用于响应式布局。

对于 em 和 rem 的区别一句话概括：**em 相对于父元素，rem 相对于根元素。**

em/rem：用于做响应式页面，不过我更倾向于 rem，因为 em 不同元素的参照物不一样（都是该元素父元素），所以在计算的时候不方便，相比之下 rem 就只有一个参照物（html 元素），这样计算起来更清晰。

### 4.5 CSS 画三角形

只设置底部 border 颜色，其他部分使用透明颜色代替。

```css
.div {
  width: 0;
  height: 0;
  border-top: 40px solid transparent;
  border-right: 40px solid transparent;
  border-bottom: 40px solid #ff0000;
  border-left: 40px solid transparent;
}
```

### 4.6 小于 12px,chrome 小于 12px 会显示成 12px ，但在最新的 chrome 已支持小于 12px 的显示。

Chrome 中文版浏览器会默认设定页面的最小字号是 12px，英文版没有限制

原由 Chrome 团队认为汉字小于 12px 就会增加识别难度

常见的解决方案有：

- zoom // 变焦
- -webkit-transform:scale() //放缩
- -webkit-text-size-adjust:none //该属性用来设定文字大小是否根据设备(浏览器)来自动调整显示大小

#### Zoom

zoom 的字面意思是“变焦”，可以改变页面上元素的尺寸，属于真实尺寸

其支持的值类型有：

zoom:50%，表示缩小到原来的一半

zoom:0.5，表示缩小到原来的一半

#### -webkit-transform:scale()

针对 chrome 浏览器,加 webkit 前缀，用 transform:scale()这个属性进行放缩

注意的是，使用 scale 属性只对可以定义宽高的元素生效，所以，下面代码中将 span 元素转为行内块元素

### 4.7 如何让网站 1s 至灰

有些节日，如清明节等灰色节日，我们常常需要将整个网站至灰处理，极其简单的操作就是，如下代码

```css
html {
  filter: grayscale(1);
}
```

## 5.CSS3 新特性

CSS3 的新特征有：1、圆角效果；2、图形化边界；3、块阴影与文字阴影；4、使用 RGBA 实现透明效果；5、渐变效果；6、使用“@Font-Face”实现定制字体；7、多背景图；8、文字或图像的变形处理；9、多栏布局；10、媒体查询等。

```
transition： CSS属性，花费时间，效果曲线(默认ease)，延迟时间(默认0)
```

## 6.css 属性

### 6.1 点击穿透

pointer-events: none 指定当前元素不可点击,点击会默认穿透到下方元素

### 6.2 文本溢出

文本溢出，剩余部分转化为...

```css
overflow: hidden;
text-overflow: ellipsis;
```

### 6.3 把文本方向设置为“从右向左”

```css
div {
  direction: rtl; //ltr为从左向右
}
```

### 6.4 鼠标的光标设置

```css
cursor:default //箭头
cursor:pointer //小手
```

### 6.5 flex

    flex:flex-grow flex-shrink flex-basis;

flex-grow 属性定义项目的放大比例，默认为 0，即如果存在剩余空间，也不放大。规定项目将相对于其他灵活的项目进行扩展的量。默认值是 0。

flex-shrink 属性指定了 flex 元素的收缩规则。flex 元素仅在默认宽度之和大于容器的时候才会发生收缩，其收缩的大小是依据 flex-shrink 的值。

flex-basis 属性定义了在分配多余空间之前，项目占据的主轴空间，默认为 auto。

```css
.item {
  flex: 1;
}
/* 相当于 */
.item {
  flex-basis: 0%;
  flex-grow: 1;
  flex-shrink: 1;
}
```

## 7.**css 可继承属性与不可继承属性**

### **7.1、有继承性的属性**

1、字体系列属性

2、文本系列属性

3、元素可见性：visibility

4、表格布局属性

5、光标属性：cursor

### **7.2、无继承性的属性**

1、display：规定元素应该生成的框的类型

2、文本属性

3、盒子模型的属性

4、背景属性

5、定位属性

6、生成内容属性

7、轮廓样式属性

## 8.Link 和@import

`@import`是 CSS 提供的语法规则，只有导入样式表的作用；`link`是 HTML 提供的标签，不仅可以加载 CSS 文件，还可以定义 RSS、rel 连接属性等。

加载页面时，`link`标签引入的 CSS 被同时加载；`@import`引入的 CSS 将在页面加载完毕后被加载。

推荐使用 Link。可以避免考虑`@import`的语法规则和注意事项，避免产生资源文件下载顺序混乱和 http 请求过多的烦恼。

## 9.重排（回流）和重绘

### 9.1 重排（回流）

指的是当渲染树中的节点信息发生了大小、边距等问题，需要重新计算各节点和 css 具体的大小和位置。

### 9.2 重绘（重写）

当节点的部分属性发生变化，但不影响布局，只需要重新计算节点在屏幕中的绝对位置并渲染的过程，就叫重绘。比如：改变元素的背景颜色、字体颜色等操作会造成重绘。

### 9.3 transition 和 animation 的区别

1、transition 需要去触发比如：点击事件、鼠标移入事件；而 animation 可以配合 @keyframe 可以不触发事件就触发这个动画 translation:属性名 1s（动画时长）2s（动画延迟）ease（动画速率）

2、我们在用使用 aniamtion 的时候这样就可以改变很多属性，像我们改变了 width、height、postion 等等这些改变文档流的属性的时候就会引起，页面的回流和重绘，对性能影响就比较大，但是我们用 transition 的时候一般会结合 tansfrom 来进行旋转和缩放等不会生成新的位图，当然也就不会引起页面的重排了。 aniamtion :属性名（动画名称）2s（动画时长）ease（动画速率）

```css
 {
  position: relative;
  width: 100px;
  height: 100px;
  background: red;
  -webkit-animation: mymove 5s infinite;
  animation: mymove 5s infinite; /*Safari and Chrome*/
}
@keyframes mymove {
  from {
    left: 0px;
  }
  to {
    left: 200px;
  }
}
```

**用法**

#### 9.3.1 tranform、translate

transform(变形)是 CSS3 中的元素的属性，而 translate 只是 transform 的一个属性值；transform 是 transition（过渡动画）的 transition-property 的一个属性值。

#### 9.3.2 translate 相比定位的区别

translate 是 transform 的一个值。改变 transform 或者 opacity 不会触发浏览器重新布局，或者重绘，只会触发复合。而改变绝对定位会触发回流，进而触发重绘，所以说在使用绝对定位时会触发重绘和回流操作。并且 transform 使浏览器为元素创建一个 GPU 图层，但是改变绝对定位会使用到 CPU，因此 translate 更加高效，可以缩短平滑动画的绘制时间。而 translate 改变元素时，元素依然会占据原始位置，但是绝对定位不会发生这样的情况。

### 9.4 display:none 和 visible:hidden 的区别

如果给一个元素设置了 display: none，那么该元素以及它的所有后代元素都会隐藏，占据的空间消失，会引起**重排**。 给元素设置 visibility: hidden 也可以隐藏这个元素，但是隐藏元素仍需占用与未隐藏时一样的空间，也就是说虽然元素不可见了，但是仍然会影响页面布局。

## 10.requestAnimationFrame

html5 提供一个专门用于请求动画的 API，那就是 requestAnimationFrame，顾名思义就是**请求动画帧。**

`window.requestAnimationFrame()` 告诉浏览器——你希望执行一个动画，该方法需要传入一个回调函数作为参数，并且要求浏览器在下次重绘之前执行回调函数更新动画。。

当你准备更新动画时你应该调用此方法。这将使浏览器在下一次重绘之前调用你传入给该方法的动画函数 (即你的回调函数)。回调函数执行次数通常是每秒 60 次，但在大多数遵循 W3C 建议的浏览器中，回调函数执行次数通常与浏览器屏幕刷新次数相匹配。为了提高性能和电池寿命，因此在大多数浏览器里，当 requestAnimationFrame() 运行在后台标签页或者隐藏的`<iframe>` 里时，requestAnimationFrame() 会被暂停调用以提升性能和电池寿命。

与 setTimeout 相比，requestAnimationFrame 最大的优势是**由系统来决定回调函数的执行时机。**具体一点讲，requestAnimationFrame 的步伐跟着系统的刷新步伐走。**它能保证回调函数在屏幕每一次的刷新间隔中只被执行一次**(函数节流)，这样就不会引起丢帧现象，也不会导致动画出现卡顿的问题。

```javascript
window.requestAnimationFrame(callback);
```

### 兼容：优雅降级

由于 requestAnimationFrame 目前还存在兼容性问题，而且不同的浏览器还需要带不同的前缀。因此需要通过优雅降级的方式对 requestAnimationFrame 进行封装，优先使用高级特性，然后再根据不同浏览器的情况进行回退，直止只能使用 setTimeout 的情况。

## 11.BFC(块格式化上下文)

**BFC 是一个独立的布局环境，BFC 内部的元素布局与外部互不影响**

1、设置元素浮动 float

2、设置元素绝对定位 position: absolute;

3、设置元素为 inline-block

4、将元素的 overflow 设置为一个非 visible 的值

推荐方式：将 overflow 设置为 hidden 是副作用最小的开启 BFC 的方式

### 11.1 解决浮动元素令父元素高度坍塌的问题

方法：给父元素开启 BFC

原理：计算 BFC 的高度时，浮动子元素也参与计算

### 11.2 非浮动元素被浮动元素覆盖

方法：给非浮动元素开启 BFC

原理：BFC 的区域不会与 float box 重叠

### 11.3 两栏布局

方法：给固定栏设置固定宽度，给不固定栏开启 BFC。

原理：BFC 的区域不会与 float box 重叠

### 11.4 三栏布局

实现三栏布局中间自适应的布局方式有：

- 两边使用 float，中间使用 margin
- 两边使用 absolute，中间使用 margin
- flex 实现
- grid 网格布局

## 12.Css 预编语言

- 预处理语言

扩充了 Css 语言，增加了诸如变量、混合（mixin）、函数等功能，让 Css 更易维护、方便

本质上，预处理是 Css 的超集

包含一套自定义的语法及一个解析器，根据这些语法定义自己的样式规则，这些规则最终会通过解析器，编译生成对应的 Css 文件

Css 预编译语言在前端里面有三大优秀的预编处理器，分别是：

    sass less stylus

### 12.1 sass

2007 年诞生，最早也是最成熟的 Css 预处理器，拥有 Ruby 社区的支持和 Compass 这一最强大的 Css 框架，目前受 LESS 影响，已经进化到了全面兼容 Css 的 Scss

文件后缀名为.sass 与 scss，可以严格按照 sass 的缩进方式省去大括号和分号

### 12.2 less

2009 年出现，受 SASS 的影响较大，但又使用 Css 的语法，让大部分开发者和设计师更容易上手，在 Ruby 社区之外支持者远超过 SASS

其缺点是比起 SASS 来，可编程功能不够，不过优点是简单和兼容 Css，反过来也影响了 SASS 演变到了 Scss 的时代

### 12.3 stylus

Stylus 是一个 Css 的预处理框架，2010 年产生，来自 Node.js 社区，主要用来给 Node 项目进行 Css 预处理支持

所以 Stylus 是一种新型语言，可以创建健壮的、动态的、富有表现力的 Css。比较年轻，其本质上做的事情与 SASS/LESS 等类似

#### 区别

虽然各种预处理器功能强大，但使用最多的，还是以下特性：

- 变量（variables）
- 作用域（scope）
- 代码混合（ mixins）
- 嵌套（nested rules）
- 代码模块化（Modules）

**基本使用:**

```css
/* less和 scss */
.box {
  display: block;
}
/* sass */
.box
  display: block
/* stylus */
.box
  display: block
```

**变量:**

减少了原来在 Css 中无法避免的重复「硬编码」

```css
/* less */
@red: #c00;
strong {
  color: @red;
}
/* sass */
$red: #c00;
strong {
  color: $red;
}
/* stylus */
red = #c00
strong
  color: red
```

**作用域:**

Css 预编译器把变量赋予作用域，也就是存在生命周期。就像 js 一样，它会先从局部作用域查找变量，依次向上级作用域查找

sass 中不存在全局变量

less 与 stylus 的作用域跟 javascript 十分的相似，首先会查找局部定义的变量，如果没有找到，会像冒泡一样，一级一级往下查找，直到根为止

**混入:**

混入（mixin）应该说是预处理器最精髓的功能之一了，简单点来说，Mixins 可以将一部分样式抽出，作为单独定义的模块，被很多选择器重复使用，可以在 Mixins 中定义变量或者默认参数

在 less 中，混合的用法是指将定义好的 ClassA 中引入另一个已经定义的 Class，也能使用够传递参数，参数变量为@声明

Sass 声明 mixins 时需要使用@mixinn，后面紧跟 mixin 的名，也可以设置参数，参数名为变量$声明的形式

stylus 中的混合和前两款 Css 预处理器语言的混合略有不同，他可以不使用任何符号，就是直接声明 Mixins 名，然后在定义参数和默认值之间用等号（=）来连接

```css
/* less */
.alert {
  font-weight: 700;
}
.highlight(@color: red) {
  color: @color;
  font-size: 1.2em;
}
.heads-up {
  .alert;
  .highlight(red);
}
/* sass */
@mixin large-text {
  font: {
    family: Arial;
    size: 20px;
    weight: bold;
  }
  color: #ff0000;
}
.page-title {
  @include large-text;
  margin-top: 10px;
  padding: 4px;
}
/* stylus */
error(borderWidth= 2px) {
  color: #f00;
  border: borderWidth solid #f00;
}
```

**嵌套:**

三者的嵌套语法都是一致的，甚至连引用父级选择器的标记 & 也相同

区别只是 Sass 和 Stylus 可以用没有大括号的方式书写

```less
.a {
  &.b {
    color: red;
  }
}
```

**代码模块化:**

模块化就是将 Css 代码分成一个个模块

scss、less、stylus 三者的使用方法都如下所示

```css
@import './common';
@import './github-markdown';
@import './mixin';
@import './variables';
```

## 13.CSS Sprites（精灵图）

[css](http://www.fly63.com/tag/css) Sprites 是一种性能优化[技术](http://www.fly63.com/)，一种网页图片应用处理方式：将多个图像组合成单个图像文件以在[网站](http://www.fly63.com/)上使用的方法，减少 http 请求，以提高性能；也被称为[css](http://www.fly63.com/tag/css) 精灵图。

当需要特定图像（精灵图）时，可以通过[css](http://www.fly63.com/tag/css) background 背景定位[技术](http://www.fly63.com/)技巧布局网页背景。在需要用到图片的时候，现阶段是通过[css](http://www.fly63.com/tag/css)属性 background-image 组合 background-repeat, **background-position**等来实现图片的显示。

## 14.CSS 性能优化

1，首推的是合并 css 文件，如果页面加载 10 个 css 文件，每个文件 1k，那么也要比只加载一个 100k 的 css 文件慢。

2，减少 css 嵌套，最好不要套三层以上。

3，不要在 ID 选择器前面进行嵌套，ID 本来就是唯一的而且人家权值那么大，嵌套完全是浪费性能。

4，建立公共样式类，把相同样式提取出来作为公共类使用，比如我们常用的清除浮动等。

5，减少通配符\*或者类似[hidden="true"]这类选择器的使用，挨个查找所有...这性能能好吗？当然重置样式这些必须 的东西是不能少的。

6，巧妙运用 css 的继承机制，如果父节点定义了，子节点就无需定义。

7，拆分出公共 css 文件，对于比较大的项目我们可以将大部分页面的公共结构的样式提取出来放到单独 css 文件里， 这样一次下载后就放到缓存里，当然这种做法会增加请求，具体做法应以实际情况而定。

8，不用 css 表达式，表达式只是让你的代码显得更加炫酷，但是他对性能的浪费可能是超乎你的想象的。 CSS 表达式:IE5 及其以后版本支持在 CSS 中使用 expression，css 表达式就是在**css 属性后使用 expression ()连接一段 JavaScript 表达式**，css 属性的值是 JavaScript 表达式的结果。

```css
//以下是引用片段：
#myDiv {
  position: absolute;
  top: expression(document.body.offsetHeight - 110 + 'px');
  left: expression(document.body.offsetWidth - 110 + 'px');
  width: 100px;
  height: 100px;
}
```

9，少用 css rest，可能你会觉得重置样式是规范，但是其实其中有很多的操作是不必要不友好的，有需求有兴趣的朋友可以选择 normolize.css（）

css rest：意为重置默认样式。HTML 中绝大部分标签元素在网页显示中都有一个默认属性值，通常为了避免重复定义元素样式，需要进行重置默认样式（CSS Reset）

Normalize.css ：是一个很小的 CSS 文件，但它在默认的 HTML 元素样式上提供了跨浏览器的高度一致性。相比于传统的 CSS reset，Normalize.css 是一种现代的、为 HTML5 准备的优质替代方案。Normalize.css 现在已经被用于 Twitter Bootstrap、HTML5 Boilerplate、GOV.UK、Rdio、CSS Tricks 以及许许多多其他框架、工具和网站上。

10，cssSprite，合成所有 icon 图片，用宽高加上 bacgroud-position 的背景图方式显现出我们要的 icon 图，这是一种十分实用的技巧，极大减少了 http 请求。

11，当然我们还需要一些善后工作，CSS 压缩(这里提供一个在线压缩 YUI Compressor ，当然你会用其他工具来压缩是十 分好的)，

12，GZIP 压缩，Gzip 是一种流行的文件压缩算法，详细做法可以谷歌或者百度。

## 15.CSS 工程化

CSS 工程化是为了解决以下问题：

1. **宏观设计**：CSS 代码如何组织、如何拆分、模块结构怎样设计？
2. **编码优化**：怎样写出更好的 CSS？
3. **构建**：如何处理我的 CSS，才能让它的打包结果最优？
4. **可维护性**：代码写完了，如何最小化它后续的变更成本？如何确保任何一个同事都能轻松接手？

以下三个方向都是时下比较流行的、普适性非常好的 CSS 工程化实践：

- 预处理器：Less、 Sass 等；
- 重要的工程化插件： PostCss；
- Webpack loader 等 。

### 15.1 PostCss

PostCss 是如何工作的？我们在什么场景下会使用 PostCss？

它和预处理器的不同就在于，预处理器处理的是类 CSS，而 PostCss 处理的就是 CSS 本身。Babel 可以将高版本的 JS 代码转换为低版本的 JS 代码。PostCss 做的是类似的事情：它可以编译尚未被浏览器广泛支持的先进的 CSS 语法，还可以自动为一些需要额外兼容的语法增加前缀。更强的是，由于 PostCss 有着强大的插件机制，支持各种各样的扩展，极大地强化了 CSS 的能力。

PostCss 在业务中的使用场景非常多：

- 提高 CSS 代码的可读性：PostCss 其实可以做类似预处理器能做的工作；
- 当我们的 CSS 代码需要适配低版本浏览器时，PostCss 的 Autoprefixer 插件可以帮助我们自动增加浏览器前缀；

使用：创建 postcss.config.js 文件，在给该文件中添加使用的 loader。这种方式更加简洁相较于第一种

```ts
module.exports = {
  plugins: [require('autoprefixer'), require('postcss-preset-env')],
};
```

**importLoaders**

该选项用于处理一个 CSS 文件，通过 @import 的方式引入另一个 CSS 文件的情况

```css
/* index.css */
@import "./test.css/"
​
/* test.css */
:fullscreen {
​
}
​
.content {
  user-select: none;
}
```

在这种情况下，如果不添加 importLoaders 选项，那么 test.css 中的样式是不会被处理的。

原因在于，当匹配到 css 文件时，首先使用 postcss-loader 处理 index.css 文件，它并不会根据 @import 语法去处理引入的 test.css 文件。然后使用 css-loader 进行处理，css-loader 可以根据 @import 处理引入的 test.css 文件，这就导致 test.css 中的文件其实并没有被 postcss 处理

为了解决这种问题，可以在 css-loader 的 options 中添加一个 importLoaders 选项

```ts
 {
  loader: 'css-loader', options: {
    importloaders: 1  // 该数字代表需要前面几个 loader 再次处理;
  }
}
```

其意思是，当使用 css-loader 时，再使用 css-loader 之前的若干个 loader 处理一次

- 允许我们编写面向未来的 CSS：PostCss 能够帮助我们编译 CSS next 代码；

## 16.移动端

### 16.1**viewport（视口）**

配置视口：

```html
<meta
  name="viewport"
  content="width=device-width; initial-scale=1; maximum-scale=1; minimum-scale=1; user-scalable=no;"
/>
```

![img](https://pic3.zhimg.com/80/v2-1c83186a01781649b393c9e0b055c4a2_720w.jpg)
