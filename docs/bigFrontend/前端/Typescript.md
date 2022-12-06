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

`lib` 分类如下：

- JavaScript 功能
  - es5
  - es6
  - es2015
  - es7
  - es2016
  - es2017
  - esnext
- 运行环境
  - dom
  - dom.iterable
  - webworker
  - scripthost
- ESNext 功能选项
  - es2015.core
  - es2015.collection
  - es2015.generator
  - es2015.iterable
  - es2015.promise
  - es2015.proxy
  - es2015.reflect
  - es2015.symbol
  - es2015.symbol.wellknown
  - es2016.array.include
  - es2017.object
  - es2017.sharedmemory
  - esnext.asynciterable

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

### 1.2 lib.d.ts

当你安装 TypeScript 时，会顺带安装一个 lib.d.ts 声明文件。这个文件包含 JavaScript 运行时以及 DOM 中存在各种常见的环境声明。

- 它自动包含在 TypeScript 项目的编译上下文中；
- 它能让你快速开始书写经过类型检查的 JavaScript 代码。

你可以通过指定 --noLib 的编译器命令行标志（或者在 tsconfig.json 中指定选项 noLib: true）从上下文中排除此文件。

> 看如下例子：

```ts
const foo = 123;
const bar = foo.toString();
```

这段代码的类型检查正常，因为 lib.d.ts 为所有 `JavaScript 对象`定义了 toString 方法。

如果你在 noLib 选项下，使用相同的代码，这将会出现类型检查错误：

```ts
const foo = 123;
const bar = foo.toString(); // Error: 属性 toString 不存在类型 number 上
```

> 使用你自己定义的 lib.d.ts

正如上文所说，使用 --noLib 编译选项会导致 TypeScript 排除自动包含的 lib.d.ts 文件。为什么这个功能是有效的，我例举了一些常见原因：

运行的 JavaScript 环境与基于标准浏览器运行时环境有很大不同；你希望在代码里严格的控制全局变量，例如：lib.d.ts 将 item 定义为全局变量，你不希望它泄漏到你的代码里。一旦你排除了默认的 lib.d.ts 文件，你就可以在编译上下文中包含一个命名相似的文件，TypeScript 将提取该文件进行类型检查。

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

## 四、注解

- TypeScript 的类型系统被设计为可选的，因此，你的 JavaScript 就是 TypeScript;
- TypeScript 不会阻止 JavaScript 的运行，即使存在类型错误也不例外，这能让你的 JavaScript 逐步迁移至 TypeScript。
- 如果你需要使用类型注解的层次结构，请使用接口。它能使用 implements 和 extends

### 4.1 基本注解

如前文所提及，类型注解使用 `:TypeAnnotation` 语法。在类型声明空间中可用的任何内容都可以用作类型注解。

- null 和 undefined

在类型系统中，JavaScript 中的 `null` 和 `undefined` 字面量和标注了 any 类型的变量一样，都能被赋值给`任意类型`的变量

```ts
let power: any;
let num: number;
let str: string;
let bool: boolean;
let boolArray: boolean[];
function identity(num: number): number {
  return num;
}
const identify: number | void = (num: number | null | undefined) => num;
// 函数可选参数
const foo: number = (num: number, type?: string) => num;
```

### 4.2 泛型

许多算法和数据结构并不会依赖于对象的实际类型。但是，你仍然会想在每个变量里强制提供约束。例如：在一个函数中，它接受一个列表，并且返回这个列表的反向排序，这里的约束是指传入至函数的参数与函数的返回值

```ts
function reverse<T>(items: T[]): T[] {
  const toreturn = [];
  for (let i = items.length - 1; i >= 0; i--) {
    toreturn.push(items[i]);
  }
  return toreturn;
}

const sample = [1, 2, 3];
let reversed = reverse(sample); //reversed 获得类型安全

console.log(reversed); // 3, 2, 1

// Safety
reversed[0] = '1'; // Error
reversed = ['1', '2']; // Error

reversed[0] = 1; // ok
reversed = [1, 2]; // ok
```

事实上，JavaScript 数组已经拥有了 reverse 的方法，TypeScript 也确实使用了泛型来定义其结构：

```ts
interface Array<T> {
  reverse(): T[];
}
```

如上述例子，调用 reverse 方法后，reversed 数组将会获得 `number[]`的类型，因此再次赋值`string[]`会 Type Error。

这意味着，当你在数组上调用 reverse 方法时，将会获得类型安全。

> 误用泛型：

我见过开发者使用泛型仅仅是为了它的 hack。当你使用它时，你应该问问自己：**你想用它来提供什么样的约束。如果你不能很好的回答它，你可能会误用泛型**，如：

```ts
declare function foo<T>(arg: T): void;
//在这里，泛型完全没有必要使用，因为它仅用于单个参数的位置，使用如下方式可能更好：

declare function foo(arg: any): void;
```

#### 4.2.1 联合类型

在 JavaScript 中，你可能希望属性为多种类型之一，如字符串或者数组。这正是 TypeScript 中联合类型能派上用场的地方（它使用 | 作为标记，如 string | number）。

#### 4.2.2 交叉类型

在 JavaScript 中， extend 是一种非常常见的模式，在这种模式中，**你可以从两个对象中创建一个新对象，新对象拥有着两个对象所有的功能**。交叉类型可以让你安全的使用此种模式：

```ts
function extend<T extends object, U extends object>(first: T, second: U): T & U {
  const result = <T & U>{};
  for (let id in first) {
    (<T>result)[id] = first[id];
  }
  for (let id in second) {
    if (!result.hasOwnProperty(id)) {
      (<U>result)[id] = second[id];
    }
  }

  return result;
}

const x = extend({ a: 'hello' }, { b: 42 });

// 现在 x 拥有了 a 属性与 b 属性
const a = x.a;
const b = x.b;
```

#### 4.2.3 元组类型

JavaScript 并不支持元组，开发者们通常只能使用数组来表示元组。而 TypeScript 支持它，开发者可以使用 :[typeofmember1, typeofmember2] 的形式，为元组添加类型注解，元组可以包含任意数量的成员，示例：

```ts
let nameNumber: [string, number];
nameNumber = ['Jenny', 221345]; // Ok
nameNumber = ['Jenny', '221345']; // Error

// 将其与 TypeScript 中的解构一起使用：
let nameNumber: [string, number];
nameNumber = ['Jenny', 322134];
const [name, num] = nameNumber;
```

### 4.3 Required, Partial, Readonly, Pick

#### Required

将类型属性都变成必填。

```ts
type Coord = Required<{ x: number; y?: number }>;

// 等同于
type Coord = {
  x: number;
  y: number;
};
```

#### Partial

将类型定义的所有属性都修改为可选。

```ts
type Coord = Partial<Record<'x' | 'y', number>>;

// 等同于
type Coord = {
  x?: number;
  y?: number;
};
```

#### Readonly

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

与 const 的不同：

`const`

- 用于变量；
- 变量不能重新赋值给其他任何事物。

`readonly`

- 用于属性；
- 用于别名，可以修改属性；

#### Pick

从类型定义的属性中，选取指定一组属性，返回一个新的类型定义。

```ts
type Coord = Record<'x' | 'y', number>;
type CoordX = Pick<Coord, 'x'>;

// 等用于
type CoordX = {
  x: number;
};
```

### 4.4 类型断言

TypeScript 允许你覆盖它的推断，并且能以你任何你想要的方式分析它，这种机制被称为「类型断言」。

类型断言用来告诉编译器你比它更了解这个类型，并且它不应该再发出错误。

foo 的类型推断为 {}，即没有属性的对象。因此，你不能在它的属性上添加 bar 或 bas，你可以通过类型断言来避免此问题：

```ts
interface Foo {
  bar: number;
  bas: string;
}

const foo = {} as Foo; // 为了防止Error: 'bar' 属性不存在于 ‘{}’
foo.bar = 123;
foo.bas = 'hello';
```

- 双重断言

下例子中的代码将会报错，尽管使用者已经使用了类型断言：

```ts
function handler(event: Event) {
  const element = event as HTMLElement; // Error: 'Event' 和 'HTMLElement' 中的任何一个都不能赋值给另外一个
}
```

如果你仍然想使用那个类型，你可以使用双重断言。首先断言成兼容所有类型的 any，编译器将不会报错：

```ts
function handler(event: Event) {
  const element = event as any as HTMLElement; // ok
}
```

## 五、环境声明

> interface，enum，type 的区别

Interface: 使用`Interface`来定义对象的类型.在面向对象语言中，接口（Interfaces）是一个很重要的概念，它是对行为的抽象，而具体如何行动需要由类（classes）去实现（implement）。

Type:类型别名用来给一个类型起个新名字。或者字符串字面量类型用来约束取值只能是某几个字符串中的一个。所以`type`常用于`联合类型`。

Enum:枚举（Enum）类型用于取值被限定在一定范围内的场景。枚举成员会被赋值为从 0 开始递增的数字，同时也会对枚举值到枚举名进行反向映射。

### 5.1 declare

你可以通过 declare 关键字来告诉 TypeScript，你正在试图表述一个其他地方已经存在的代码，如：写在 JavaScript、CoffeeScript 或者是像浏览器和 Node.js 运行环境里的代码：

当你想告诉 TypeScript 编辑器关于 process 变量时，你可以这么做：

```ts
interface Process {
  exit(code?: number): void;
}

declare let process: Process;
```

你并不需要为 process 做这些，因为这已经存在于社区维护的 node.d.ts

这允许你使用 process，并能成功通过 TypeScript 的编译：

```ts
process.exit();
```

### 5.2 interface

类可以实现接口,如果你希望在类中使用必须要被遵循的接口（类）或别人定义的对象结构，可以使用 `implements` 关键字来确保其兼容性：

基本上，在 implements（实现） 存在的情况下，该外部 Point 接口的任何更改都将导致代码库中的编译错误，因此可以轻松地使其保持同步：

```ts
interface Point {
  x: number;
  y: number;
  z: number; // New member
}

class MyPoint implements Point {
  x = 1;
  y = 2;
  // ERROR : missing member `z`
}
```

- 可实例化可实例化仅仅是可调用的一种特殊情况，它使用 `new` 作为前缀。它意味着你需要使用 new 关键字去调用它：

```ts
interface CallMeWithNewToGetString {
  new (): string;
}

// 使用
declare const Foo: CallMeWithNewToGetString;
const bar = new Foo(); // bar 被推断为 string 类型
```

### 5.3 enum

枚举是组织收集有关联变量的一种方式。

#### 5.3.1 数字类型枚举与数字类型

默认不赋值的情况下，数字类型枚举，允许我们将数字类型或者其他任何与数字类型兼容的类型赋值给枚举类型的实例。

```ts
enum Color {
  Red,
  Green,
  Blue,
}

let col = Color.Red; // 将会被编译成 col = 0
col = 0; // 有效的，这也是 Color.Red
```

#### 5.3.2 字符串枚举

在上文中，我们只看到了数字类型的枚举，实际上，枚举类型的值，同时也可以是字符串类型。

```ts
export enum EvidenceTypeEnum {
  UNKNOWN = '',
  PASSPORT_VISA,
  PASSPORT = 'passport',
  SIGHTED_STUDENT_CARD = 'sighted_tertiary_edu_id',
  SIGHTED_KEYPASS_CARD = 'sighted_keypass_card',
  SIGHTED_PROOF_OF_AGE_CARD = 'sighted_proof_of_age_card',
}
```

这些可以更容易被处理和调试，因为它们提供有意义/可调试的字符串。

### 5.4 type

type 可以声明基本类型别名，联合类型，元组等类型

```ts
// 基本类型别名
type Name = string;
let name: Name = 'Lucy';
```

#### 函数重载

TypeScript 允许你声明函数重载。这对于文档 + 类型安全来说很实用。

```ts
// 联合类型
interface Dog {
  wong();
}
interface Cat {
  miao();
}

type Pet = Dog | Cat;

// 具体定义数组每个位置的类型
type PetList = [Dog, Pet];
```

## 六、异常处理

JavaScript 有一个 Error 类，用于处理异常。你可以通过 throw 关键字来抛出一个错误。然后通过 try/catch 块来捕获此错误：

```ts
try {
  throw new Error('Something bad happened');
} catch (e) {
  console.log(e);
}
```

JavaScript 初学者可能有时候仅仅是抛出一个原始字符串：

`不要这么做`，使用 Error 对象的基本好处是，它能自动跟踪堆栈的属性构建以及生成位置。

原始字符串会导致极差的调试体验，并且在分析日志时，将会变得错综复杂。

### 6.1 Never

never 类型是 TypeScript 中的底层类型。它自然被分配的一些例子：

- 一个从来不会有返回值的函数（如：如果函数内含有 while(true) {}）；
- 一个总是会抛出错误的函数（如：function foo() { throw new Error('Not Implemented') }，foo 的返回类型是 never）；

```ts
let foo: never = 123; // Error: number 类型不能赋值给 never 类型

// ok, 作为函数返回类型的 never
let bar: never = (() => {
  throw new Error('Throw my hands in the air like I just dont care');
})();
```

> 与 void 的差异

void 表示没有任何类型，never 表示永远不存在的值的类型。

当一个函数返回空值时，它的返回值为 `void 类型`，但是，当一个函数永不返回时（或者总是抛出错误），它的返回值为 `never 类型`。void 类型可以被赋值（在 strictNullChecking 为 false 时），但是除了 never 本身以外，其他任何类型不能赋值给 never。

### 6.2 错误子类型

除内置的 Error 类外，还有一些额外的内置错误，它们继承自 Error 类：

#### RangeError

当数字类型变量或者参数超出其有效范围时，出现 RangeError 的错误提示：

```ts
// 使用过多参数调用 console
console.log.apply(console, new Array(1000000000)); // RangeError: 数组长度无效
```

#### ReferenceError

当引用无效时，会出现 ReferenceError 的错误提示：

```ts
'use strict';
console.log(notValidVar); // ReferenceError: notValidVar 未定义
```

#### SyntaxError

当解析无效 JavaScript 代码时，会出现 SyntaxError 的错误提示：

```ts
1 *** 3   // SyntaxError: 无效的标记 *
```

#### TypeError

变量或者参数不是有效类型时，会出现 TypeError 的错误提示：

```ts
'1.2'.toPrecision(1); // TypeError: '1.2'.toPrecision 不是函数。
```

#### URIError

当传入无效参数至 `encodeURI()` 和 `decodeURI()` 时，会出现 URIError 的错误提示：

```ts
decodeURI('%'); // URIError: URL 异常
```

## 七、 React tsx

## 八、 源码分析
