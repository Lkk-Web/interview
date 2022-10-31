---
group:
  order: 4
order: 2
---

# Webpack

从本质上讲，webpack 是现代 JavaScript 应用程序的静态模块打包器。当 webpack 处理你的应用程序时，它会在内部从一个或多个入口点构建一个依赖关系图，然后将项目所需的每个模块组合成一个或多个 `bundles`，这些 bundles 是提供内容的静态资产。

## 一、概念

从 Webpack 4.0.0 版本开始，webpack 不需要配置文件来打包你的项目。

Webpack 5 在 Node.js 版本 10.13.0+ 上运行。

- entry:webpack 工作开始的地方，就是一个 js 文件。webpack 通过这个文件内的 import，收集其他模块文件，在通过其他模块文件内的 import 语句，收集其他依赖，最后将所有模块文件打包到一起，形成一个整体可运行的代码。 默认的入口文件是`src/index.js`。
- output:webpack 通过 build 过程打包后形成的文件。默认的输出文件夹为根目录下的 `dist/`文件夹。
- loaders:Webpack 本身只能加载 `JS/JSON` 模块，如果要加载其他类型的文件(模块)，就需要使用对应的 loader 进行转换/加载
- plugins:插件可以完成一些 loader 不能完成的功能,可以利用插件来执行更广泛的任务，如包优化、资产管理和环境变量注入。
- mode: webpack 有两种工作方式：`development`（开发模式）和 `production`（生产模式）。 主要的区别就是 `production` 模式下，产生的捆绑包（文件）更小，去掉了在运行下无关的注释，空格等等。这样可以加快用户加载代码的速度。

### 浏览器兼容

Webpack 支持所有符合 ES5 的浏览器（不支持 IE8 及以下版本）。WebpackPromise 需要 import()和 require.ensure(). 如果你想支持旧版浏览器，你需要在使用这些表达式之前加载一个 `polyfill` （Babel）。

## 二、Entry(入口)

用法：`entry: <entryChunkName> string | [<entryChunkName> string] | {}`

```typescript
module.exports = {
  entry: {
    main: {
      dependOn: 'a2', //当前入口点依赖的入口点。必须在加载此入口点之前加载它们。
      import: './src/app.js', //启动时加载的模块
      runtime: false | <string>, //运行时块的名称。设置后，将创建一个新的运行时块。它可以设置为false避免从 webpack 5.43.0 开始出现新的运行时块。
    },
    // vendor: './src/vendor.js',多页应用
  },
};
```

注：runtime 并且 dependOn 不应在单个条目上一起使用，否则会配置无效并会引发错误

## 三、Output(输出)

## 四、Loaders(加载器)

## 五、Plugins(插件)

## 六、Mode(模式)

## 七、工程化样例

## 鸣谢

参考文档：[webpack](https://webpack.js.org/concepts/#entry)
