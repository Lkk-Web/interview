---
order: 3
---

# Javascript

## 1、数据类型

### 1.1 数据类型有哪些

JS6 种数据基本类型：Undefined、Null、Boolean、Number、String、Symbol 3 种引用类型:Object、Array、Function

为什么基本数据类型存在栈内存，引用数据类型存在堆内存?（变量存在于栈中）

- 基本数据类型比较稳当，相对来说占用的内存较小
- 引用数据类型是动态的，大小不固定，占用的内存较大，但内存地址大小是固定的，因此可以将内存地址保存在栈中（该指针变量）

对于 javascript 而言

- 栈内存(stack)：栈内存是当前函数作用域的内存，与当前执行上下文绑定
- 堆内存(heap)：堆内存是区别于栈区、代码区，是独立的另一个内存区域。

const 修饰的引用类型可以被修改，因为对象是引用类型的，P 中保存的仅是对象的指针，这就意味着，const 仅保证指针不发生改变，修改对象的属性不会改变对象的指针，所以是被允许的。也就是说 const 定义的引用类型只要指针不发生改变，其他的不论如何改变都是允许的。

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

#### 1.1.2 深拷贝

深拷贝是指**源对象与拷贝对象互相独立**，其中任何一个对象的改动都不会对另外一个对象造成影响。

```js
let oldobj = {
  name: 'Yang',
  age: 18,
  pet: {
    pet_name: 'Bai',
    pet_age: 3,
  },
};

//构建深拷贝函数
const deepCopy = (target, map = new Map()) => {
  let reg = /^(Function|RegExp|Data|Map|Set)$/;
  if (reg.test(target.constructor.name)) {
    return new target.constructor(target);
  }
  let newObj = target instanceof Array ? [] : {};
  if (target instanceof Object) {
    if (map.get(target)) {
      return map.get(target);
    } else {
      map.set(target, newObj);
    }
    for (let item in target) {
      newObj[item] = deepCopy(target[item], map);
    }
  }
  return newObj;
};

let newobj = myDeepCopy({}, oldobj);
console.log(newobj);
//age: 18	name: "Yang" pet: {pet_name: 'Bai', pet_age: 5} [[Prototype]]: Object

newobj.pet.pet_age = 5;
console.log(newobj.pet.pet_age); //5
console.log(oldobj.pet.pet_age); //3
//完成深拷贝
```

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

typeof 判断：

```javascript
typeof undefined; // "undefined"
typeof null; // "object"
//JavaScript 中的值是由一个表示类型的标签和实际数据值表示的。 对象的类型标签是 0。 由于 null 代表的是空指针（大多数平台下值为 0x00），因此，null 的类型标签是 0， typeof null 也因此返回 "object" 。
typeof [1, 2]; // "object"
typeof true; // "boolean"
typeof NaN; // 'number'
typeof Symbol(); // 'symbol'
typeof Array; // "function"
typeof (() => {}); // typeof 箭头函数返回也是 "function"
//typeof的返回值都是 string类型
typeof typeof undefined; // "string"
typeof console; // 'object'
typeof console.log; // 'function'
typeof arguments; // 'object'
```

instanceof 判断:（true or false）

#### 手撕 instanceof

```js
function instanceof(L: Object, R: any){
  let protoChain = Object.getPrototypeOf(L);
  const Lprototype = R.prototype;
  // 最坏情况递归查到Object.prototype === null
  while(protoChain) {
      // 两个对象指向同一个内存地址，则为同一个对象
      if(protoChain === Lprototype) {
        return true;
      }
      protoChain = Object.getPrototypeOf(protoChain);
  }
  // 找到终点还没找到，那就没有了呗
  return false;
}
```

`instanceof` 运算符用于检测构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上

```js
let car = new String('xxx');
car instanceof String; // true
let str = 'xxx';
str instanceof String; // false
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

面试手撕：

```js
function getType(obj) {
  let type = typeof obj;
  if (type !== 'object') {
    // 先进行typeof判断，如果是基础数据类型，直接返回
    return type;
  }
  // 对于typeof返回结果是object的，再进行如下的判断，正则返回结果
  return Object.prototype.toString.call(obj).replace(/^\[object (\S+)\]$/, '$1');
}
```

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

### 2.1 用法

```javascript
(function () {})(); //前面的括号包含着一个匿名函数，后面的括号调用此函数
```

为了避免解析上的歧义，JS 引擎规定，如果 function 出现在行首，一律解析成语句。因此 JS 引擎看到行首是 function 关键字会认为这一段都是函数定义，不应该以原括号结尾，所以会报错。

立即执行函数，还有一些其他的写法（加一些小东西，不让解析成语句就可以）,比如下边：

```
(function () {alert("我是匿名函数")}())   //用括号把整个表达式包起来
(function () {alert("我是匿名函数")})()  //用括号把函数包起来
!function () {alert("我是匿名函数")}()  //求反，我们不在意值是多少，只想通过语法检查
+function () {alert("我是匿名函数")}()
-function () {alert("我是匿名函数")}()
~function () {alert("我是匿名函数")}()
void function () {alert("我是匿名函数")}()
new function () {alert("我是匿名函数")}()
```

### 2.2 作用

1. 不必为函数命名，避免了污染全局变量
2. 立即执行函数内部形成了一个单独的作用域，可以封装一些外部无法读取的私有变量
3. 封装变量,可以返回一个在全局中需要的变量（用 return）。

### 2.3 场景

- 你的代码在页面加载完成之后，不得不执行一些设置工作，比如时间处理器，创建对象等等。
- 所有的这些工作只需要执行一次，比如只需要显示一个时间。
- 但是这些代码也需要一些临时的变量，但是初始化过程结束之后，就再也不会被用到，如果将这些变量作为全局变量，不是一个好的注意，我们可以用立即执行函数——去将我们所有的代码包裹在它的局部作用域中，不会让任何变量泄露成全局变量，

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

```js
//判断是否在可视区
function isInViewPort(element) {
  const viewWidth = window.innerWidth || document.documentElement.clientWidth;
  const viewHeight = window.innerHeight || document.documentElement.clientHeight;
  const { top, right, bottom, left } = element.getBoundingClientRect();

  return top >= 0 && left >= 0 && right <= viewWidth && bottom <= viewHeight;
}
```

### 4.2 防抖

n 秒后在执行该事件，若在 n 秒内被重复触发，则重新计时

```js
function debounce(fn: any, delay: number) {
  // 初次触发定时器为null，后面产生一份定时器并记下定时器id
  let timer: any = null;
  // 闭包使定时器id逃逸
  return function () {
    let args = arguments;
    // 如果已有定时器id，则需要清除，重新开始延迟执行
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    timer = setTimeout(() => {
      fn.apply(this, args);
      // 销毁定时器id，以便下次节流函数触发
      timer = null;
    }, delay);
  };
}
```

### 4.3 节流

n 秒内只运行一次，若在 n 秒内重复触发，只有一次生效

```js
function throttle(fn: any, wait: number) {
  let last: any;
  return function () {
    let now: any = Date.now();
    // 初次执行
    if (!last) {
      fn.apply(this, arguments);
      last = now;
      return;
    }
    // 以后触发，需要判断是否到延迟
    if (now - last >= wait) {
      fn.apply(this, arguments);
      last = now;
    }
  };
}
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

## 6、原型链

### 6.1 new 操作符

手撕 new 操作符（new 具体干了什么）

```js
function new(Func,...args){
	//1.创建一个新对象
    const obj = {};
    //2.新对象原型指向构造函数对象
    obj.prototype = Func.prototype;
    //3.将构造函数的this指向新对象
    let result = Func.apply(obj,args)
    //4.根据返回值判断
    return result instanceof Object ? result : obj
}
```

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
