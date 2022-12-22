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

loader 是文件加载器，能够加载资源文件，并对这些文件进行一些处理，诸如编译、压缩等，最终一起打包到指定的文件中，处理一个文件可以使用多个 loader， loader 接收源文件内容作为参数，其它 loader 接收前一个执行的 loader 的返回值作为参数，最后执行的 loader 会返回此模块的 JavaScript 源码.

一个最简单的 loader 例子:

```js
module.exports = function (source) {
  // source 为 compiler 传递给 Loader 的一个文件的原内容
  // 该函数需要返回处理后的内容，这里简单起见，直接把原内容返回了，相当于该 Loader 没有做任何转换
  return source;
};
```

> loader 的执行顺序是从右向左的

Loader 本身仅仅只是一个函数，接收模块代码的内容，然后返回代码内容转化后的结果，并且一个文件还可以链式的经过多个 loader 转化(比如 `scss-loader` => `css-loader` => `style-loader`)。

### 5.1 常见 loader

1. file-loader:文件加载
2. url-loader：文件加载，可以设置阈值，小于时把文件 base64 编码
3. image-loader：加载并压缩图片
4. json-loader：webpack 默认包含了
5. babel-loader：ES6+转成 ES5
6. ts-loader：将 ts 转成 js
7. awesome-typescript-loader：比上面那个性能好
8. css-loader：处理@import 和 url 这样的外部资源
9. style-loader：在 head 创建 style 标签把样式插入；
10. postcss-loader：扩展 css 语法，使用 postcss 各种插件`autoprefixer`，`cssnext`，`cssnano`
11. eslint-loader,tslint-loader:通过这两种检查代码，tslint 不再维护，用的 eslint
12. vue-loader：加载 vue 单文件组件
13. i18n-loader：国际化
14. cache-loader：性能开销大的 loader 前添加，将结果缓存到磁盘；
15. svg-inline-loader：压缩后的 svg 注入代码；
16. source-map-loader：加载 source Map 文件，方便调试；
17. expose-loader:暴露对象为全局变量
18. imports-loader、exports-loader 等可以向模块注入变量或者提供导出模块功能
19. raw-loader 可以将文件已字符串的形式返回
20. 校验测试：mocha-loader、jshint-loader 、eslint-loader 等

## 六、Plugins(插件)

plugin 功能更强大，Loader 不能做的都是它做。它的功能要更加丰富。从打包优化和压缩，到重新定义环境变量，功能强大到可以用来处理各种各样的任务。

plugin 让 webpack 的机制更加灵活，它在编译过程中留下的一系列生命周期的钩子，通过调用这些钩子来实现在不同编译结果时对源模块进行处理。

它的编译是基于事件流来编译的，主要通过 taptable 来实现插件的绑定和执行的，taptable 主要是基于发布订阅执行的插件架构，是用来创建声明周期钩子的库。调用 complier.hooks.run.tap 开始注册，创建 compilation，基于配置创建 chunks，在通过 parser 解析 chunks，使用模块和依赖管理模块之间的依赖关系，最后使用 template 基于 compilation 数据生成结果代码

### 6.1 plugin 实现

plugin 的实现可以是一个类，使用时传入相关配置来创建一个实例，然后放到配置的 plugins 字段中，而 plugin 实例中最重要的方法是 `apply`，该方法在 webpack compiler 安装插件时会被调用一次，apply 接收 webpack compiler 对象实例的引用，你可以在 compiler 对象实例上注册各种事件钩子函数，来影响 webpack 的所有构建流程，以便完成更多其他的构建任务。

一个最简单的 plugin 例子：

```js
class BasicPlugin {
  // 在构造函数中获取用户给该插件传入的配置
  constructor(options) {}

  // Webpack 会调用 BasicPlugin 实例的 apply 方法给插件实例传入 compiler 对象
  apply(compiler) {
    compiler.plugin('compilation', function (compilation) {});
  }
}

// 导出 Plugin
module.exports = BasicPlugin;
```

### 6.2 常见 plugin

1. ignore-plugin：忽略文件
2. terser-webpack-plugin: 支持压缩 ES6 (Webpack4)
3. `webpack-parallel-uglify-plugin`: 多进程执行代码压缩，提升构建速度
4. mini-css-extract-plugin: 分离样式文件，CSS 提取为独立文件，支持按需加载
5. serviceworker-webpack-plugin：为网页应用增加离线缓存功能
6. clean-webpack-plugin: 目录清理
7. speed-measure-webpack-plugin: 可以看到每个 Loader 和 Plugin 执行耗时
8. webpack 内置 UglifyJsPlugin，压缩和混淆代码。
9. webpack 内置 CommonsChunkPlugin，提高打包效率，将第三方库和业务代码分开打包。
10. ProvidePlugin：自动加载模块，代替 require 和 import
11. html-webpack-plugin:可以根据模板自动生成 html 代码，并自动引用 css 和 js 文件
12. extract-text-webpack-plugin: 将 js 文件中引用的样式单独抽离成 css 文件
13. DefinePlugin: 编译时配置全局变量，这对开发模式和发布模式的构建允许不同的行为非常有用。
14. HotModuleReplacementPlugin: 热更新
15. DllPlugin 和 DllReferencePlugin 相互配合，前者第三方包的构建，只构建业务代码，同时能解决 Externals 多次引用问题。DllReferencePlugin 引用 DllPlugin 配置生成的 manifest.json 文件，manifest.json 包含了依赖模块和 module id 的映射关系
16. optimize-css-assets-webpack-plugin 不同组件中重复的 css 可以快速去重
17. `webpack-bundle-analyzer`:一个 webpack 的 bundle 文件分析工具，将 bundle 文件以可交互缩放的 treemap 的形式展示。
18. `compression-webpack-plugin`: 生产环境可采用 gzip 压缩 JS 和 CSS
19. `happypack`：通过多进程模型，来加速代码构建

## 七、Mode(模式)

## 八、工程化样例

### 8.1 样式隔离

### 8.2 优雅降级

### 8.3 optimization(优化)

- 提升构建速度：

使用高版本的 webpack 和 nodejs

多进程多实例构建

多进程多实例并行压缩

进一步分包：预编译资源模块

充分利用缓存提升二次构建速度

缩小构建目标

使用 oneOf

- 提升加载和运行时性能：

使用 Tree Shaking 擦除无用的 js 和 css

scope-hoisting

使用 webpack 进行图片压缩

优化 polyfill 方案

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
