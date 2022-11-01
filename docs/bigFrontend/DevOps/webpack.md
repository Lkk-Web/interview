---
group:
  order: 4
order: 2
---

# Webpack

从本质上讲，webpack 是现代 JavaScript 应用程序的静态模块打包器。当 webpack 处理你的应用程序时，它会在内部从一个或多个入口点构建一个依赖关系图，然后将项目所需的每个模块组合成一个或多个 `bundles`，这些 bundles 是提供内容的静态资产。

## 一、概念

- entry:webpack 工作开始的地方，就是一个 js 文件。webpack 通过这个文件内的 import，收集其他模块文件，在通过其他模块文件内的 import 语句，收集其他依赖，最后将所有模块文件打包到一起，形成一个整体可运行的代码。 默认的入口文件是`src/index.js`。
- output:webpack 通过 build 过程打包后形成的文件。默认的输出文件夹为根目录下的 `dist/`文件夹。
- loaders:Webpack 本身只能加载 `JS/JSON` 模块，如果要加载其他类型的文件(模块)，就需要使用对应的 loader 进行转换/加载
- plugins:插件可以完成一些 loader 不能完成的功能,可以利用插件来执行更广泛的任务，如包优化、资产管理和环境变量注入。
- mode: webpack 有两种工作方式：`development`（开发模式）和 `production`（生产模式）。 主要的区别就是 `production` 模式下，产生的捆绑包（文件）更小，去掉了在运行下无关的注释，空格等等。这样可以加快用户加载代码的速度。

#### 浏览器兼容

Webpack 支持所有符合 ES5 的浏览器（不支持 IE8 及以下版本）。WebpackPromise 需要 import()和 require.ensure(). 如果你想支持旧版浏览器，你需要在使用这些表达式之前加载一个 `polyfill` （Babel）。

## 二、V4 和 V5 的区别

从 Webpack 4.0.0 版本开始，webpack 不需要配置文件来打包你的项目。

Webpack 5 在 Node.js 版本 10.13.0+ 上运行。

### 2.1 Tree Shaking

作用： 如果我们的项目中引入了 lodash 包，但是我只有了其中的一个方法。其他没有用到的方法是不是冗余的？此时 tree-shaking 就可以把没有用的那些东西剔除掉，来减少最终的 bundle 体积。

```javascript
module.exports = {
  optimization: {
    usedExports: true, //只导出被使用的模块
    minimize: true, // 启动压缩
  },
};
```

由于 tree shaking 只支持 esmodule ，如果你打包出来的是 commonjs，此时 tree-shaking 就失效了。不过当前大家都用的是 vue，react 等框架，他们都是用 babel-loader 编译，以下配置就能够保证他一定是 esmodule.

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "module": false
      }
    ]
  ]
}
```

`webpack5` 的 mode=“production” 自动开启 tree-shaking。

### 2.2 terser-webpack-plugin

作用：hs 代码压缩

`webpack5` 内置了 terser-webpack-plugin 插件，我们不用再下载安装。而且在 mode=“production” 的时候会自动开启 js 压缩功能。

webpack4 上需要下载安装 terser-webpack-plugin 插件，并且需要以下配置：

```javascript
const TerserPlugin = require('terser-webpack-plugin')
module.exports = {
// ...other config
optimization: {
  minimize: !isDev,
  minimizer: [
    new TerserPlugin({
      extractComments: false,
      terserOptions: {
        compress: {
          pure_funcs: ['console.log']
        }
      }
    }) ]
 }
```

#### webpack5 css 压缩导致的失效问题

当你下载 optimize-css-assets-webpack-plugin ，执行 css 压缩以后，你会发现 webpack5 默认的 js 压缩功能失效了。原因是你指定的压缩器是 optimize-css-assets-webpack-plugin 导致默认的 terser-webpack-plugin 就会失效。

```javascript
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          compress: {
            pure_funcs: ['console.log'],
          },
        },
      }),
      new OptimizeCssAssetsPlugin(),
    ],
  },
};
```

即便在 webpack5 中，你也要像 webpack4 中一样使用 js 压缩。

此时的压缩插件 optimize-css-assets-webpack-plugin 可以配置到 plugins 里面去，也可以配置到到 optimization 里面。配置到 plugins 中，那么这个插件在任何情况下都会工作。 而配置在 optimization 表示只有 minimize 为 true 的时候才能工作。

注：在 webpack5 里面使用 optimize-css-assets-webpack-plugin 也是会报错，因为官方已经打算要废除了，请使用替换方案:`css-assets-webpack-plugin`

### 2.3 缓存

- webpack4

```js
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
module.exports = {
  plugins: [
    // 其它 plugin...
    new HardSourceWebpackPlugin(),
  ],
};
```

- webpack5 内部内置了 cache 缓存机制。直接配置即可。

cache 会在开发模式下被设置成 `type:'memory'` 而且会在生产模式把 cache 给禁用掉。

```js
// webpack.config.js
module.exports = {
  // 使用持久化缓存
  cache: {
    type: 'filesystem' | 'memory', //memory 使用内容缓存，filesystem 使用文件缓存
    cacheDirectory: path.join(__dirname, 'node_modules/.cac/webpack'),
    //当 type=filesystem的时候设置cacheDirectory才生效。用于设置你需要的东西缓存放在哪里
  },
};
```

### 2.4 loader 差异

> webpack 4 加载资源需要用不同的 loader,webpack5 的资源模块类型替换 loader

在 webpack 5 之前，通常使用：

- raw-loader 将文件导入为字符串
- url-loader 将文件作为 data URI 内联到 bundle 中
- file-loader 将文件发送到输出目录

资源模块类型(asset module type)，通过添加 4 种新的模块类型，来替换所有这些 loader：

- asset/resource 发送一个单独的文件并导出 URL。之前通过使用 file-loader 实现。
- asset/inline 导出一个资源的 data URI。之前通过使用 url-loader 实现。
- asset/source 导出资源的源代码。之前通过使用 raw-loader 实现。
- asset 在导出一个 data URI 和发送一个单独的文件之间自动选择。之前通过使用 url-loader，并且配置资源体积限制实现。

当在 webpack 5 中使用旧的 assets loader（如 file-loader/url-loader/raw-loader 等）和 asset 模块时，你可能想停止当前 asset 模块的处理，并再次启动处理，这可能会导致 asset 重复，你可以通过将 asset 模块的类型设置为 'javascript/auto' 来解决。

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
        type: 'javascript/auto',
      },
    ],
  },
};

module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        type: 'asset/inline',
      },
    ],
  },
};
```

### 2.5 启动服务差异

- webpack 4

> 通过 webpack-dev-server 启动服务

- webpack 5

> 内置使用 webpack serve 启动，但是他的日志不是很好，所以一般都加都喜欢用 webpack-dev-server 优化。

### 2.6 模块联邦（微前端）

> webpack 5 可以实现 应用程序和应用程序之间的引用。

### 2.7 热更新

- webpack 4

```js
module.exports = {
  devServer:{
    // 其他 配置...
    hot: true
  }
  plugins: [
    // 其它 plugin...
    new HotModuleReplacementPlugin(),
  ],
};
```

- webpack 5

> 在 webpack 5 中 HMR 已自动支持。无需配置

## 三、Entry(入口)

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
