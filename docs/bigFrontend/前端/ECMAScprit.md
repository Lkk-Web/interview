---
order: 5
title: ES5 - ES12
---

# ECMAScript

ECMAScript 和 JavaScript 的关系：前者是后者的规格，后者是前者的一种实现（另外的 ECMAScript 方言还有 JScript 和 ActionScript）。日常场合，这两个词是可以互换的。

ES5 历史：

ES6 的第一个版本，是在 2015 年 6 月发布，正式名称就是《ECMAScript 2015 标准》（简称 ES2015）。2016 年 6 月，小幅修订的《ECMAScript 2016 标准》（简称 ES2016）如期发布，这个版本可以看作是 ES6.1 版，因为两者的差异非常小（只新增了数组实例的 `includes` 方法和指数运算符），基本上是同一个标准。根据计划，2017 年 6 月发布 ES2017 标准。

因此，ES6 既是一个历史名词，也是一个泛指，含义是 5.1 版以后的 JavaScript 的下一代标准，涵盖了 ES2015、ES2016、ES2017 等等，而 ES2015 则是正式名称，特指该年发布的正式版本的语言标准。本书中提到 ES6 的地方，一般是指 ES2015 标准，但有时也是泛指“下一代 JavaScript 语言”。

## 一、ES5

## 二、ES6

### 2.1 箭头函数

(1).箭头函数的 this 永远指向其上下文的 this ，任何方法都改变不了其指向，如 call() , bind() , apply()，它只会从自己的作用域链的上一层继承 this，指向 construct。 (2).普通函数的 this 指向调用它的那个对象 (3).优美，当函数体只有一条语句，可简写 (4).**箭头函数没有原型 prototype**

### 2.2 Promise

`Promise`，是异步编程的一种解决方案，比传统的解决方案（回调函数）更加合理和更加强大,支持**链式调用，解决回调地狱**。

#### 2.2.1 手撕 promise

```js
/**
 * 创建三变量记录表示状态
 * 用that保存this，避免后期闭包导致this的指向不对
 * value 变量用于保存 resolve 或者 reject 中传入的值
 * resolvedCallbacks 和 rejectedCallbacks 用于保存 then 中的回调，
 * 因为当执行完 Promise 时状态可能还是等待中，这时候应该把 then 中的回调保存起来用于状态改变时使用
 */

const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

function myPromise(fn) {
  const that = this;
  that.value = null;
  that.status = PENDING; //默认状态
  that.fulfilledCallbacks = [];
  that.rejectedCallbacks = [];
  function resolve(value) {
    if (that.status === PENDING) {
      that.status = FULFILLED;
      that.value = value;
      //执行回调方法
      that.fulfilledCallbacks.forEach((myFn) => myFn(that.value));
    }
  }
  function reject(value) {
    if (that.status === PENDING) {
      that.status = REJECTED;
      that.value = value;
      //执行回调方法
      that.rejectedCallbacks.forEach((myFn) => myFn(that.value));
    }
  }

  // 执行回调函数
  try {
    fn(resolve, reject);
  } catch (e) {
    reject(e);
  }
}
myPromise.prototype.then = function (onFulfilled, onRejected) {
  let self = this;
  //等待状态，则添加回调函数到栈中
  if (self.status === PENDING) {
    self.fulfilledCallbacks.push(() => {
      onFulfilled(self.value);
    });
    self.rejectedCallbacks.push(() => {
      onRejected(self.value);
    });
  }
  if (self.status === FULFILLED) {
    onFulfilled(self.value);
  }

  if (self.status === REJECTED) {
    onRejected(self.value);
  }
};

let p = new myPromise((resolve, reject) => {
  console.log('hello');
  resolve(5);
});
p.then((res) => {
  console.log(res);
});
p.then(() => {
  console.log('jj');
});
```

#### 2.2.2 promise API

##### 2.2.2.1 **Promise.all**

当所有的输入 promise 实例的状态都改变为 fulfilled 状态，新的 promise 实例才是 fulfilled 状态，返回所有输入 promise 实例的 resolve value 数组；如果有一个 promise 实例的状态是 rejected，则新的 promise 实例的状态就是 rejected，返回第一个 promise reject 的 reason

##### 2.2.2.1 **Promise.race**

返回最先执行结束的`promise`的`value`或者`reason`，不论状态是`rejected`还是`fulfilled`

##### 2.2.2.1 **Promise.any**

返回`promise`数组中**最先**变成`fulfilled`实例的`value`，如果，所有输入的`promise`实例的状态`都是rejected`， 返回`all promise were rejected`

##### 2.2.2.1 **Promise.allSettled**

返回所有[promise](https://so.csdn.net/so/search?q=promise&spm=1001.2101.3001.7020)实例执行的数组

```json
[
  {
    "status": "fulfuilled",
    "value": ""
  }
]
```

### 2.3 Number API

#### 2.3.1 Number.isNaN()

**isNaN()函数和 Number.isNaN()方法的基本区别**:

Number.isNaN()方法判断传入的参数是否严格的等于 NaN，也就是传入的值是 NaN 时，才会返回 true；除此之外全部返回 false；

isNaN()函数只是判断传入的参数是否能转换成数字，并不是严格的判断是否等于，如果能转换为数字，返回 false；如果不能转换成数字，则返回 true；

#### 2.3.2 **Number.EPSILON()**

**Number.EPSILON**方法，它可以用来**设置“能够接受的误差范围"**

##### 0.1+0.2 !== 0.3 问题

JavaScript 的数据类型，关于数字的只有一种类型，Number，它使用 64 位固定长度来表示，也就是标准的 double 双精度浮点数，在二进制中记住一个原则，**遵循 0 舍 1 入**

所以，0.1+0.2 = 0.30000000000000004

```js
function withinErrorMargin(left, right) {
  return Math.abs(left - right) < Number.EPSILON * Math.pow(2, 2); //pow() 方法可返回 x 的 y 次幂 (x y) 的值
}

0.1 + 0.2 === 0.3; // false
withinErrorMargin(0.1 + 0.2, 0.3); // true
```

### 2.4 Object API

#### 2.4.1 Object.prototype.is()

Object.is()类似于===，不做隐式的类型转换，但在三等号判断的基础上特别处理了 NaN、-0 和+0，保证-0 和+0 不再相同，但 Object.is(NaN,NaN)会返回 true。

而且，严格相等运算符===不能区分两个不同的数字+0 和-0，还会把两个 NaN 看成不相等的。

#### 2.4.2 Object.prototype.hasOwnProperty()

hasOwnProperty 方法用于检测参数是否在当前 object 中

```ts
!!('thumbUp' in data);
data.hasOwnProperty('thumbUp');
// true or false
```

#### 2.4.2 Object.prototype.keys()

```ts
!!('thumbUp' in data);
data.hasOwnProperty('thumbUp');
// true or false
```

另外，`Object.keys() `的返回并不总能保持先来后到的顺序。从解决业务需要的角度，我们可以通过维护一个单独的 tag 数组来回避这个问题。

### 2.5 Array API

#### 2.5.1 Array.prototype.some()

some() 方法用于检测数组中的元素是否满足指定条件（函数提供）。some() 方法会依次执行数组的每个元素：`如果有一个元素满足条件，则表达式返回 true` , 剩余的元素不会再执行检测。 如果没有满足条件的元素，则返回 `false`。

```ts
// 用法
const res = data.some((e) => e.user.id === currentUser.id);
```

#### 2.5.2 Array.prototype.find()

find() 方法用于检测数组中的元素是否满足指定条件（函数提供）。find() 方法会依次执行数组的每个元素：`表达式返回元素满足所有条件的索引项` 。 如果没有满足条件的元素，则返回 `undefined`.

```ts
/*
@!currentValue  当前元素
@?index  当前元素的索引值
@?arr  当前元素所属的数组对象
*/
array.find(function(currentValue, index, arr),thisValue)
// 用法
const res = data.find((e) => e.user.id === currentUser.id);
```

#### 2.5.3 foreach、map、filter

- forEach(): 针对每一个元素执行提供的函数。除了抛出异常以外，没有办法中止或跳出 forEach() 循环。如果你需要中止或跳出循环，forEach() 方法不是应当使用的工具。
- map(): 创建一个新的数组，其中每一个元素由调用数组中的每一个元素执行提供的函数得来。
- filter(): 用于过滤序列，过滤掉不符合条件的元素，返回由符合条件元素组成的新列表。

都可以用索引修改原数组

```ts
const array = [12, 24, 27, 23, 26];
const res = array.map((item, index, arr) => item * 10);
console.log(res); // [120,240,270,230,260]
console.log(array); // [12,24,27,23,26]不变

const res = array.forEach((item, index, arr) => (arr[index] = item * 10));
console.log(res); // undefined
console.log(array); // [120,240,270,230,260]原数组修改为索引变动后

const res = array.filter((item, index, arr) => item > 20);
console.log(res); // [ 24, 27, 23, 26 ]
console.log(array); // [ 12, 24, 27, 23, 26 ] 原数组不变
```
