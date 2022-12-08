---
order: 3
---

# Javascript

`ECMAScript3`要求 JavaScript 必须支持 Unicode2.1 及后续版本，ECMAScript5 则要求支持 Unicode3 及后续版本。所以，我们编写出来的 javascript 程序，都是使用`Unicode`编码的。

- Unicode 编码

英文或英文标点占 1 个字符，中文汉字或中文标点占 2 个字符，一个字符占 1 个字节。

- ASCII 码：

一个英文字母占一个字节的空间，一个中文汉字占两个字节的空间。

UTF-8 编码：

一个英文字符等于一个字节，一个中文（含繁体）等于三个字节。

## 1、数据类型

### 1.1 数据类型有哪些

JS 拥有以下数据类型：

7 种数据基本类型：`Undefined`、`Null`、`Boolean`、`Number`、`String`、`Symbol`、`BigInt`

3 种引用类型:`Object`、`Array`、`Function`

其他类型：`Set`、`WeakSet`、`Map`、`WeakMap`、`Date`、`RegExp`

为什么基本数据类型存在栈内存，引用数据类型存在堆内存?（变量存在于栈中）

- 基本数据类型比较稳当，相对来说占用的内存较小
- 引用数据类型是动态的，大小不固定，占用的内存较大，但内存地址大小是固定的，因此可以将内存地址保存在栈中（该指针变量）

对于 javascript 而言

- 栈内存(stack)：栈内存是当前函数作用域的内存，与当前执行上下文绑定
- 堆内存(heap)：堆内存是区别于栈区、代码区，是独立的另一个内存区域。

const 修饰的引用类型可以被修改，因为对象是引用类型的，P 中保存的仅是对象的指针，这就意味着，const 仅保证指针不发生改变，修改对象的属性不会改变对象的指针，所以是被允许的。也就是说 const 定义的引用类型只要指针不发生改变，其他的不论如何改变都是允许的。

- 怎么让 const 修饰的引用类型不可以被修改？

  - Object.freeze({})

```js
const obj = Object.freeze({});
obj.name = 'Jake';
console.log(obj.name); // undefined
```

**赋值**

基本类型赋值，系统会为新的变量在栈内存中分配一个新值，这个很好理解。引用类型赋值，系统会为新的变量在栈内存中分配一个值，这个值仅仅是指向同一个对象的引用，和原对象指向的都是堆内存中的同一个对象。

#### 1.1.1 浅拷贝

浅拷贝，指的是创建新的数据，这个数据有着原始数据属性值的一份精确拷贝

如果属性是基本类型，拷贝的就是基本类型的值。如果属性是引用类型，拷贝的就是内存地址

即浅拷贝是拷贝一层，深层次的引用类型则共享内存地址

```js
let oldobj = {
  age: 18,
  pet: {
    pet_name: 'Bai',
    pet_age: 3,
  },
};

let newobj = {};

for (let k in oldobj) {
  newobj[k] = oldobj[k];
}
newobj.pet.pet_name = 'Liu';

console.log(oldobj);
console.log(newobj);
//newobj与oldobj相同
```

可实现的方法有：`Array.from()`

#### 1.1.2 深拷贝

深拷贝是指**源对象与拷贝对象互相独立**，其中任何一个对象的改动都不会对另外一个对象造成影响。([手撕深拷贝](/interview/frontend-shred-code#31-手撕深拷贝))

#### 1.1.3 **Object 和 Map 的区别**

- 用法的区别：在某些情况下的用法会截然不同
- 句法的区别：创建以及增删查改的句法区别
- 性能的区别：速度和内存占用情况
- **Map 中的元素会 保持其插入时的顺序 ；而 Object 则不会完全保持插入时的顺序，而是根据如下规则进行排序:**
  - 非负整数 会最先被列出，排序是从小到大的数字顺序
  - 然后所有字符串，负整数，浮点数会被列出，顺序是根据插入的顺序
  - 最后才会列出 Symbol ， Symbol 也是根据插入的顺序

#### 1.1.4 **Map 和 WeapMap 的区别**

`WeakMap` 。它对于值的引用都是不计入垃圾回收机制的，所以名字里面才会有一个"Weak"，表示这是弱引用（对对象的弱引用是指当该对象应该被 GC 回收时不会阻止 GC 的回收行为）。

`Map` 相对于 `WeakMap` ：

- `Map` 的键可以是任意类型，`WeakMap` 只接受对象作为键（null 除外），不接受其他类型的值作为键
- `Map` 的键实际上是跟内存地址绑定的，只要内存地址不一样，就视为两个键； `WeakMap` 的键是弱引用，键所指向的对象可以被垃圾回收，此时键是无效的
- `Map` 可以被遍历， `WeakMap` 不能被遍历

### 1.2 判断数据类型

typeof 一般只能返回如下几个结果：`number`,`boolean`,`string`,`function`,`object`,`undefined`,`Symbol`,`BigInt`；

JavaScript 中的值是由一个表示类型的标签和实际数据值表示的。 对象的类型标签是 0。 由于 null 代表的是`空指针`（大多数平台下值为 0x00），因此， typeof null 也因此返回 "object" 。

```javascript
typeof [1, 2]; // "object"
typeof undefined; // "undefined"
typeof null; // "object"
typeof NaN; // 'number'
typeof Symbol(); // 'symbol'
typeof Array / BigInt / Object; // "function" 相当于构造函数
typeof BigInt(1) / Object() / Array(); // "BigInt"/object/object  相当于new了有一个实例对象
typeof new Set() / Map / Array(); //"object"
typeof (() => {}); // typeof 箭头函数返回也是 "function"
//typeof的返回值都是 string类型
typeof typeof undefined; // "string"
typeof console; // 'object'
typeof console.log; // 'function'
typeof arguments; // 'object'
```

[instanceof](/interview/frontend-shred-code#21-手撕-instanceof) 判断:（true or false）

`instanceof` 运算符用于检测构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上

```js
let car = new String('xxx');
car instanceof String; // true
let str = 'xxx';
str instanceof String; // false
let reg = new RegExp();
reg instanceof RegExp; // true
reg instanceof Object; // true new 操作符的过程
```

通用`Object.prototype.toString`判断：

```js
Object.prototype.toString({}); // "[object Object]"
Object.prototype.toString.call({}); // 同上结果，加上call也ok
Object.prototype.toString.call(1); // "[object Number]"
Object.prototype.toString.call('1'); // "[object String]"
Object.prototype.toString.call(true); // "[object Boolean]"
Object.prototype.toString.call(function () {}); // "[object Function]"
Object.prototype.toString.call(null); //"[object Null]"
Object.prototype.toString.call(undefined); //"[object Undefined]"
Object.prototype.toString.call(/123/g); //"[object RegExp]"
Object.prototype.toString.call(new Date()); //"[object Date]"
Object.prototype.toString.call([]); //"[object Array]"
Object.prototype.toString.call(document); //"[object HTMLDocument]"
Object.prototype.toString.call(window); //"[object Window]"
```

- 获得数据类型函数手撕：[数据类型手撕](/interview/frontend-shred-code#22-数据类型手撕)

### 1.3 数据类型转换机制

**在 JS 中只有 3 种类型的转换**

① 显式转换

- 转化为 Number 类型：`Number()` / `parseFloat()` / `parseInt()`
- 转化为 String 类型：`String()` / `toString()`
- 转化为 Boolean 类型: `Boolean()`

② 隐式转换

**分为两种，分别是 string、number。当 + 操作存在任意的操作数是 string 类型时，则转换为 string，否则则触发 number 类型的隐式转换**.

```js
let result = 100 + true + 21.2 + null + undefined + "Tencent" + [] + null + 9 + false;
// result应该是？

1.首先100 + true
+连接符两边存在Number类型，true转number为1，进行加法运算，结果为：101
2.101 + 21.2
+连接符两边均为Number类型，进行加法运算，结果为：122.2
3.122.2 + null
+连接符两边存在Number类型，null转number为0，进行加法运算，结果为：122.2
4.122.2 + undefined
+连接符两边存在Number类型，undefined转number为NaN，NaN与任何数据类型计算都为NaN，结果为：NaN
5.NaN + "Tencent"
+连接符两边存在String类型，NaN转string为"NaN"，进行字符串拼接，结果为："NaNTencent"
6."NaNTencent" + []
+连接符两边存在String类型，[]转string为""，进行字符串拼接，结果为："NaNTencent"
7."NaNTencent" + null
+连接符两边存在String类型，null转string为"null"，进行字符串拼接，结果为："NaNTencentnull"
8."NaNTencentnull" + 9
+连接符存在String类型，9转string为"9"，进行字符串拼接，结果为："NaNTencentnull9"
9."NaNTencentnull9" + false
+连接符存在String类型，false转string为"false"，进行字符串拼接，结果为："NaNTencentnull9false"
```

注：特殊转换如下

```js
String([1,2,3])    //"1,2,3"
String({})    //"[object Object]"
1 + {}     //"1[object Object]"
Number("")           //0
Number("10px")       //NaN
Number(null)         //0
Number(undefined)    //NaN
Number(Symbol())     //Uncaught TypeError: Cannot convert a Symbol value to a number
{}=={}      //false   因为比较的是地址
{} + [] === 0               // true
[] + {} === 0               // false，'[object Object]'
0 == null           //false
undefined == null      //true
```

### 1.4 包装类型

三种包装对象，他们对应的构造函数分别是 String，Number，Boolean

**当我们使用原始类型调用 toString 方法的时候，原始类型会先通过其包装对象对应的构造函数转换成对象，然后用这个对象调用方法**，调用方法之后，原始类型仍是原始类型，新创建的包装对象会被销毁。

### 1.5 对 JSON 的理解

JSON (JavaScript Object Notation, JS 对象标记) 是一种轻量级的数据交换格式。它基于 ECMAScript (w3c 制定的 js 规范)的一个子集，采用完全独立于编程语言的文本格式来存储和表示数据。简洁和清晰的层次结构使得 JSON 成为理想的数据交换语言。

### 1.6 arguments

`arguments`：arguments 是一个类似于数组的对象，对应于传递给函数的参数，他有 length 属性，arguments[ i ]来访问对象中的元素，但是它不能用数组的一些方法。例如 push、pop、slice 等。

arguments 本身并不能调用数组方法，它是一个另外一种对象类型，只不过属性从 0 开始排，依次为 0，1，2...最后还有 callee 和 length 属性，我们也把这样的对象称为类数组。因此调用数组方法需要转化成数组

```javascript
const args = Array.prototype.slice.call(arguments);

const args = [...arguments];
```

注：对参数使用 slice 会阻止某些 JavaScript 引擎中的优化 (比如 V8 - 更多信息)。如果你关心性能，尝试通过遍历 arguments 对象来构造一个新的数组。另一种方法是使用被忽视的 Array 构造函数作为一个函数：

arguments 还有一个叫做 callee 的属性，这个属性引用函数自身,可以方便使用递归。

#### 1.6.1 作用

JavaScript 里面的一个 arguments 对象。首先，ECMAScript 函数的参数与其他语言的函数参数有一点不同。ECMAScript 函数不介意传进来的参数个数和类型。

在 ECMAScript 中，函数的参数始终是存放在一个数组中，而通过 arguments 对象，就可以访问到这个数组。

- 可以确定调用函数时传递了多少个参数。

在函数代码中，使用特殊对象 arguments 可以访问函数的参数。即，开发者在定义函数时，无需明确的为方法声明参数，也可以在方法体中使用 arguments 来访问参数。

正因为 arguments 表示参数组成的数组，因此，首先可以使用 arguments.length 检测函数的参数个数，其次，可以通过下标（arguments[index]）来访问某个参数。这样，可以用 arguments 对象判断传递给函数的参数个数并获取参数，适用于函数参数无法确定个数的情况下。

## 2、use strict（严格模式）

它不是一条语句，但是是一个**字面量表达式**，在 JavaScript 旧版本中会被忽略。目的是指定代码在严格条件下执行。

"use strict" 指令只允许出现在脚本或函数的开头。

js 使用之后的区别：

- 不允许使用未声明的变量：
- 不允许删除变量、函数或对象。
- 不允许变量重名
- 不允许使用八进制、转义字符
- 变量名不能使用 "eval" 、 "arguments" 等命名

## 3、立即执行函数

声明一个函数，并马上调用这个匿名函数就叫做立即执行函数；也可以说立即执行函数是一种语法，让你的函数在定义以后立即执行。

### 3.1 用法

```javascript
(function () {})(); //前面的括号包含着一个匿名函数，后面的括号调用此函数
```

为了避免解析上的歧义，JS 引擎规定，如果 function 出现在行首，一律解析成语句。因此 JS 引擎看到行首是 function 关键字会认为这一段都是函数定义，不应该以原括号结尾，所以会报错。

立即执行函数，还有一些其他的写法（加一些小东西，不让解析成语句就可以）,比如下边：

```js
(function () {
  alert('我是匿名函数');
})()(
  //用括号把整个表达式包起来
  function () {
    alert('我是匿名函数');
  },
)(); //用括号把函数包起来
!(function () {
  alert('我是匿名函数');
})() + //求反，我们不在意值是多少，只想通过语法检查
  (function () {
    alert('我是匿名函数');
  })() -
  (function () {
    alert('我是匿名函数');
  })();
~(function () {
  alert('我是匿名函数');
})();
void (function () {
  alert('我是匿名函数');
})();
new (function () {
  alert('我是匿名函数');
})();
```

### 3.2 作用

1. 不必为函数命名，避免了污染全局变量
2. **立即执行函数内部形成了一个单独的作用域，可以封装一些外部无法读取的私有变量**
3. 封装变量,可以返回一个在全局中需要的变量（用 return）。

### 3.3 场景

- 你的代码在页面加载完成之后，不得不执行一些设置工作，比如时间处理器，创建对象等等。
- 所有的这些工作只需要执行一次，比如只需要显示一个时间。
- 但是这些代码也需要一些临时的变量，但是初始化过程结束之后，就再也不会被用到，如果将这些变量作为全局变量，不是一个好的注意，我们可以用立即执行函数——去将我们所有的代码包裹在它的局部作用域中，不会让任何变量泄露成全局变量，
- 在模块化之前采用此方式避免污染变量

---

```js
const obj = (function () {
  const o = {
    a: 1,
    set: (k, v) => {
      this.a = v;
      console.log('-------->', a);
    },
  };

  return {
    get(k) {
      return k ? o[k] : o;
    },
  };
})();

console.log(obj.get().set('a', 4));
console.log('1111', obj.get('a'));
```

## 4、性能优化函数

### 4.1 懒加载

① 首先判断该结点是否在可视区 ② 利用 scroll 函数进行在可视区的滚动加载

判断一个元素是否在可视区域，可用`offsetTop`和`scrollTop`

[手撕懒加载](/interview/frontend-shred-code#32-懒加载)

webpack 实现：

```ts
import(/* webpackChunkName: "momentjs" */ 'moment')
  .then((moment) => {
    // 懒加载的模块拥有所有的类型，并且能够按期工作
    // 类型检查会工作，代码引用也会工作  :100:
    const time = moment().format();
    console.log('TypeScript >= 2.4.0 Dynamic Import Expression:');
    console.log(time);
  })
  .catch((err) => {
    console.log('Failed to load moment', err);
  });
```

### 4.2 防抖

n 秒后在执行该事件，若在 n 秒内被重复触发，则重新计时.

[手撕防抖](interview/frontend-shred-code#33-手撕防抖)

### 4.3 节流

n 秒内只运行一次，若在 n 秒内重复触发，只有一次生效

[手撕节流](/interview/frontend-shred-code#34-手撕节流)

### 4.4 预加载

前端预加载，即提前加载后续需要的内容 (`preload and prefetch`)、提前解析域名（`DNS Pretech & Preconnect`）、预先渲染要加载的页面(`prerender`)，这样在后续实际需要加载对应的内容时，有更快的加载速度。举个例子，在抖音 Web 端、阿里云控制台页面等，都能看到很多 rel 属性为 dns-prefetch 的 link 标签。

#### 4.4.1 图片预加载

通常，图片在被创建时才会被加载。所以，当我们向页面中添加 `<img>` 时，用户不会立即看到图片。浏览器首先需要加载它。

浏览器开始加载图片，并将其保存到缓存中。以后，当相同图片出现在文档中时（无论怎样），它都会立即显示。

创建一个函数 preloadImages(sources, callback)，来加载来自数组 source 的所有图片，并在准备就绪时运行 callback。

```ts
function preloadImages(sources, callback) {
  /* your code */
  alert('resource loaded done');
}

let sources = [
  'https://en.js.cx/images-load/1.jpg',
  'https://en.js.cx/images-load/2.jpg',
  'https://en.js.cx/images-load/3.jpg',
];
for (let i = 0; i < sources.length; i++) {
  sources[i] += '?' + Math.random(); // add random characters to prevent browser caching
}
function testLoaded() {
  let widthSum = 0;
  for (let i = 0; i < sources.length; i++) {
    let img = document.createElement('img');
    img.src = sources[i];
    widthSum += img.width;
  }
}
preloadImages(sources, testLoaded);
```

## 5、this 关键字

1. 在方法中，this 表示该方法所属的对象。
2. 如果单独使用，this 表示全局对象。
3. 在函数中，this 表示全局对象。
4. 在函数中，在严格模式下，this 是未定义的(undefined)。
5. 在事件中，this 表示接收事件的元素。
6. 类似 call() 和 apply() 方法可以将 this 引用到任何对象。

### 5.1 apply call bind

`apply`、`call`、`bind`三者的区别在于：

- 三者都可以改变函数的`this`对象指向
- 三者第一个参数都是`this`要指向的对象，如果如果没有这个参数或参数为`undefined`或`null`，则默认指向全局`window`
- 三者都可以传参，但是`apply`是数组，而`call`和`bind`是参数列表，且`apply`和`call`是一次性传入参数，而`bind`可以分为多次传入
- `bind`是返回绑定 this 之后的函数，`apply`、`call` 则是立即执行

#### 手撕 apply

```js
Funciton.prototype.myApply = function (thisArg, args) {
  let fnName = symbol();
  if (!thisarg) {
    thisArg = typeof window === 'undefined' ? globle : windown;
  }
  thisArg[fnName] = this;
  const result = thisArg[fnName](...args);
  delete thisArg[fnName];
  return result;
};
```

#### 手撕 call

```js
Function.prototype.myCall = function (thisarg, ...args) {
  let fnName = Symbol();
  if (!thisArg) {
    //context 为 null 或者是 undefined,typeof windown -> object
    thisArg = typeof window === 'undefined' ? global : window;
  }
  thisarg[fnName] = this; //this指向被调用的函数fn
  const result = thisarg[fnName](...args);
  delete thisarg[fnName];
  return result;
};

function fn() {
  //此时this指向了thisarg
}

let result = fn.myCall(thisarg, '1', '2'); //第一个参数用this代替，其余参数作为验证可以传参

console.log(result);
//我是返回值
```

#### 手撕自定义 bind

```js
Function.prototype.mybind = function (context, ...bindArgs) {
  const self = this;
  return function (...Args) {
    const finalArgs = bindArgs.concat(Args);
    return self.apply(context, finalArgs);
  };
};
```

### 5.2 self 关键字

这个非常简单。我们知道，打开任何一个网页，浏览器会首先创建一个窗口，这个窗口就是一个 window 对象，也是 js 运行所依附的全局环境对象和全局作用域对象。self 指窗口本身，它返回的对象跟 window 对象是一模一样的。也正因为如此，window 对象的常用方法和函数都可以用 self 代替 window。

举个例子，常见的写法如“self.alert('弹窗');”，把它放在`<a>`标记中：`<a href="javascript:self.alert('弹窗');">点击弹窗</a>`，单击“点击弹窗”链接，当前页面弹窗。

```tsx
import React from 'react';
import { Modal } from 'interview';

export default () => (
  <Modal
    title="self.close"
    component={<a href="javascript:self.alert('弹窗');">点击弹窗</a>}
  ></Modal>
);
```

## 6、原型链

### 6.1 new 操作符

在 JavaScript 中，new 操作符用于创建一个给定构造函数的实例对象

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
}
Person.prototype.sayName = function () {
  console.log(this.name);
};
const person1 = new Person('Tom', 20);
console.log(person1); // Person {name: "Tom", age: 20}
t.sayName(); // 'Tom'
```

从上面可以看到：

- `new` 通过构造函数 Person 创建出来的实例可以访问到构造函数中的属性
- `new` 通过构造函数 Person 创建出来的实例可以访问到构造函数`原型链`中的属性（即实例与构造函数通过原型链连接了起来）

new 具体干了什么：

1. 在内存中创建一个新对象。
2. 这个新对象内部的[[Prototype]]特性被赋值为构造函数的 prototype 属性。
3. 构造函数内部的 this 被赋值为这个新对象（即 this 指向新对象）。
4. 执行构造函数内部的代码（给新对象添加属性）。
5. 如果构造函数返回对象，则返回该对象；否则，返回刚创建的新对象(空对象)。

因此也就解释了 `typeof new xxx()` 始终为 object, `xxx instance Object`也始终为 true。

```js
function Person() {
  this.age = 18;
}
Person.prototype;
/**
{
    constructor: ƒ Foo()
    __proto__: Object
}
**/
```

普通函数创建时，引擎会按照特定的规则为这个函数创建一个 prototype 属性（指向原型对象）。默认情况下，所有原型对象自动获得一个名为 `constructor` 的属性，指回与之关联的构造函数。

创建箭头函数时，引擎不会为其创建 `prototype` 属性，箭头函数没有 constructor 供 new 调用，因此使用 new 调用[箭头函数](/big-frontend/前端/ecmascprit#21-箭头函数)会报错！

[手撕 new 操作符](/interview/frontend-shred-code#23-手撕-new-操作符)

### 6.2 prototype 与 \_\_proto\_\_

\_\_proto\_\_指向创建这个对象的函数(constructor)的 prototype

每一个函数在创建之后都会拥有一个名为 prototype 的属性，这个属性指向函数的原型对象。

> warning：通过 Function.prototype.bind 方法构造出来的函数是个例外，它没有 prototype 属性。（感谢

#### 6.2.1 prototype（显式原型）

函数对象的 prototype 属性是外部共享的，而\_\_proto\_\_是隐式的

只有函数对象才有 prototype 属性

protoype 对象默认有两个属性：constructor 和 proto

#### 6.2.2 \_\_proto\_\_（隐式原型）

JavaScript 中任意对象都有一个内置属性[prototype]，在 ES5 之前没有标准的方法访问这个内置属性，但是大多数浏览器都支持通过\_\_proto\_\_来访问。ES5 中有了对于这个内置属性标准的 Get 方法 `Object.getPrototypeOf()`.

\_\_proto\_\_是 es6 加入的内部属性，不是正式对外的 api

实例对象的\_\_proto\_\_指向的是函数的 protoype

`隐式原型的作用`：构成原型链，同样用于实现基于原型的继承。举个例子，当我们访问 obj 这个对象中的 x 属性时，如果在 obj 中找不到，那么就会沿着\_\_proto\_\_依次查找。

> warning: Object.prototype 这个对象是个例外，它的\_\_proto\_\_值为 null.即 Object.prototype 的\_\_proto\_\_属性指向 null。

## 7、闭包

- 内层函数中访问到其外层函数的作用域

### 7.1 柯里化（curry）

当传入的参数数不足所需要的参数数时，返回一个可以传入剩余参数的高阶函数

```js
let add = function (a, b, c) {
  return a + b + c;
};

function curry(fn, ...items) {
  if (fn.length == items.length) {
    let res = fn(...items);
    return res;
  }
  return (...rests) => {
    return curry(fn, ...items, ...rests); //递归添加参数
  };
}

let addCurry = curry(add);
console.log(
  addCurry(1)(2, 4), //7
  addCurry(9)(10)(10), //29
);
```

### 7.2 函数组合（compose）

组合函数，目的是将多个函数组合成一个函数

```js
function compose(...args: any[]) {
  return (subArgs: any) => {
    return args.reverse().reduce((acc, func, index) => {
      return func(acc);
    }, subArgs);
  };
}
```

### 7.3 函数管道（pipe）

`compose`执行是从右到左的。而管道函数，执行顺序是从左到右执行的

```js
function pipe(args: any[]) {
  return (subArgs) => {
    return args.reduce((acc, func, index) => {
      return func(acc);
    }, subArgs);
  };
}
```

## 8、ajax、axios、fetch 的区别

## 9、sourcemap

jQuery 1.9 发布。有很多新功能，其中一个就是支持 Source Map 打开压缩后的版本，滚动到底部，你可以看到`最后一行`是这样的：

```js
//@ sourceMappingURL=jquery.min.map
```

这就是 Source Map。它是一个独立的 map 文件，与源码在同一个目录下，你可以点击进去，看看它的样子。

这是一个很有用的功能，以下将详细讲解这个功能。

JavaScript 脚本正变得越来越复杂。大部分`源码（尤其是各种函数库和框架）`都要经过转换，才能投入生产环境。

常见的源码转换，主要是以下三种情况：

1. 压缩，减小体积。比如 jQuery 1.9 的源码，压缩前是 252KB，压缩后是 32KB。

2. 多个文件合并，减少 HTTP 请求数。

3. 其他语言编译成 JavaScript。最常见的例子就是 CoffeeScript。

这三种情况，都使得实际运行的代码不同于开发代码，除错（debug）变得困难重重。

通常，JavaScript 的解释器会告诉你，第几行第几列代码出错。但是，这对于转换后的代码毫无用处。举例来说，jQuery 1.9 压缩后只有 3 行，每行 3 万个字符，所有内部变量都改了名字。你看着报错信息，感到毫无头绪，根本不知道它所对应的原始位置。

这就是 Source map 想要解决的问题。

### 9.1 什么是 Source map

简单说，Source map 就是一个信息文件，里面储存着位置信息。也就是说，转换后的代码的每一个位置，所对应的转换前的位置。

有了它，出错的时候，除错工具将直接显示原始代码，而不是转换后的代码。这无疑给开发者带来了很大方便。

目前，暂时只有 Chrome 浏览器支持这个功能。在 Developer Tools 的 Setting 设置中，确认选中"Enable source maps"。

- 如何启用 Source map

正如前文所提到的，只要在转换后的代码尾部，加上一行就可以了。

```js
//@ sourceMappingURL=/path/to/file.js.map
```

map 文件可以放在网络上，也可以放在本地文件系统。

### 9.2 Source map 的属性

打开 Source map 文件，整个文件就是一个 JavaScript 对象，可以被解释器读取。它大概是这个样子：

```js
　　{
　　　　version : 3, //Source map的版本，目前为3
　　　　file: "out.js", //转换后的文件名
　　　　sourceRoot : "",  //转换前的文件所在的目录。如果与转换前的文件在同一目录，该项为空
　　　　sources: ["foo.js", "bar.js"],  //转换前的文件。该项是一个数组，表示可能存在多个文件合并
　　　　names: ["src", "maps", "are", "fun"], //转换前的所有变量名和属性名
　　　　mappings: "AAgBC,SAAQ,CAAEA"  //记录位置信息的字符串，下文详细介绍。
　　}
```

- mappings 属性

两个文件的各个位置是如何一一对应的?

关键就是 map 文件的`mappings`属性。这是一个很长的字符串，它分成三层。

1. 第一层是行对应，以分号（;）表示，每个分号对应转换后源码的一行。所以，第一个分号前的内容，就对应源码的第一行，以此类推。

2. 第二层是位置对应，以逗号（,）表示，每个逗号对应转换后源码的一个位置。所以，第一个逗号前的内容，就对应该行源码的第一个位置，以此类推。

3. 第三层是位置转换，以 VLQ 编码表示，代表该位置对应的转换前的源码位置。

## 10、AMD 规范

AMD 是"Asynchronous Module Definition"的缩写，意思就是"`异步模块定义`"。它采用异步方式加载模块，模块的加载不影响它后面语句的运行。所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会运行。

有了服务器端模块[Commonjs](/big-frontend/后端/node#1commonjs-规范)以后，很自然地，大家就想要客户端模块。而且最好两者能够兼容，一个模块不用修改，在服务器和浏览器都可以运行。

但是，有一个重大的局限，使得 CommonJS 规范不适用于浏览器环境，那就是 CommonJS 规范是同步的

```js
var math = require('math');
math.add(2, 3);
```

第二行 math.add(2, 3)，在第一行 require('math')之后运行，因此必须等 math.js 加载完成。也就是说，如果加载时间很长，整个应用就会停在那里等。

这对服务器端不是一个问题，因为所有的模块都存放在本地硬盘，可以同步加载完成，等待时间就是硬盘的读取时间。但是，对于浏览器，这却是一个大问题，因为模块都放在服务器端，等待时间取决于网速的快慢，可能要等很长时间，浏览器处于"假死"状态。

因此，浏览器端的模块，不能采用"同步加载"（synchronous），只能采用"异步加载"（asynchronous）。这就是 AMD 规范诞生的背景。

AMD 也采用`require()`语句加载模块，但是不同于 CommonJS，它要求两个参数：

```js
require([module], callback);
```

第一个参数[module]，是一个数组，里面的成员就是要加载的模块；第二个参数 callback，则是加载成功之后的回调函数。如果将前面的代码改写成 AMD 形式，就是下面这样：

```js
require(['math'], function (math) {
  math.add(2, 3);
});
```

math.add()与 math 模块加载不是同步的，浏览器不会发生假死。所以很显然，AMD 比较适合浏览器环境。

目前，主要有两个 Javascript 库实现了 AMD 规范：`require.js`和 `curl.js`。

## 11、UMD 规范

所谓 UMD (Universal Module Definition)，就是一种 javascript 通用模块定义规范，让你的模块能在 javascript` 所有运行环境中发挥作用`。

实现一个 UMD 模块，就要考虑现有的主流 javascript 模块规范了，如 CommonJS, AMD, CMD 等。那么如何才能同时满足这几种规范呢？

首先要想到，模块最终是要导出一个对象，函数，或者变量。而不同的模块规范，关于模块导出这部分的定义是完全不一样的。因此，我们需要一种过渡机制。

### 11.1 实现 UMD

首先，我们需要一个 factory，也就是工厂函数，它只负责返回你需要导出的内容（对象，函数，变量等）。

我们把 factory 写成一个匿名函数，利用 IIFE（立即执行函数）去执行工厂函数，返回的对象赋值给 root.umdModule，这里的 root 就是指向全局对象 this，其值可能是 window 或者 global，视运行环境而定。

```js
(function (root, factory) {
  console.log('没有模块环境，直接挂载在全局对象上');
  root.umdModule = factory();
})(this, function () {
  return {
    name: '我是一个umd模块',
  };
});
```

再进一步，兼容 AMD 规范

要兼容 AMD 也简单，判断一下环境，是否满足 AMD 规范。如果满足，则使用 require.js 提供的 define 函数定义模块。

```js
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // 如果环境中有define函数，并且define函数具备amd属性，则可以判断当前环境满足AMD规范
    console.log('是AMD模块规范，如require.js');
    define(factory);
  } else {
    console.log('没有模块环境，直接挂载在全局对象上');
    root.umdModule = factory();
  }
})(this, function () {
  return {
    name: '我是一个umd模块',
  };
});
```

可以看到，原则是调用者先加载，所依赖的模块后加载。
