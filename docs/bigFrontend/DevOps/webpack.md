---
group:
  order: 4
order: 3
---

# Webpack

从本质上讲，webpack 是现代 JavaScript 应用程序的静态模块打包器。当 webpack 处理你的应用程序时，它会在内部从一个或多个入口点构建一个依赖关系图，然后将项目所需的每个模块组合成一个或多个 `bundles`，这些 bundles 是提供内容的静态资产。

webpack 工作的原理是什么？工作流程是什么？

webpack 读取配置，根据入口开始遍历文件，解析依赖，使用 loader 处理各模块，然后将文件打包成 `bundle` 后输出到 output 指定的目录中。

webpack 的工作流程是

1. Webpack CLI 启动打包流程，解析配置项参数。
2. 载入 Webpack 核心模块，创建 Compiler 对象。
3. 注册 plugins。
4. 使用 Compiler 对象开始编译整个项目。
5. 从入口文件开始，解析模块为 AST，分析模块依赖，形成依赖关系树。
6. 递归依赖树，将每个模块交给对应的 Loader 处理。
7. 合并 Loader 处理完的结果，将打包结果输出到 dist 目录。

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

由于 tree shaking 只支持 esmodule ，如果你打包出来的是 `commonjs`，此时 tree-shaking 就失效了。不过当前大家都用的是 vue，react 等框架，他们都是用 babel-loader 编译，以下配置就能够保证他一定是 esmodule.

> 因为 require 是运行时调用，所以 require 理论上可以运用在代码的任何地方，没有办法在编译时候就确定模块是否被用到，所以无法彻底地将不用的模块摇掉。

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

- 热更新原理:

1. Webpack Compiler: 将 JS 编译成 Bundle
2. Bundle Server: 提供文件在浏览器的访问，实际上就是一个服务器
3. HMR Server: 将热更新的文件输出给 HMR Runtime
4. HMR Runtime: 会被注入到 bundle.js 中，与 HRM Server 通过 `WebSocket` 链接，接收文件变化，并更新对应文件
5. bundle.js: 构建输出的文件

使用`webpack-dev-server`去启动本地服务，内部实现主要使用了 webpack、express、websocket。

- 使用 express 启动本地服务，当浏览器访问资源时对此做响应。
- 服务端和客户端使用 websocket 实现长连接
- webpack 监听源文件的变化，即当开发者保存文件时触发 webpack 的重新编译。
  - 每次编译都会生成 hash 值、已改动模块的 json 文件、已改动模块代码的 js 文件
  - 编译完成后通过 socket 向客户端推送当前编译的 hash 戳
- 客户端的 websocket 监听到有文件改动推送过来的 hash 戳，会和上一次对比
  - 一致则走缓存
  - 不一致则通过 ajax 和 jsonp 向服务端获取最新资源

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

## 四、Output(输出)

## 五、Loaders(加载器)

## 六、Plugins(插件)

## 七、Mode(模式)

## 八、工程化样例

### 8.1 样式隔离

### 8.2 优雅降级

### 8.3 optimization(优化)

#### 8.3.1 optimization.concatenateModules

普通打包只是将一个模块最终放到一个单独的`立即执行函数`中，如果你有很多模块，那么就有很多立即执行函数。concatenateModules 可以要所有的模块都合并到一个函数里面去。

```javascript
module.exports = {
  optimization: {
    usedExports: true,
    concatenateModules: true,
    minimize: true,
  },
};
```

#### 8.3.2 optimization.flagIncludedChunks

告知 webpack 确定和标记出作为其他 chunk 子集的那些 chunk，其方式是在已经加载过较大的 chunk 之后，就不再去加载这些 chunk 子集。optimization.flagIncludedChunks 默认会在 `production` 模式 中启用，其他情况禁用

```javascript
module.exports = {
  optimization: {
    flagIncludedChunks: true,
  },
};
```

#### 8.3.3 optimization.mergeDuplicateChunks

告知 webpack `合并含有相同模块`的 chunk。将 optimization.mergeDuplicateChunks 设置为 false 以禁用这项优化。

```javascript
module.exports = {
  optimization: {
    mergeDuplicateChunks: true,
  },
};
```

#### 8.3.4 optimization.removeAvailableModules

如果模块已经包含在所有父级模块中，告知 webpack 从 chunk 中检测出这些模块，或移除这些模块。将 optimization.removeAvailableModules 设置为 true 以启用这项优化。在 `production` 模式 中默认会被开启。

```javascript
module.exports = {
  optimization: {
    removeAvailableModules: true,
  },
};
```

#### 8.3.4 optimization.removeEmptyChunks

如果 chunk 为空，告知 webpack 检测或移除这些 chunk。将 optimization.removeEmptyChunks 设置为 false 以禁用这项优化。

```javascript
module.exports = {
  optimization: {
    removeEmptyChunks: true,
  },
};
```

#### 8.3.4 optimization.splitChunks

默认情况下，它只会影响到按需加载的 chunks，因为修改 initial chunks 会影响到项目的 HTML 文件中的脚本标签。

webpack 将根据以下条件自动拆分 chunks：

- 新的 chunk 可以被共享，或者模块来自于 node_modules 文件夹
- 新的 chunk 体积大于 20kb（在进行 min+gz 之前的体积）
- 当按需加载 chunks 时，并行请求的最大数量小于或等于 30
- 当加载初始化页面时，并发请求的最大数量小于或等于 30

当尝试满足最后两个条件时，最好使用较大的 chunks。

```javascript
module.exports = {
  //...
  optimization: {
    splitChunks: {
      chunks: 'async' | 'all', //这表明将选择哪些 chunk 进行优化,设置为 all 可能特别强大，因为这意味着 chunk 可以在异步和非异步 chunk 之间共享。
      minSize: 20000, // 生成 chunk 的最小体积（以 bytes 为单位）
      minRemainingSize: 0, //生成 chunk 所需的主 chunk（bundle）的最小体积（以字节为单位）缩减
      minChunks: 1, //拆分前必须共享模块的最小 chunks 数。
      maxAsyncRequests: 30, // 按需加载时的最大并行请求数。
      maxInitialRequests: 30, // 入口点的最大并行请求数
      enforceSizeThreshold: 50000,
      automaticNameDelimiter: '~', // 此选项用于指定生成名称的分隔符。
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/, //控制此缓存组选择的模块,匹配 chunk 名称时，将选择 chunk 中的所有模块
          priority: -10, //缓存组的优先级,优化将优先考虑具有更高 priority（优先级）的缓存组，默认为负
          reuseExistingChunk: true, //如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块。这可能会影响 chunk 的结果文件名。
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
        json: {
          type: 'json', //允许按模块类型将模块分配给缓存
        },
      },
    },
  },
};
```

##### splitChunks.cacheGroups

缓存组可以继承和/或覆盖来自 splitChunks.\* 的任何选项。但是 test、priority 和 reuseExistingChunk 只能在缓存组级别上进行配置。将它们设置为 false 以禁用任何默认缓存组。

### 编译打包优化方案

umi:在配置项 chainWebpack 上能够获取到整个 webpack 的配置文件

```json
"analyzeDev": "ANALYZE=1 umi dev", // 开发打包分析
"analyzeBuild": "ANALYZE=1 umi build", // 生产打包分析
```

一、编译优化

1. 缓存文件，加速项目重启速度
2. 分配更多 v8 内存，确保大项目能正常启动
3. 解决 babel-plugin-react-css-modules 与 cssLoader 在 windows 上协作异常问题
4. 开启多线程打包
   - 过滤部分非必要的且耗时的 webpack 插件
   - 升级代码压缩的插件，并开启缓存
     - 升级 UglifyJsPlugin 为 ParallelUglifyPlugin

二、文件优化

1. 图片大小优化
2. 清除无用文件
   - momentjs 国际化
   - lodashjs 国际化文件
   - @antd-design icons/lib
   - src/helpers/antdIcons.js
3. 文件压缩 gzip

三、动态加载

1. splitchunksPlugin
   - dynamic
2. CommonsChunkPlugin

四、缓存

1. 强缓存协商缓存
2. cdn 缓存

建议以下插件在 dev 环境下使用：

`BundleAnalyzerPlugin` `HardSourceWebpackPlugin`

建议以下插件在 prod 环境下使用：

`ParallelUglifyPlugin` `IgnorePlugin`

五、部署优化（CICD 编译优化）在许多自动化集成的系统中，项目的构建空间会在每次构建执行完毕后，立即回收清理。在这种情况下，默认的项目构建缓存目录（node_mo dules/.cache）将无法留存，导致即使项目中开启了缓存设置，也无法享受缓存的便利性，反而因为需要写入缓存文件而浪费额外的时间。因此，在集成化的平台中构建部署的项目，如果需要使用缓存，则需要根据对应平台的规范，将缓存设置到公共缓存目录下。

六、webpack 5 中部分默认开启的优化 plugin 只在联调环境中生效。生产环境需要手动配置

参考链接：

[umi 项目性能优化 - 简书](https://www.jianshu.com/p/48e24329e08f)

[umi 工程的打包优化 - 阿里云](https://developer.aliyun.com/article/1050878)

[Ant Design Pro 项目打包优化 - 稀土](https://juejin.cn/post/6990869970385109005#heading-6)

[v5 和 v4 的区别 - 稀土](https://juejin.cn/post/6990869970385109005#heading-6)

[webpack optimization 编译优化 - 官网](https://webpack.docschina.org/configuration/optimization/#optimizationprovidedexports)

## 鸣谢

参考文档：[webpack](https://webpack.js.org/concepts/#entry)
