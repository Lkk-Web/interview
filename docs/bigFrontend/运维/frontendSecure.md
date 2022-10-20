---
order: 4
---

# 前端安全

## 1、a 标签 rel=”noopener noreferrer”属性的作用详解

没有 rel=“noopener noreferrer”的情况下使用 target=“\_blank”是有安全风险，超链接 a 标签的 rel="noopener noreferrer"属性是一种新特性，它能让网站更安全，可以防止钓鱼网站，因为它获取的 window.opener 的值为 null。

## window.opener

window.opener 实际上就是通过 window.open 打开的窗体的父窗体。通过 window.opener 可以获取到源页面的部分控制权，即使新打开的页面是跨域也可以获取部分控制权。

比如在父窗体 parentForm 里面 通过 window.open("subForm.html"),那么在 subform.html 中 window.opener

就代表 parentForm,可以通过这种方式设置父窗体的值或者调用 js 方法。

如：1,window.opener.test(); ---调用父窗体中的 test()方法

2,如果 window.opener 存在,设置 parentForm 中 stockBox 的值。

    if (window.opener && !window.opener.closed) {
       window.opener.document.parentForm.stockBox.value = symbol;
    }
