---
order: 4
---

# TypeScript

## 一、编译上下文

编译上下文算是一个比较花哨的术语，可以用它来给文件分组，告诉 TypeScript 哪些文件是有效的，哪些是无效的。除了有效文件所携带信息外，编译上下文还包含有正在被使用的编译选项的信息。定义这种逻辑分组，一个比较好的方式是使用 `tsconfig.json` 文件。

编译选项

```json
// tsconfig.json
{
  "compilerOptions": {
    /* 基本选项 */
    "target": "es5", // 指定 ECMAScript 目标版本: 'ES3' (default), 'ES5', 'ES6'/'ES2015', 'ES2016', 'ES2017', or 'ESNEXT'
    "module": "commonjs", // 指定使用模块: 'commonjs', 'amd', 'system', 'umd' or 'es2015'
    "lib": [], // 指定要包含在编译中的库文件
    "allowJs": true, // 允许编译 javascript 文件
    "checkJs": true, // 报告 javascript 文件中的错误
    "jsx": "preserve", // 指定 jsx 代码的生成: 'preserve', 'react-native', or 'react'
    "declaration": true, // 生成相应的 '.d.ts' 文件
    "sourceMap": true, // 生成相应的 '.map' 文件
    "outFile": "./", // 将输出文件合并为一个文件
    "outDir": "./", // 指定输出目录
    "rootDir": "./", // 用来控制输出目录结构 --outDir.
    "removeComments": true, // 删除编译后的所有的注释
    "noEmit": true, // 不生成输出文件
    "importHelpers": true, // 从 tslib 导入辅助工具函数
    "isolatedModules": true, // 将每个文件作为单独的模块 （与 'ts.transpileModule' 类似）.

    /* 严格的类型检查选项 */
    "strict": true, // 启用所有严格类型检查选项
    "noImplicitAny": true, // 在表达式和声明上有隐含的 any类型时报错
    "strictNullChecks": true, // 启用严格的 null 检查
    "noImplicitThis": true, // 当 this 表达式值为 any 类型的时候，生成一个错误
    "alwaysStrict": true, // 以严格模式检查每个模块，并在每个文件里加入 'use strict'

    /* 额外的检查 */
    "noUnusedLocals": true, // 有未使用的变量时，抛出错误
    "noUnusedParameters": true, // 有未使用的参数时，抛出错误
    "noImplicitReturns": true, // 并不是所有函数里的代码都有返回值时，抛出错误
    "noFallthroughCasesInSwitch": true, // 报告 switch 语句的 fallthrough 错误。（即，不允许 switch 的 case 语句贯穿）

    /* 模块解析选项 */
    "moduleResolution": "node", // 选择模块解析策略： 'node' (Node.js) or 'classic' (TypeScript pre-1.6)
    "baseUrl": "./", // 用于解析非相对模块名称的基目录
    "paths": {}, // 模块名到基于 baseUrl 的路径映射的列表
    "rootDirs": [], // 根文件夹列表，其组合内容表示项目运行时的结构内容
    "typeRoots": [], // 包含类型声明的文件列表
    "types": [], // 需要包含的类型声明文件名列表
    "allowSyntheticDefaultImports": true, // 允许从没有设置默认导出的模块中默认导入。

    /* Source Map Options */
    "sourceRoot": "./", // 指定调试器应该找到 TypeScript 文件而不是源文件的位置
    "mapRoot": "./", // 指定调试器应该找到映射文件而不是生成文件的位置
    "inlineSourceMap": true, // 生成单个 sourcemap 文件，而不是将 sourcemap 生成不同的文件
    "inlineSources": true, // 将代码与 sourcemap 生成到一个文件中，要求同时设置了 --inlineSourceMap 或 --sourceMap 属性

    /* 其他选项 */
    "experimentalDecorators": true, // 启用装饰器
    "emitDecoratorMetadata": true // 为装饰器提供元数据的支持
  }
}
```

### 1.1 global.d.ts

在上文中，当我们讨论文件模块时，比较了全局变量与文件模块，并且我们推荐使用基于文件的模块，而不是选择污染全局命名空间。

```ts
// global.d.ts
declare module 'foo' {
  // some variable declarations
  export var bar: number;
}
```

然而，如果你的团队里有 TypeScript 初学者，你可以提供他们一个 global.d.ts 文件，用来将一些接口或者类型放入全局命名空间里，这些定义的接口和类型能在你的所有 TypeScript 代码里使用。

对于任何需要编译成 JavaScript 的代码，我们强烈建议你放入文件模块里。

global.d.ts 是一种扩充 lib.d.ts 很好的方式，如果你需要的话。

当你从 JS 迁移到 TS 时，定义 declare module "some-library-you-dont-care-to-get-defs-for" 能让你快速开始。

## 二、声明空间

在 TypeScript 里存在两种声明空间：`类型声明空间`与`变量声明空间`。

### 2.1 类型声明空间

类型声明空间包含用来当做类型注解的内容，例如下面的类型声明：

```ts
//作为类型注解使用
class Foo {}
interface Bar {}
type Bas = {};
enum Car = {}

let foo: Foo;
let bar: Bar;
let bas: Bas;
let car: Car;
```

注意，尽管你定义了 interface Bar，却并不能够把它作为一个变量来使用，因为它没有定义在变量声明空间中。

#### 2.1.1 Required, Partial, Readonly, Pick

- Required

将类型属性都变成必填。

```ts
type Coord = Required<{ x: number; y?: number }>;

// 等同于
type Coord = {
  x: number;
  y: number;
};
```

- Partial

将类型定义的所有属性都修改为可选。

```ts
type Coord = Partial<Record<'x' | 'y', number>>;

// 等同于
type Coord = {
  x?: number;
  y?: number;
};
```

- Readonly

不管是从字面意思，还是定义上都很好理解：将所有属性定义为只读

```ts
type Coord = Readonly<Record<'x' | 'y', number>>;

// 等同于
type Coord = {
  readonly x: number;
  readonly y: number;
};

// 如果进行了修改，则会报错：
const c: Coord = { x: 1, y: 1 };
c.x = 2; // Error: Cannot assign to 'x' because it is a read-only property.
```

- Pick

从类型定义的属性中，选取指定一组属性，返回一个新的类型定义。

```ts
type Coord = Record<'x' | 'y', number>;
type CoordX = Pick<Coord, 'x'>;

// 等用于
type CoordX = {
  x: number;
};
```

### 2.2 变量声明空间

变量声明空间包含可用作变量的内容，在上文中 Class Foo 提供了一个类型 Foo 到类型声明空间，此外它同样提供了一个变量 Foo 到变量声明空间，如下所示：

```ts
class Foo {}
const someVar = Foo; //error:'someVar' is assigned a value but never used.
```

> 我们并不能把一些如 interface 定义的内容当作变量使用。

与此相似，一些用 var、let 声明的变量，也只能在变量`声明空间`使用，不能用作类型注解。

## 三、模块

选择上有 commonjs, amd, es modules, others，你可以根据不同的 module 选项来把 TypeScript 编译成不同的 JavaScript 模块类型,怎么书写 TypeScript 模块呢？

1. AMD：不要使用它，它仅能在浏览器工作；
2. SystemJS：这是一个好的实验，已经被 ES 模块替代；

使用 `module: commonjs` 选项以及使用 `ES 模块语法导入、导出、编写模块`。

一般使用：

```ts
// foo.ts
type someType = {
  foo: string;
};

export { someType }; //部分导出
export * from './foo'; //整体导出

// bar.ts
import { someType } from './foo';
let data: someType;
```

### 3.1 ESModule

ES Module 是 ES6 之后官方推出的模块化规范，使得 js 可以原生支持模块化，目前大多在服务端 node.js 中使用 CommonJS 方案，在浏览器中使用 ES Module 方。在 ES Moudle 之前，浏览器中通常使用 AMD 或 CMD。本文简要介绍 ES Module 的语法规范

1. 自动采用严格模式
2. 每个 ESM 模块都是单独的私有作用域
3. ESM 的 script 标签会延迟执行脚本，默认加上了 defer 属性
4. ESM 是通过 CORS 这种跨域请求的方式 去请求外部 JS 模块的

#### 3.1.1 import 规范

- 使用 import 关键字导入一个变量或者是一个类型：

```ts
// bar.ts
import { someVar, someType } from './foo';
```

- 通过重命名的方式导入变量或者类型：

```ts
// bar.ts
import { someVar as aDifferentName } from './foo';
```

- 除了指定加载某个输出值，还可以使用整体加载，即用星号（\*）指定一个对象，所有输出值都加载在这个对象上面：

```ts
// bar.ts
import * as foo from './foo';
// 你可以使用 `foo.someVar` 和 `foo.someType` 以及其他任何从 `foo` 导出的变量或者类型
```

#### 3.1.2 export 规范

- 使用 `export` 关键字导出一个变量或类型

```ts
// foo.ts
export const someVar = 123;
export type someType = {
  foo: string;
};
// or

type someType = {
  type: string;
};

export { someType };
```

- 你也可以用重命名变量的方式导出：

```ts
// foo.ts
const someVar = 123;
export { someVar as aDifferentName };
```

- 从其他模块导入后整体导出：

```ts
export * from './foo';
```

#### 3.1.3 node 中使用

在 Node 中使用 ESM 有两种方式：

1. 在 package.json 中，增加 "type": "module" 配置；
2. 在 .mjs 文件可以直接使用 import 和 export；

- ES Module 中可以导入 CommonJS 模块导出的成员

在 ES6 模块里可以很方便地使用 import 来引用一个 CommonJS 模块，因为在 ES6 模块里异步加载并非是必须的：

```ts
import { default as cjs } from 'cjs';

// The following import statement is "syntax sugar" (equivalent but sweeter)
// for `{ default as cjsSugar }` in the above import statement:
import cjsSugar from 'cjs';

console.log(cjs);
console.log(cjs === cjsSugar);
```

- CommonJS 中不能导入 ES Modules 所定义的导出成员 这里发生了语法错误异常的问题

由于 ES Modules 的加载、解析和执行都是异步的，而 `require()` 的过程是同步的、所以不能通过 `require()` 来引用一个 ES6 模块。

ES6 提议的 import() 函数将会返回一个 Promise，它在 ES Modules 加载后标记完成。借助于此，我们可以在 CommonJS 中使用异步的方式导入 ES Modules：

```ts
// 使用 then() 来进行模块导入后的操作
import(“es6-modules.mjs”).then((module)=>{/*…*/}).catch((err)=>{/**…*/})
// 或者使用 async 函数
(async () => {
  await import('./es6-modules.mjs');
})();
```

#### 3.1.4 与 Commonjs 规范的区别

`Commonjs`简言之，每个模块都有自己的函数包装器， Node 通过此种方式确保模块内的代码对它是私有的。

在包装器执行之前，模块内的导出内容是不确定的。除此之外，第一次加载的模块会被缓存到 Module.\_cache 中。

在 ESM 中，import 语句用于在解析代码时导入模块依赖的静态链接。文件的依赖关系在`编译阶段`就确定了。对于 ESM，模块的加载大致分为三步：

```java
Construction (解析) -> Instantiation (实例化、建立链接) -> Evaluation (执行)
```

这些步骤是异步执行的，每一步都可以看作是相互独立的。这一点跟 CommonJS 有很大不同，对于 CommonJS 来说，每一步都是同步进行的。
