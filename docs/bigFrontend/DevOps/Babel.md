---
order: 2
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

babel 的工作流程和编译原理中的编译流程相对简单。我们可以归纳如下几个步骤：

- 词法分析
- 语法分析
- 代码转换
- 代码生成

### 一、配置文件.babelrc

Babel 的配置文件主要有`.babelrc`、`.babelrc.js`、`babel.config.js` 和`package.json`，他们的配置选项都是相同的，作用也是一样，主要区别在于格式语法的不同，因此我们在项目中只需要选择其中一种即可。

```json
{
  "presets": ["es2015", "react", "stage-2"],
  "plugins": []
}
```

### 二、命令行转码 babel-cli

Babel 提供 `babel-cli` 工具，用于命令行转码。package.json:

```json
{
  // ...
  "devDependencies": {
    "babel-cli": "^6.0.0"
  },
  "scripts": {
    "build": "babel src -d lib"
  }
}
```

转码的时候，就执行下面的命令。

```bash
$ npm run build
```

### 三、babel-core

如果某些代码需要调用 Babel 的 API 进行转码，就要使用 babel-core 模块。

```javascript
var babel = require('babel-core');
// 字符串转码
babel.transform('code();', options);
// => { code, map, ast }
// 文件转码（异步）
babel.transformFile('filename.js', options, function (err, result) {
  result; // => { code, map, ast }
});
// 文件转码（同步）
babel.transformFileSync('filename.js', options);
// => { code, map, ast }
// Babel AST转码
babel.transformFromAst(ast, code, options);
// => { code, map, ast }
```

### 四、babel-core

Babel 默认只转换新的 JavaScript 句法（syntax），而不转换新的 API，比如 Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise 等全局对象，以及一些定义在全局对象上的方法（比如 Object.assign）都不会转码。

举例来说，ES6 在 Array 对象上新增了 Array.from 方法。Babel 就不会转码这个方法。如果想让这个方法运行，必须使用 babel-polyfill，为当前环境提供一个垫片。

#### @babel/polyfill 和@babel/runtime 的区别

@babel/polyfill 和@babel/runtime 的区别：前者改造目标浏览器，让你的浏览器拥有本来不支持的特性；后者改造你的代码，让你的代码能在所有目标浏览器上运行，但不改造浏览器。

一个显而易见的区别就是打开 IE11 浏览器，如果引入了@babel/polyfill，在控制台我们可以执行 Object.assign({}, {})；而如果引入了@babel/runtime，会提示你报错，因为 Object 上没有 assign 函数。

#### 存在问题

通过 polyfill（垫片）的方式来解决 ES6 原型链上的函数等问题，然后通过 webpack 来打包，这样就能看到在我们的代码中加入了很多的兼容代码，会发现以下两个问题：

- 打包出来生成的文件非常的大；有一些语法特性可能是我们没用到的，但是 Webpack 不管三七二十一全都引用进去了，导致打包出来的文件非常庞大。

- 污染全局变量；polyfill 给很多类的原型链上添加函数，如果我们开发的是一个类库给其他开发者使用，这种情况会非常不可控。

因此从 Babel7.4 开始@babel/polyfill 就不推荐使用了，而是直接引入 core-js 与 regenerator-runtime 两个包；而@babel/polyfill 本身也是这两个包的集合；在上面 webpack 打包出来的 dist 文件我们也可以看到，引用的也是这两个包。

### 五、在线转换

Babel 提供一个 [REPL 在线编译器](https://babeljs.io/repl/#)，可以在线将 ES6 代码转为 ES5 代码。转换后的代码，可以直接作为 ES5 代码插入网页运行。
