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

## 一、数据类型

### 1.1 数据类型类别

JS 拥有以下数据类型：

7 种数据基本类型：`Undefined`、`Null`、`Boolean`、`Number`、`String`、`Symbol`、`BigInt`

3 种引用类型:`Object`、`Array`、`Function`

其他类型：`Set`、`WeakSet`、`Map`、`WeakMap`、`Date`、`RegExp`

[Set、Map](/big-frontend/前端/ecmascprit#八set-和-map-数据结构)

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

#### 1.1.3 Object 和 Map 的区别

- 用法的区别：在某些情况下的用法会截然不同
- 句法的区别：创建以及增删查改的句法区别
- 性能的区别：速度和内存占用情况(Object 性能方面会更为高效)
- Map 中的元素会 保持其插入时的顺序 ；而 Object 则不会完全保持插入时的顺序，而是根据如下规则进行排序:
  - 非负整数 会最先被列出，排序是从小到大的数字顺序
  - 然后所有字符串，负整数，浮点数会被列出，顺序是根据插入的顺序
  - 最后才会列出 Symbol ， Symbol 也是根据插入的顺序

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

#### 1.5.1 JSON.stringify

1. 能够讲数据转为字符串
2. 能够将字符串 parse 后创建新对象（新地址），即简单实现深拷贝

```js
let temp = JSON.parse(JSON.stringify(OBJ));
```

缺点：

1. `性能差`,根据网上的数据大概比遍历慢几倍.

2. 无法实现对函数 、RegExp 等特殊对象的克隆

```js
let temp = JSON.parse(JSON.stringify( fun: function name(params) {})); // {}
let temp = JSON.parse(JSON.stringify({ name: /abc/ })); // {}
```

3. 会抛弃对象的 constructor,所有的构造函数会指向 Object

4. 对象有循环引用,会报错

5. 如果被拷贝的对象中某个属性的值为 undefined 或含有 symbol 属性名，则拷贝之后该属性会丢失

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

## 二、基础务实

### 2.1 use strict（严格模式）

它不是一条语句，但是是一个**字面量表达式**，在 JavaScript 旧版本中会被忽略。目的是指定代码在严格条件下执行。

"use strict" 指令只允许出现在脚本或函数的开头。

js 使用之后的区别：

- 不允许使用未声明的变量：
- 不允许删除变量、函数或对象。
- 不允许变量重名
- 不允许使用八进制、转义字符
- 变量名不能使用 "eval" 、 "arguments" 等命名

### 2.2 立即执行函数

声明一个函数，并马上调用这个匿名函数就叫做立即执行函数；也可以说立即执行函数是一种语法，让你的函数在定义以后立即执行。

#### 2.2.1 用法

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

#### 2.2.2 作用

1. 不必为函数命名，避免了污染全局变量
2. **立即执行函数内部形成了一个单独的作用域，可以封装一些外部无法读取的私有变量**
3. 封装变量,可以返回一个在全局中需要的变量（用 return）。

#### 2.2.3 场景

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

### 2.3 this 关键字

1. 在方法中，this 表示该方法所属的对象。
2. 如果单独使用，this 表示全局对象。
3. 在函数中，this 表示全局对象。
4. 在函数中，在严格模式下，this 是未定义的(undefined)。
5. 在事件中，this 表示接收事件的元素。
6. 类似 call() 和 apply() 方法可以将 this 引用到任何对象。

### 2.4 self 关键字

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

### 2.5 apply call bind

`apply`、`call`、`bind`三者的区别在于：

- 三者都可以改变函数的`this`对象指向
- 三者第一个参数都是`this`要指向的对象，如果如果没有这个参数或参数为`undefined`或`null`，则默认指向全局`window`
- 三者都可以传参，但是`apply`是数组，而`call`和`bind`是参数列表，且`apply`和`call`是一次性传入参数，而`bind`可以分为多次传入
- `bind`是返回绑定 this 之后的函数，`apply`、`call` 则是立即执行

手撕:

- [手撕 apply](/interview/frontend-shred-code#24-手撕-apply)
- [手撕 call](/interview/frontend-shred-code#25-手撕-call)
- [手撕 bind](/interview/frontend-shred-code#26-手撕-bind)

### 2.6 time & timeEnd

`console.time`和`console.timeEnd`这两个方法可以用来让 WEB 开发人员测量一个 javascript 脚本程序执行消耗的时间

console.time 方法是开始计算时间，console.timeEnd 是停止计时，输出脚本执行的时间。

```js
console.time('testForEach');

// your code

console.timeEnd('testForEach');
```

## 三、性能优化函数

### 3.1 懒加载

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

### 3.2 防抖

n 秒后在执行该事件，若在 n 秒内被重复触发，则重新计时.

[手撕防抖](interview/frontend-shred-code#33-手撕防抖)

### 3.3 节流

n 秒内只运行一次，若在 n 秒内重复触发，只有一次生效

[手撕节流](/interview/frontend-shred-code#34-手撕节流)

### 3.4 预加载

前端预加载，即提前加载后续需要的内容 (`preload and prefetch`)、提前解析域名（`DNS Pretech & Preconnect`）、预先渲染要加载的页面(`prerender`)，这样在后续实际需要加载对应的内容时，有更快的加载速度。举个例子，在抖音 Web 端、阿里云控制台页面等，都能看到很多 rel 属性为 dns-prefetch 的 link 标签。

#### 3.4.1 图片预加载

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

## 四、原型链

搞懂原型对象和原型链其实就是搞懂 `prototype`、`__proto__` 和 `constructor` 之间的相互关系

<img src="https://tsejx.github.io/javascript-guidebook/static/prototype-chain.bbfd7b97.jpg" />

- 对象：`__proto__` 和 `constructor` 是对象独有的。
- 函数：`prototype` 是函数独有的。但是函数也是对象，所以函数也有` __proto__` 和 `constructor`。

> 所有函数和对象最终都是由 Function 构造函数得来，所以 constructor 属性的终点就是 Function 这个函数。

### 4.1 new 操作符

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

### 4.2 prototype 与 \_\_proto\_\_

\_\_proto\_\_指向创建这个对象的函数(constructor)的 prototype

每一个函数在创建之后都会拥有一个名为 prototype 的属性，这个属性指向函数的原型对象。

> warning：通过 Function.prototype.bind 方法构造出来的函数是个例外，它没有 prototype 属性。

#### 4.2.1 prototype（显式原型）

函数对象的 prototype 属性是外部共享的，而\_\_proto\_\_是隐式的

只有函数对象才有 prototype 属性

protoype 对象默认有两个属性：constructor 和 proto

#### 4.2.2 \_\_proto\_\_（隐式原型）

JavaScript 中任意对象都有一个内置属性[prototype]，在 ES5 之前没有标准的方法访问这个内置属性，但是大多数浏览器都支持通过\_\_proto\_\_来访问。ES5 中有了对于这个内置属性标准的 Get 方法 `Object.getPrototypeOf()`.

\_\_proto\_\_是 es6 加入的内部属性，不是正式对外的 api

实例对象的\_\_proto\_\_指向的是函数的 protoype

`隐式原型的作用`：构成原型链，同样用于实现基于原型的继承。举个例子，当我们访问 obj 这个对象中的 x 属性时，如果在 obj 中找不到，那么就会沿着\_\_proto\_\_依次查找。

> warning: Object.prototype 这个对象是个例外，它的\_\_proto\_\_值为 null.即 Object.prototype 的\_\_proto\_\_属性指向 null。

### 4.3 原型链继承

- `借用构造函数`（Constructor Stealing），即在子类型构造函数的内部调用父类构造函数以实现对父类构造函数属性的继承。
  - 缺陷:
    1. 只能继承父类实例对象的属性和方法，不能继承原型对象的属性和方法无法实现复用
    2. 每个子类都有父类实例函数的副本，影响性能

```ts
function Parent() {
  this.attr = {
    eye: 'blue',
    hair: 'black',
    skin: 'white',
  };
  this.sayName = function () {
    console.log('Name');
  };
}

function Child() {
  Parent.call(this);

  this.sayHi = function () {
    console.log('Hello world!');
  };
}
```

- `原型式继承`是借助原型基于已有的对象创建新对象，同时还不必因此创建自定义类型。

```ts
function Person(friendship) {
  function Creator() {}
  Creator.prototype = friendship;
  return new Creator();
}
```

- `组合继承`（Combination Inheritance）（也叫伪经典继承），指的是将原型链和借用构造函数的技术组合到一块，从而发挥二者之长的一种继承模式。

```ts
function Parent(name) {
  this.name = name;
  this.attr = {
    eye: 'blue',
    hair: 'black',
    skin: 'white',
  };
}

function Child(name, age) {
  Parent.call(this, name);
  this.age = age; // 传参数可更新Child的属性
}

Child.prototype = new Parent();
Child.prototype.constructor = Child;
Child.prototype.sayAge = function () {
  console.log(this.age);
};
```

- `寄生式继承`（Parasitic Inheritance）：创建一个仅用于封装继承过程的函数，在函数内部以某种方式增强对象

```ts
function creator(origin) {
  // 以 origin 为原型对象创建一个新对象
  let clone = Object.create(origin);

  clone.sayHi = function () {
    console.log('Hello world!');
  };
  return clone;
}

let friendship = {
  name: 'Uzi',
  friends: ['Amy', 'Ben', 'Tom'],
};

// 具有实例的原型person的所有属性和方法，也有自己的方法
let uzi = creator(friendship);
```

- `寄生组合式继承`，即通过借用构造函数来继承属性，通过原型链的混成形式来继承方法。

```ts
function Parent() {
  this.name = 'Parent';
  this.num = [0, 1, 2];
}

function Child() {
  Parent.call(this);
  thi.type = 'Child';
}

Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;
```

### 4.4 Object.create()

通过 `Object.create()` 方式创建的对象会以传入的对象参数为对象的原型。

```ts
const foo = {};
const bar = Object.create(foo);
console.log(bar.__proto__ === foo); //true
```

## 五、闭包

- 内层函数中访问到其外层函数的作用域

### 5.1 柯里化（curry）

当传入的参数数不足所需要的参数数时，返回一个可以传入剩余参数的高阶函数

[手撕柯里化](/interview/frontend-shred-code#36-柯里化curry)

### 5.2 函数组合（compose）

组合函数，目的是将多个函数组合成一个函数

[手撕函数组合](/interview/frontend-shred-code#52-函数组合compose)

### 5.3 函数管道（pipe）

`compose`执行是从右到左的。而管道函数，执行顺序是从左到右执行的

[手撕函数管道](/interview/frontend-shred-code#53-函数管道pipe)

## 六、编码、解码 URI

统一资源标识符，或叫做 URI，是用来标识互联网上的资源（例如，网页或文件）和怎样访问这些资源的传输协议（例如，HTTP 或 FTP）的字符串。除了`encodeURI`、`encodeURIComponent`、`decodeURI`、`decodeURIComponent`四个用来编码和解码 URI 的函数之外 ECMAScript 语言自身不提供任何使用 URL 的支持。

### 6.1 encodeURI 和 encodeURIComponent

它们都是编码 URL，唯一区别就是编码的字符范围

其中 encodeURI 方法不会对下列字符编码 ,`ASCII 字母 数字 ~!@#$&\_()=:/,;?+'`

encodeURIComponent 方法不会对下列字符编码 `ASCII 字母 数字 ~!\_()'`

所以 encodeURIComponent 比 encodeURI 编码的范围更大。

### 6.2 decodeURI 和 decodeURIComponent

decodeURI() 函数可对 encodeURI() 函数编码过的 URI 进行解码。

decodeURIComponent() 函数可对 encodeURIComponent() 函数编码的 URI 进行解码。

```ts
encodeURIComponent('#');
// "%23"
decodeURI('%23');
// "%23"
decodeURIComponent('%23');
// "#"
encodeURI('#');
// "#"
```

## 七、ajax、axios、fetch

axios 既提供了并发的封装，也没有 fetch 的各种问题，而且体积也较小，当之无愧现在最应该选用的请求的方式。

### 7.1 jQuery ajax

```js
$.ajax({
  type: 'POST',
  url: url,
  data: data,
  dataType: dataType,
  success: function () {},
  error: function () {},
});
```

传统 Ajax 指的是 `XMLHttpRequest（XHR）`， 最早出现的发送后端请求技术，隶属于原始 js 中，核心使用 XMLHttpRequest 对象，多个请求之间如果有先后关系的话，就会出现回调地狱。

JQuery ajax 是对原生 XHR 的封装，除此以外还增添了对 `JSONP` 的支持。经过多年的更新维护，真的已经是非常的方便了，优点无需多言；如果是硬要举出几个缺点，那可能只有：

1. 本身是针对 MVC 的编程,不符合现在前端 MVVM 的浪潮
2. 基于原生的 XHR 开发，XHR 本身的架构不清晰。
3. JQuery 整个项目太大，单纯使用 ajax 却要引入整个 JQuery 非常的不合理（采取个性化打包的方案又不能享受 CDN 服务）
4. 不符合关注分离（Separation of Concerns）的原则
5. 配置和调用方式非常混乱，而且基于事件的异步模型不友好。

PS:`MVVM(Model-View-ViewModel)`, 源自于经典的 `Model–View–Controller（MVC）`模式。MVVM 的出现促进了 GUI 前端开发与后端业务逻辑的分离，极大地提高了前端开发效率。MVVM 的核心是 ViewModel 层，它就像是一个中转站（value converter），负责转换 Model 中的数据对象来让数据变得更容易管理和使用，该层向上与视图层进行双向数据绑定，向下与 Model 层通过接口请求进行数据交互，起呈上启下作用。View 层展现的不是 Model 层的数据，而是 ViewModel 的数据，由 ViewModel 负责与 Model 层交互，这就完全解耦了 View 层和 Model 层，**这个解耦是至关重要的，它是前后端分离方案实施的最重要一环**。

<img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8d975c0670d24c29a23d75d70ccc8206~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp" />

### 7.2 axios

```js
axios({
  method: 'post',
  url: '/user/12345',
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone',
  },
})
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
```

axios 是一个基于 Promise 用于浏览器和 nodejs 的 HTTP 客户端，本质上也是对原生 XHR 的封装，只不过它是`Promise`的实现版本，符合最新的 ES 规范，它本身具有以下特征：

1. 从浏览器中创建 XMLHttpRequest
2. 支持 `Promise API`
3. 客户端支持防止 CSRF
4. 提供了一些并发请求的接口（重要，方便了很多的操作）
5. 从 node.js 创建 http 请求
6. 拦截请求和响应
7. 转换请求和响应数据
8. [控制并发](/interview/frontend-shred-code#56-实现控制并发)、[失败重试](/interview/frontend-shred-code#57-实现失败重试)、[取消请求等封装](/interview/frontend-shred-code#58-超时中断)
9. 自动转换 JSON 数据

PS:`防止CSRF`:就是让你的每个请求都带一个从 cookie 中拿到的 key, 根据浏览器同源策略，假冒的网站是拿不到你 cookie 中得 key 的，这样，后台就可以轻松辨别出这个请求是否是用户在假冒网站上的误导输入，从而采取正确的策略。

### 7.3 fetch

```ts
try {
  let response = await fetch(url);
  let data = response.json();
  console.log(data);
} catch (e) {
  console.log('Oops, error', e);
}
```

`fetch`号称是`AJAX`的替代品，是在 ES6 出现的，使用了 ES6 中的 promise 对象。Fetch 是基于 promise 设计的。Fetch 的代码结构比起 ajax 简单多了，参数有点像 jQuery ajax。但是，一定记住**fetch 不是 ajax 的进一步封装**，而是原生 js，没有使用 XMLHttpRequest 对象。

1. 语法简洁，更加语义化
2. 基于标准 Promise 实现，支持 async/await
3. 同构方便，使用 [isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch)
4. 更加底层，提供的 API 丰富（request, response）
5. 脱离了 XHR，是 ES 规范里新的实现方式

在使用 fetch 的时候，也遇到了不少的问题，可以封装以下：

1. fetch 只对网络请求报错，对 400，500 都当做成功的请求，服务器返回 400，500 错误码时并不会 reject，只有网络错误这些导致请求不能完成时，fetch 才会被 reject。
2. fetch 默认不会带 cookie，需要添加配置项： fetch(url, {credentials: 'include'})
3. fetch 不支持 `abort`，不支持超时控制，使用 setTimeout 及 Promise.reject 的实现的超时控制`并不能阻止`请求过程继续在后台运行，造成了流量的浪费
4. fetch 没有办法原生监测请求的进度，而 XHR 可以

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
