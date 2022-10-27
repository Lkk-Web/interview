---
order: 3
---

# Bable

Babel 的前身是从 `6to5` 这个库发展而来,Babel 是一个工具链，主要用于将采用 ECMAScript 2015+ 语法编写的代码转换为向后兼容的 JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境,而不用担心现有环境是否支持.

- 语法转换
- 通过 Polyfill 方式在目标环境中添加缺失的特性 （通过引入第三方 polyfill 模块，例如 core-js）
- 源码转换（codemods）

```javascript
// Babel 输入： ES2015 箭头函数
[1, 2, 3].map((n) => n + 1);

// Babel 输出： ES5 语法实现的同等功能
[1, 2, 3].map(function (n) {
  return n + 1;
});
```

### 8.1 JSX 与 React
