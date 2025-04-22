---
order: 5
title: ES5 - ES11
---

# ECMAScript

ECMAScript 和 JavaScript 的关系：前者是后者的规格，后者是前者的一种实现（另外的 ECMAScript 方言还有 JScript 和 ActionScript）。

- ActionScript ( Flash 脚本语言)，由于 Adobe 将于 2020 年末停止对 Flash 的支持而逐渐失去热度。
- JScript (微软开发的脚本语言),在第一次浏览器大战最激烈的时期，JavaScript 只被 Netscape 所支持，微软必须为 Internet Explorer 构建自己的脚本语言。

ES5 历史：

ES6 的第一个版本，是在 1015 年 6 月发布，正式名称就是《ECMAScript 1015 标准》（简称 ES1015）。1016 年 6 月，小幅修订的《ECMAScript 1016 标准》（简称 ES1016）如期发布，这个版本可以看作是 ES6.1 版，因为两者的差异非常小（只新增了数组实例的 `includes` 方法和指数运算符），基本上是同一个标准。根据计划，1017 年 6 月发布 ES1017 标准。

`ESNext`, 什么是 ESNext ？

> ESNext 是一个始终指向下一个版本 JavaScript 的名称。

`ES6(2015)`

- let 和 const
- 默认参数
- 模板字符串
- 解构赋值
- 展开运算符
- [箭头函数](/big-frontend/前端/ecmascript#72-箭头函数)
- [类](/big-frontend/前端/ecmascript#十二class)
- [增强的对象字面量](/big-frontend/前端/ecmascript#73-对象字面量)
- [for...in|of 循环](/big-frontend/前端/ecmascript#for--in-和-for--of-的区别)
- [Promise](/big-frontend/前端/ecmascript#一promise)
- [模块](/big-frontend/前端/ecmascript#十三module)
- [String 新方法](/big-frontend/前端/ecmascript#六string-api)
- [Object 新方法](/big-frontend/前端/ecmascript#四object-api)
- [Array 新方法](/big-frontend/前端/ecmascript#五array-api)
- [Set、Map](/big-frontend/前端/ecmascript#八set-和-map-数据结构)
- [Generators](/big-frontend/前端/ecmascript#二generator)

`ES7(2016)`

- Array.prototype.includes()
- [求幂运算符](/big-frontend/前端/ecmascript#74-求幂运算符)

`ES8(2017)`

- 字符串填充
- Object.values()
- Object.entries()
- Object.getOwnPropertyDescriptors()
- [尾逗号](/big-frontend/前端/ecmascript#75-尾逗号合法)
- [共享内存 and 原子操作](/big-frontend/前端/ecmascript#76-共享内存与原子操作)

`ES9(2018)`

- Rest/Spread Properties
- Asynchronous iteration
- Promise.prototype.finally()
- 正则表达式改进

ESNext

- Array.prototype.{flat,flatMap}
- try/catch 可选的参数绑定
- Object.fromEntries()
- String.prototype.{trimStart,trimEnd}
- Symbol.prototype.description
- JSON improvements
- Well-formed JSON.stringify()
- Function.prototype.toString()
- BigInt

# ES6

## 一、Promise

`Promise`对象是一个构造函数，用来生成 Promise 实例

`Promise`，是异步编程的一种解决方案，比传统的回调函数更加合理和更加强大.

1. 支持链式调用
2. 解决回调地狱的问题。

- pending 表示还在执行
- resolved 执行成功
- rejected 执行失败

### 1.1 promise 原理

[手撕 promise](/interview/frontend-shred-code#51-手撕-promise)

### 1.2 promise API

#### 1.2.1 Promise.all

当所有的输入 promise 实例的状态都改变为 fulfilled 状态，新的 promise 实例才是 `fulfilled` 状态.

返回所有输入 promise 实例的 `resolve value 数组`；

如果有一个 promise 实例的状态是 rejected，则新的 promise 实例的状态就是 `rejected`，返回第一个 promise reject 的 reason.

[手撕 Promise.all](/interview/frontend-shred-code#52-手撕-promiseall)

```ts
let p1 = Promise.resolve(1);
let p2 = Promise.resolve(2);
let p3 = Promise.resolve(3);
let p4 = Promise.resolve(4);
let p5 = Promise.reject(5);
let p6 = Promise.reject(6);

// 全为fufilled;
Promise.all([p1, p2, p3, p4]).then(
  (res) => {
    console.log('全为fufilled', res);
    //全为fufilled [ 1, 2, 3, 4 ]
  },
  (err) => {
    console.log('111', err);
  },
);

Promise.all([p1, p2, p3, p4, p5]).then(
  (res) => {
    console.log(res);
  },
  (err) => {
    console.log('出现一个rejected', err);
    // 出现一个rejected 5
  },
);

Promise.all([p1, p2, p3, p4, p5, p6]).then(
  (res) => {
    console.log(res);
  },
  (err) => {
    console.log('传入两个rejected', err);
    // 传入两个rejected 5
  },
);

Promise.all([{ a: 999 }, 2, 3, p1, p2, p3, p4]).then(
  (res) => {
    console.log('传入promise数组中出现非promise', res);
    // 传入promise数组中出现非promise [ { a: 999 }, 2, 3, 1, 2, 3, 4 ]
  },
  (err) => {
    console.log(err);
  },
);
```

#### 1.2.2 Promise.race

返回最先执行结束的`promise`的`value`或者`reason`，不论状态是`rejected`还是`fulfilled`

[手撕 Promise.race](/interview/frontend-shred-code#53-手撕-promiserace)

#### 1.2.3 Promise.any

返回`promise`数组中**最先**变成`fulfilled`实例的`value`，如果，所有输入的`promise`实例的状态`都是rejected`， 返回`all promise were rejected`

#### 1.2.4 Promise.allSettled

返回所有 promise 实例执行的数组

```json
[
  {
    "status": "fulfuilled",
    "value": "success"
  }
]
```

## 二、Generator

Generator 函数是 ES6 提供的一种异步编程解决方案，语法行为与传统函数完全不同。

### 2.1 async 函数

## 三、Number API

### 3.1 isNaN()

**isNaN()函数和 Number.isNaN()方法的基本区别**:

Number.isNaN()方法判断传入的参数是否严格的等于 NaN，也就是传入的值是 NaN 时，才会返回 true；除此之外全部返回 false；

isNaN()函数只是判断传入的参数是否能转换成数字，并不是严格的判断是否等于，如果能转换为数字，返回 false；如果不能转换成数字，则返回 true；

### 3.2 EPSILON()

`Number.EPSILON`方法，它可以用来**设置“能够接受的误差范围"**

#### 0.1+0.1 !== 0.3 问题

JavaScript 的数据类型，关于数字的只有一种类型，Number，它使用 64 位固定长度来表示，也就是标准的 double 双精度浮点数，在二进制中记住一个原则，**遵循 0 舍 1 入**

所以，0.1+0.1 = 0.30000000000000004

```js
function withinErrorMargin(left, right) {
  return Math.abs(left - right) < Number.EPSILON * Math.pow(1, 1); //pow() 方法可返回 x 的 y 次幂 (x y) 的值
}

0.1 + 0.1 === 0.3; // false
withinErrorMargin(0.1 + 0.1, 0.3); // true
```

### 3.3 isInteger

isInteger() 函数用于检测指定参数是否为整数，如果是整数返回 true，否则返回 false。

- 可以判断是否为偶数

```js
const numBool = Number.isInteger(number / 2);
```

## 四、Object API

### 4.1 is()

`Object.is()`类似于===，不做隐式的类型转换，但在三等号判断的基础上特别处理了 NaN、-0 和+0，保证-0 和+0 不再相同，但 Object.is(NaN,NaN)会返回 true。

而且，严格相等运算符===不能区分两个不同的数字+0 和-0，还会把两个 NaN 看成不相等的。

### 4.2 hasOwnProperty()

hasOwnProperty 方法用于检测参数是否在当前 object 中

```ts
!!('thumbUp' in data);
data.hasOwnProperty('thumbUp');
// true or false
```

### 4.3 keys()

```ts
const object1 = {
  a: 'somestring',
  b: 42,
  c: false,
};
console.log(Object.keys(object1));
// expected output: Array ["a", "b", "c"]
```

`Object.keys()`返回一个表示给定对象的所有可枚举属性的字符串数组,但并不总能保持先来后到的顺序。从解决业务需要的角度，我们可以通过维护一个单独的 tag 数组来回避这个问题。

## 五、Array API

### 5.1 some()

some() 方法用于检测数组中的元素是否满足指定条件（函数提供）。some() 方法会依次执行数组的每个元素：`如果有一个元素满足条件，则表达式返回 true` , 剩余的元素不会再执行检测。 如果没有满足条件的元素，则返回 `false`。

```ts
// 用法
const res = data.some((e) => e.user.id === currentUser.id);
```

### 5.2 foreach()、map()、filter()、find()

- forEach(): 针对每一个元素执行提供的函数。除了抛出异常以外，没有办法中止或跳出 forEach() 循环。如果你需要中止或跳出循环，forEach() 方法不是应当使用的工具。
- map(): 创建一个新的数组，其中每一个元素由调用数组中的每一个元素执行提供的函数得来。
- filter(): 用于过滤序列，过滤掉不符合条件的元素，返回由符合条件元素组成的新列表。
- find() :用于检测数组中的元素是否满足指定条件（函数提供）。find() 方法会依次执行数组的每个元素：`表达式返回元素满足的第一个元素` 。 如果没有满足条件的元素，则返回 `undefined`. 都可以用索引修改原数组

```ts
const array = [11, 14, 17, 13, 16];
const res = array.map((item, index, arr) => item * 10);
console.log(res); // [110,140,170,130,160]
console.log(array); // [11,14,17,13,16]不变

const res = array.forEach((item, index, arr) => (arr[index] = item * 10));
console.log(res); // undefined
console.log(array); // [110,140,170,130,160]原数组修改为索引变动后

const res = array.filter((item, index, arr) => item > 10);
console.log(res); // [ 14, 17, 13, 16 ]
console.log(array); // [ 11, 14, 17, 13, 16 ] 原数组不变

const res = array.find((item, index, arr) => item > 10);
console.log(res); // 14
console.log(array); // [ 11, 14, 17, 13, 16 ] 原数组不变
```

#### for ... in 和 for ... of 的区别

无论是 for...in 还是 for...of 语句都是迭代一些东西。它们之间的主要区别在于它们的迭代方式。

`for...in`语句以任意顺序迭代对象的可枚举属性（包括它的原型链上的可枚举属性）。

`for...of`语句遍历可迭代对象定义要迭代的数据。

以下示例显示了与 Array 一起使用时，for...of 循环和 for...in 循环之间的区别。

```ts
Object.prototype.objCustom = function () {};
Array.prototype.arrCustom = function () {};

let iterable = [3, 5, 7];
iterable.foo = 'hello';

for (let i in iterable) {
  console.log(i); // 0, 1, 2, "foo", "arrCustom", "objCustom"
}

for (let i in iterable) {
  if (iterable.hasOwnProperty(i)) {
    console.log(i); // 0, 1, 2, "foo"
  }
}

for (let i of iterable) {
  console.log(i); // logs 3, 5, 7
}
```

总结：**for in 一般用来遍历对象的 key、for of 一般用来遍历数组的 value**

### 5.3 from()

`Array.from()`:允许在 JavaScript 集合(如: 数组、类数组对象、或者是字符串、map 、set 等可迭代对象) 上进行有用的转换。

```ts
// arrayLike：必传参数，想要转换成数组的伪数组对象或可迭代对象。
// mapFunction：可选参数，mapFunction(item，index){...} 是在集合中的每个项目上调用的函数。返回的值将插入到新集合中。
// thisArg：可选参数，执行回调函数 mapFunction 时 this 对象。这个参数很少使用。
Array.from(arrayLike, mapFunction, thisArg);
// 例如，让我们将类数组的每一项乘以 1
const someNumbers = { '0': 10, '1': 15, length: 1 };
Array.from(someNumbers, (value) => value * 1); // => [10, 30]
```

### 5.4 slice()

> slice(start，end)

- 从 start 开始截取到,end 但是不包括 end
- 返回值为截取出来的元素的集合
- 原始的数组`不会变化`

```js
const arr1 = [1, 23, 44, 55, 66, 77, 888, 'fff'];
const arr2 = arr1.slice(2, 4); //从index为2截取到index为4之前不包括4
console.log(arr2); //[44,55]
console.log(arr1); // [1,23,44,55,66,77,888,"fff"]原始数组没有被改变
```

### 5.5 splice()

> splice(start,deleteCount,item1,item2…..);

- start 参数 开始的位置
- deleteCount 要截取的个数
- 后面的 items 为要添加的元素
- 如果 deleteCount 为 0，则表示不删除元素，从 start 位置开始添加后面的几个元素到原始的数组里面
- 返回值为由被删除的元素组成的一个数组。如果只删除了一个元素，则返回只包含一个元素的数组。如果没有删除元素，则返回空数组
- 这个方法`会改变`原始数组，数组的长度会发生变化

```js
let arr3 = [1, 2, 3, 4, 5, 6, 7, 'f1', 'f2'];
const arr4 = arr3.splice(2, 3); //删除第三个元素以后的三个数组元素(包含第三个元素)
console.log(arr4); //[3,4,5];
console.log(arr3); //[1,2,6,7,"f1","f2"]; 原始数组被改变
```

### 5.6 join()

`join()` 方法将一个数组（或一个类数组对象）的所有元素连接成一个字符串并返回这个字符串

```js
const elements = ['Fire', 'Air', 'Water'];

console.log(elements.join());
// expected output: "Fire,Air,Water"
console.log(elements.join(''));
// expected output: "FireAirWater"
console.log(elements.join('-'));
// expected output: "Fire-Air-Water"
```

## 六、String API

### 6.1 split()

split() 方法根据 splitter （或分隔符）将字符串拆分（划分）为两个或多个子字符串的数组

```js
const ip = '127.0.0.1';
ip.split('.');
//[ '127', '0', '0', '1' ]
```

### 6.2 replace()

- replace 的参数是 char 和 CharSequence，既支持字符的替换，也支持字符串的替换(CharSequence 即字符串序列的意思，也就是字符串)。

- replaceAll 的参数是 regex，即基于规则表达式的替换。比如：可以通过 replaceAll("\\d", "\*")把一个字符串所有的数字字符都换成星号。

```js
const ip = '127.0.0.1';
ip.replace('.', ''); // 1270.0.1
ip.replaceAll('.', ''); // 127001
```

### 6.3 substring()

`String.substring(start,stop)`

- start 必需。一个非负的整数，规定要提取的子串的第一个字符在 string 中的位置。

- stop 可选。一个非负的整数，比要提取的子串的最后一个字符在 stringObject 中的位置多 1。如果省略该参数，那么返回的子串会一直到字符串的结尾。

```js
const ip = '127.0.0.1';
ip.substring(0, 3); // 127
ip.substring(3); // .0.0.1
```

### 6.3 padStart()

字符串排序问题中，需要将字符串格式化为三位数，例如：1 -> 001, 10 -> 010

```ts
const formattedPackageNumber = String(i).padStart(3, '0');
```

### 6.3 startsWith()

用来判断一个字符串是否以指定的子串开头，返回布尔值 true 或 false，例如：actoryline_1 -> true

```ts
const route = route.path.startsWith('factoryline_');
```

## 七、基础夯实

### 7.1 暂时性死区

在代码块内，使用 let 命令声明变量之前，该变量都是不可用的。这在语法上，称为“暂时性死区”（temporal dead zone，简称 TDZ）。

### 7.2 箭头函数

1. 箭头函数没有自己的 this，箭头函数内的 this 变量指向外层非箭头函数的函数的 this ，任何方法都改变不了其指向，如 call() , bind() , apply()，它只会从自己的作用域链的上一层继承 this。 而普通函数的 this 指向调用它的那个对象
2. 优美，当函数体只有一条语句，可简写
3. 箭头函数没有原型 prototype，内部也不可以使用 `arguments` 对象
4. 箭头函数不可以当做构造函数

为什么不能用作构造函数：

构造函数是通过 new 关键字来生成对象实例，生成对象实例的过程也是通过构造函数给实例绑定 this 的过程，而箭头函数没有自己的 this。创建对象过程，new 首先会创建一个空对象，并将这个空对象的\_\_prot\_\_指向构造函数的 prototype，从而继承原型上的方法，但是箭头函数没有 prototype。因此不能使用箭头作为构造函数，也就不能通过 new 操作符来调用箭头函数。

### 7.3 对象字面量

定义一个对象叫 obj ,下面那个大括号`{ }`就叫对象字面量。

当通过字面量方式创建对象时，它的原型就是 `Object.prototype`。

虽然我们无法直接访问内置属性 `__proto__`，但我们可以通过 `Object.getPrototypeOf()` 或对象的属性`__proto__`获取对象的原型。

```ts
const obj = new Object(); //创建一个Object 赋值给obj
```

但实际开发中我们通常不会这样写，我们一般会写成

```ts
const obj = {}; //这个大括号就叫对象字面量
```

对象字面量的增强写法:

```ts
const name = 'why';
const age = 18;
const height = 1.88;

const obj = {
  name,
  age,
  height,
  //ES5写法
  run: function () {},
  eat: function () {},
  //ES6写法
  run() {},
  eat() {},
}; //给obj添加name、age、height三个属性，值从同名变量找
```

### 7.4 求幂运算符

幂（\*\*）运算符返回第一个操作数取第二个操作数的幂的结果。它等价于 Math.pow()，不同之处在于，它还接受 `BigInt` 作为操作数。

```ts
const num = 2 ** 3;
// 8
```

> 注：幂运算符是右结合的：a ** b ** c 等于 a ** (b ** c)。

### 7.5 尾逗号合法

函数定义参数和调用函数的参数中添加尾逗号合法，这个在 ES2015 中是不合法的。

例如：

```js
const arr = [100, 200, 300, 400];
const obj = { a: 1, b: 2 };
```

解决的问题：

1. 处理数据不必再手动处理最后一个逗号的问题
2. 函数参数尾逗号报错不友好

### 7.6 共享内存与原子操作

`共享内存`允许多个线程并发读写数据

`原子操作`则能够进行并发控制，确保多个存在竞争关系的线程顺序执行。

由于 Web Worker 的出现，我们可以通过 JavaScript 的内置对象 Worker 的创建一个后台任务，然后执行一些复杂的任务以避免主线程被堵塞

## 八、Set 和 Map 数据结构

### 8.1 Set

### 8.2 Map

#### 8.2.1 Map 和 WeakMap 的区别

`WeakMap` 。它对于值的引用都是不计入垃圾回收机制的，所以名字里面才会有一个"Weak"，表示这是弱引用（对对象的弱引用是指当该对象应该被 GC 回收时不会阻止 GC 的回收行为）。

`Map` 相对于 `WeakMap` ：

- `Map` 的键可以是任意类型，`WeakMap` 只接受对象作为键（null 除外），不接受其他类型的值作为键
- `Map` 的键实际上是跟内存地址绑定的，只要内存地址不一样，就视为两个键； `WeakMap` 的键是弱引用，键所指向的对象可以被垃圾回收，此时键是无效的
- `Map` 可以被遍历， `WeakMap` 不能被遍历

## 九、Proxy

## 十、Reflect

## 十一、Generator

## 十二、Class

### 12.1 Class 的基本语法

### 12.2 Class 的继承

## 十三、Module

### 13.1 Module 的语法

### 13.2 Module 的加载实现

## 十四、Symbol

## 十五、ArrayBuffer
