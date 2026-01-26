---
group:
  order: 5
order: 3
---

## Vite

推荐课程[Vite 指南](https://www.bilibili.com/video/BV1GN4y1M7P5/)

思考以下问题：

1. 什么是构建工具？什么是 cli

2. webpack、rollup、vite 的优缺点

3. esmodule 规范

4. vite 是什么、vite 为什么快、基本安装和使用

5. vite 编译结果

6. vite 编译结果的分析

7. vite 配置文件

8. 常用插件

9. 构建原理

## 1、构建工具、什么是 cli

构建工具会开启电脑开发服务器，使代码变更去自动执行 tsc, react-compiler, less, babel, uglifyjs（解析 → 优化 → 压缩 → 混淆工具）流程

打包：将我们写的浏览器不认识的代码，交给构建工具进行编译处理的过程叫做打包

构建工具承担的工作：

1、`模块化开发支持`：支持直接从 node_modules 里引入代码 + 多种模块化支持（虽然现在 es6 有模块化，但是肯定也是没构建工具方便）模块化：AMD、CMD、Commonjs(node js)、esModule(现代化方案)

2、`处理代码兼容问题`：比如 label 语法降级，less，ts 等语法转换（不是构建工具做的，是构建工具将这些语法对应的处理工具集成进来自动化处理，构建工具只需要做一些配置(插件)就行）

3、`提高项目性能`：压缩文件，代码分割

4、`优化开发体验`：

- 构建工具会帮你自动监听文件的变化，当文件变化后自动帮你调用对应的集成工具重新打包，然后在浏览器重新运行（整个过程叫热更新,hot replacement,HMR）

- 开发服务器：跨域问题（只需要一个配置就可以解决跨域问题）

总结：构建工具让我们不用关心生产代码和我们的代码如何在浏览器运行，我们只需要首次给构建工具提供一个配置文件(webpack.config.json、vite.config.ts、umitr)，有了这个集成的配置文件之后，我们就可以在下次需要更新时调用一次对应的命令（eg：npm run dev）就好了，如果我们再结合热更新，就更不需要管任何东西！

## 2、 webpack、rollup、vite 的优缺点

起因：

项目越大，构建工具（webpack）所要处理的 js 代码就越多【跟 webpack 的一个构建过程（工作流程）有关】，构建工具需要很长的时间才能 启动开发服务器（运行项目）

webpack 编译原理的过程大致：

把我们的代码交给 AST（抽象语法分析的工具），分析我们写的这个 js 文件有哪些导入和导出操作，因为构建工具是运行在服务端的，所以可以修改文件，构建就会自己生成一个自己的 webpack_require 方法，去替换我们代码中不同的导入导出！

因为 webpack 支持多种模块化，他一开始必须要统一模块化代码，所以意味着他需要将所有的依赖全部读一次！

vite 和 webpack 对比

vite 是基于 esmodule 的，更关注于浏览器端开发体验；webpack 支持多种模块化，更关注兼容性，所以侧重点不一样！

官网：

webpack 会把所有依赖都读一次并且打包后才启动开发服务器；vite 是直接开启开发服务器，并且按需加载！

p4 vite 脚手架和 vite 区别

比如我们敲了：yarn create vite

1、帮我们全局安装一个东西：create-vite（vite 的 脚手架 ----》 搭建预设的一些东西）

2、直接运行 create-vite bin 目录下的一个执行配置（误区：认为官网中使用对应 yarn create 构建项目的过程也是 vite 做的事）

create vite 和 vite 的关系？create-vite 内置了 vite，就像 vue-cli 内置 webpack！vue-cli 只是 webpack 在 vue 这个的一个脚手架实现，免得你自己从零开始，create-vite 和 vite 的关系也一样！

create-vite/vue-cli 就像是开发商给你了一个简装的房子（引入部分依赖以及调整配置为最佳实践），而不是毛坯！

p5 为什么浏览器不默认不是相对或者绝对路径就直接请求 node_moudles？

因为浏览器端是通过网络请求获取的资源，举例：如果引入了 node_moudles 里面的 lodash，lodash 可能还会引入别的，会请求很多，很消耗资源；而 CommonJS 是 nodejs 规范，运行在服务器端，可以直接读取文件！

p6 依赖预构建

开发环境，解决 3 个问题：

1、不同的第三方包会有不同的导出格式（这个是 vite 没办法约束的，所以 vite 会找到对应的依赖，然后调用 esbuild 对 js 语法进行处理，将其他规范的代码转换成 esmodule 规范，然后放到当前目录下的 node_modules/.vite/deps，同时对 esmodule 规范的各个模块进行统一集成，见 3）

2、对路径的处理上可以直接使用：.vite /deps，方便路径重写（vite 遇见非绝对路径或相对路径的引用，vite 会尝试路径补全，见 1 所以就不会有路径不对的问题了！）

3、解决网络多包传输的性能问题（也是原生 esmodule 规范不敢支持 node_modules 的原因之一，因为有导入就加载，会有很多网络请求），有了依赖预构建之后无论有多少额外的 export 和 import，vite 都会尽可能将他们集成最后只生成一个或几个模块（会把导出的东西直接替换到导入这里）！

生产环境：vite 会全权交给 rollup 这个库去完成打包的！

p7 配置文件 vite.config.js

1、vite 配置文件提示

导入 defineConfig 就有！（推荐）使用注释（了解 --> 不用）

2、环境处理 --》 只能使用上述第一种

打印要在命令行看！！！

p8 环境变量文件

参考 ：https://cn.vitejs.dev/config/

vite / webpack 都内置了这个 dotenv 这个库，dotenv 会自动读取 .env 文件，并解析这个文件中对应的环境变量，将其注入到 process 对象下。

但是 vite 考虑到和其他配置得一些冲突问题，这些文件需要在执行完 Vite 配置后才能确定加载哪一个，所以 vite 不会默认加载.env。

vite 给了补救措施，当你的确需要时，你可以使用 Vite 的 loadEnv 函数来加载指定的 .env 文件。

1、node 环境下 loadEnv 会做如下几件事情：

直接找到.env 文件 ， 并解析其中的环境变量，并放到一个对象里会将传进来的 mode 这个变量的值进行拼接， .env.development，并根据我们提供的目录去取对应的配置文件并进行解析，并放进或者覆盖之前的对象可以理解为 const baseEnvConfig = 读取.env 的配置

const modeEnvConfig = 读取 mode.env 相关配置

const lastEnvConfig = {...baseEnvConfig, ...modeEnvConfig}

2、客户端下，vite 会将对应的环境变量注入到 import.meta.env 里面去

vite 做了一个拦截，为了防止我们将隐私性的变量直接送进 import.meta.env 中，所以做了一层拦截，如果环境变量不是以 VITE 开头的，就不会帮我们注入到客户端去

如果想要更改这个前缀，可以去使用 envPrefix 配置

补充知识：

1、三个文件代表什么

2、process.cwd() ：返回当前 node 进程的工作目录（类似于 webpack 的 \_\_dirname，webpack 配合 path 一起使用，见：https://www.bilibili.com/opus/780610353496064003?spm_id_from=333.999.0.0）

3、为什么 vite.config.js 是运行在 node 环境下，却能使用 esmodule 规范？

这是因为 vite 在读取 vite.config.js 的时候会事先 node 去解析文件语法，如果发现你是 esmodule 规范，会直接替换为 commonjs 规范（因为读到的都是字符串，可以替换）！

4、mode 会根据命令变化，eg：

yarn dev --mode aaa 会将 mode 参数设置为 aaa，不传默认是 development！

p9 vite 怎么识别.vue 文件

可以细看，对 node[koa]、服务器、vite 原理有更进一步的理解！

浏览器不会管后缀是什么，主要是请求后，看你给的 Content-Type 是什么（常见有三种：application/json、text/html、text/javaScript，更多见：https://www.runoob.com/http/http-content-type.html），给的是什么，浏览器就会用什么去解析，在浏览器和服务器眼里，文件都是字符串！

p10 需要上一节的 fs 知识 --> 读取文件

css\less 模块化：

就是使用 .module.css 来作为 css 文件名，然后通过 import xxx from ‘./xxx.module.css’ 引入，使用变量来设置类名，eg：

大致原理：

1、解析时发现是 module.css (module 是一种约定，表示需要开启 css 模块化)

2、将所有的类名进行一定规则的替换（加上 hash）

3、同时创建一个映射对象（保存你的类名和 hash 类名，eg：{footer: 'footer_i123st_1'}）

4、将替换后的内容塞进 style 标签，然后放入到 head 标签中

5、将.module.css 的内容抹除，替换成 js 脚本

6、将创建的映射对象在脚本中进行默认导出

p11 vite.config.js 中 css 的 modules

localsConvention：修改生成的配置对象的 key 的展示形式（驼峰还是中划线，上一节模块化中红框部分）一般没什么用

vite 配置文件中 css 配置流程（modules 篇） P11 - 04:24 类名转换规则配置

scopeBehaviour：配置当前的模块化行为是模块化还是全局化（有 hash 就是开启了模块化的一个标志） 一般没什么用，默认开启

generateScopedName：生成的类名的规则（可以配置成函数 / 字符串） 一般没什么用

vite 配置文件中 css 配置流程（modules 篇） P11 - 08:19 类名展示形式

hashPrefix：参与到 hash 的生成，让你生成的 hash 更加的独特（默认：生成 hash 会根据你的类名等去进行生成） 一般没什么用

globalModulePaths：不想参与 css 模块化的路径 一般没什么用

p12 vite.config.js 中 css

preprocessorOptions 推荐使用

主要是用来配置 css 预处理器的一些全局参数

math -- css 括号转化

vite 配置文件中 css 配置流程(preprocessorOptions 篇) P12 - 06:14

globalVars -- 全局变量

vite 配置文件中 css 配置流程(preprocessorOptions 篇) P12 - 10:04

devSourcemap 开启 css 的 Sourcemap 如果开了，css 也可以看到是哪一个文件写的！

p13 了解 postcss --> 类似 babel

保证 css 在执行起来时是万无一失的！(预处理器不能解决这些问题)

1、css 降级

2、前缀补全

3、postcss 也可以和 less、sass 一样解析嵌套语法什么的 (停止维护了，现在只要把编译结果给 postcss 进行后续处理就行！)

postcss 的前世今生 P13 - 16:12

自己使用 postcss（非框架）

1、安装依赖

yarn add postcss-cli postcss -D

2、书写描述文件 -- postcss.config.js -- 加插件 -- 加得多能做的就越多

如果不写，啥也不会干，因为 postcss 需要配置插件！

postcss 的前世今生 P13 - 22:12

3、postcss 变成了后处理器 见上方红字

p14 vite.config.js 中 css 的 postcss

vite 直接支持 postcss，只需要安装插件就行！

直接配置的就是 postcss 的配置，还是建议使用 postcss.config.js ，因为 vite 里面的 postcss 的 plugins 只能使用数组！！！

p15 记录全局变量插件

p16 为什么要使用\_\_dirname 和 path

如果写的是相对路径，node 会尝试去拼接成绝对路径！

不管你用的什么路径，最后都会转换成绝对路径，因为只有绝对路径才能够准确的找到文件！

node 端去读取文件时，如果发现你用的是相对路径，会使用 process.cwd() 来进行对应对的拼接

process.cwd：获取当前 node 的执行目录！

但是我们希望基于读取的文件去进行一个绝对路径的生成！

commonjs 规范：会注入几个变量到你的模块里面（每一个 js 文件），\_\_dirname 就是获取当前模块的绝对路径！

mac 和 window 的路径不一样，所以 path 本质上是一个字符串处理模块，它里面有非常多的路径字符串处理方法！

所以可以理解 path.resolve 就是在拼接字符串，后面一个使用 ./是让使用者更清楚，所以 path.resolve(**dirname, './xxx.js') === **dirname+’/xxx.js‘

参考：https://www.bilibili.com/opus/780610353496064003?spm_id_from=333.999.0.0

原理：

【原理篇】使用 path.resolve 的原因... P16 - 13:55

从这里开始视频就感觉不太行了！！！

p17 vite 加载静态资源

什么是静态资源：

1、前端：一些图片、视频、文字、图标

2、后端：除了 API，基本上都被视为静态资源

引入文件时，最好不要全部导入，而是按需导入，这样 vite 可以帮助进行优化！

p18 alias 原理 -- 简化

entires 就是获取 alias 的配置，然后去遍历替换等！

p19 vite 使用 svg

不像其他框架要特殊处理，vite 可以直接使用 svg 资源！

svg 缺点：没办法很好的去表示层次丰富的图片信息，一般都是图标！

导入图片，其实真实的路径是这样的（默认 url，为路径）：

还可以修改为读取文件内容：

视频中演示，如果是图片形式加载不能改颜色，但是读取文件内容可以：

p20 vite.config.js 中 build 配置

p21 vite 插件

中间件和插件类似，都是在生命周期的不同阶段去调用不同的中间件/插件以达到不同的目的！

p29 性能优化

防抖、节流、forEach 等，需要使用 lodash 里面的，别人的库做了性能优化！

其实还有很多，自己了解，按需去优化，不要为了优化而优化，只有当性能遇见瓶颈的时候再去优化！
