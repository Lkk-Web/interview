---
order: 4
---

# 前端安全

## 一、XSS(跨站点脚本攻击)

### 1.1 a 标签 rel=”noopener noreferrer”属性的作用详解

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
