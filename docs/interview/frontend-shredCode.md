---
order: 2
---

# 前端手撕

## 一、数据操作

### 1.1 数组去重

秒过方案(只能对基本数据类型去重)：

```ts
const data = [1, 2, 3, { a: 1 }, { a: 1 }, 3, null, null, undefined];
const arr = [...new Set(data)] / Array.from(new Set(data));
// arr:  Set(7) { 1, 2, 3, { a: 1 }, { a: 1 }, null, undefined }
```

全量去重：

```ts
function unique(arr) {
  const obj = {};
  return arr.filter(function (item, index, arr) {
    return obj.hasOwnProperty(JSON.stringify(item) + item)
      ? false
      : (obj[JSON.stringify(item) + item] = true);
  });
}
var arr = [
  0,
  0,
  'true',
  'true',
  true,
  true,
  undefined,
  undefined,
  null,
  null,
  NaN,
  NaN,
  { a: { a: true } },
  { a: { a: true } },
  [{ a: true }],
  [{ a: true }],
];
console.log(unique(arr));
//[0,'true', true, undefined, null, NaN,{a: { a: true } },[{ a: true }]]   //所有的都去重了
```

### 1.2 数组扁平化

方法一：toString + split(只能实现纯基本数据类型)

```js
function flatten(arr) {
  return arr
    .toString()
    .split(',')
    .map((v) => +v);
}
```

方法二：some + concat(任何类型)

```js
function flatten(arr) {
  while (arr.some((item) => Array.isArray(item))) {
    arr = [].concat(...arr);
  }
  return arr;
}
```

优化：控制扁平层级

```ts
function flattenStage(arr: any[], stag: number) {
  let index = 0;
  while (arr.some((item) => Array.isArray(item)) && stag !== index) {
    arr = [].concat(...arr);
    index++;
  }
  return arr;
}
```

### 1.3 解析 URL

```js
function urlSearch(href) {
  const json = {};
  let str = decodeURI(href);
  const patrol = str.split('://');

  json['patrol'] = patrol[0];
  json['host'] = patrol[1].split('/')[0];

  let paramsArray = str.substring(str.indexOf('?') + 1).split('&');

  for (const params of paramsArray) {
    let index = params.indexOf('=');
    if (index > 0) {
      json[params.substring(0, index)] = params.substring(index + 1);
    }
  }
  return json;
}

const urlStr = 'https://pages.tmall.com/wow/hdwk/act/2020nhj-single?wh_biz=tm&disableNav=YES';
console.log(urlSearch(urlStr));
/*console
{
  patrol: 'https',
  host: 'pages.tmall.com',
  wh_biz: 'tm',
  disableNav: 'YES'
}
*/
```

## 二、原型链

### 2.1 手撕 instanceof

```js
const instanceofs = (L, R) => {
  if (typeof L !== 'object' || L === null) return false;
  while (L) {
    if (L.__proto__ == R.prototype) {
      return true;
    }
    L = L.__proto__;
  }
  return false;
};
car instanceof String; // true
instanceofs('car', String); // false
```

### 2.2 数据类型手撕

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

### 2.3 手撕 new 操作符

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

### 2.4 手撕 apply

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

### 2.5 手撕 call

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

### 2.6 手撕 bind

```js
Function.prototype.mybind = function (context, ...bindArgs) {
  const self = this;
  return function (...Args) {
    const finalArgs = bindArgs.concat(Args);
    return self.apply(context, finalArgs);
  };
};
```

## 三、工具类函数

### 3.1 手撕深拷贝

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

### 3.2 懒加载

```ts
//判断是否在可视区
const isInViewPort: () => boolean = (element) => {
  const viewWidth = window.innerWidth || document.documentElement.clientWidth;
  const viewHeight = window.innerHeight || document.documentElement.clientHeight;
  const { top, right, bottom, left } = element.getBoundingClientRect();

  return top >= 0 && left >= 0 && right <= viewWidth && bottom <= viewHeight;
};
```

### 3.3 手撕防抖

```ts
function debounce(fn: Function, delay: number) {
  // 初次触发定时器为null，后面产生一份定时器并记下定时器id
  let timer: number | null = null;
  // 闭包使定时器id逃逸
  return function () {
    let args = arguments;
    // 如果已有定时器id，则需要清除，重新开始延迟执行
    if (timer) {
      clearTimeout(timer);
      // 销毁定时器id，以便下次防抖函数触发
      timer = null;
    }
    // setTimeout 会生成定时器id
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
}
```

### 3.4 手撕节流

```js
function throttle(fn: any, wait: number) {
  let last: number;
  return function () {
    // Date.now 返回当前时间戳
    let now: number = Date.now();
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

### 3.5 lodash 的\_get 方法

```ts
// input
const obj = { 选择器: { to: { toutiao: 'FE Coder' } }, target: [1, 2, { name: 'byted' }] };
get(obj, '选择器.to.toutiao', 'target[0]', 'target[2].name');

// output
['FE coder', 1, 'byted'];
```

实现：

```ts
function get(object, ...path) {
  return path.map((item) => {
    let res = object;
    item
      .replace(/\[/g, '.')
      .replace(/\]/g, '')
      .split('.')
      .map((path) => (res = res && res[path]));
    return res;
  });
}
```

### 3.6 柯里化（curry）

当传入的参数数不足所需要的参数数时，返回一个可以传入剩余参数的高阶函数

```js
let add = function (a, b, c) {
  return a + b + c;
};

function curry(fn, ...items) {
  if (fn.length == items.length) fn(...items);
  return (...rests) => curry(fn, ...items, ...rests); //递归添加参数
}

let addCurry = curry(add);
console.log(
  addCurry(1)(2, 4), //7
  addCurry(9)(10)(10), //29
);
```

### 5.2 函数组合（compose）

组合函数，目的是将多个函数组合成一个函数

```js
function compose(...args: any[]) {
  return (subArgs: any) => {
    return args.reverse().reduce((acc, func, index) => func(acc), subArgs);
  };
}
```

### 5.3 函数管道（pipe）

`compose`执行是从右到左的。而管道函数，执行顺序是从左到右执行的

```js
function pipe(args: any[]) {
  return (subArgs) => {
    return args.reduce((acc, func, index) => func(acc), subArgs);
  };
}
```

## 四、设计模式

### 4.1 发布订阅模式

```javascript
// 公众号对象
let eventEmitter = {};

// 缓存列表，存放 event 及 fn
eventEmitter.list = {};

// 订阅
eventEmitter.on = function (event, fn) {
    let _this = this;
    // 如果对象中没有对应的 event 值，也就是说明没有订阅过，就给 event 创建个缓存列表
    // 如有对象中有相应的 event 值，把 fn 添加到对应 event 的缓存列表里
    (_this.list[event] || (_this.list[event] = [])).push(fn);
    return _this;
};

// 发布
eventEmitter.emit = function () {
    let _this = this;
    // 第一个参数是对应的 event 值，直接用数组的 shift 方法取出
    let event = [].shift.call(arguments),
    let fns = [..._this.list[event]];
    // 如果缓存列表里没有 fn 就返回 false
    if (!fns || fns.length === 0) {
        return false;
    }
    // 遍历 event 值对应的缓存列表，依次执行 fn
    fns.forEach(fn => {
        fn.apply(_this, arguments);
    });
    return _this;
};

function user1 (content) {
    console.log('用户1订阅了:', content);
};

function user2 (content) {
    console.log('用户2订阅了:', content);
};

// 订阅
eventEmitter.on('article', user1);
eventEmitter.on('article', user2);

// 发布
eventEmitter.emit('article', 'Javascript 发布-订阅模式');

/*
    用户1订阅了: Javascript 发布-订阅模式
    用户2订阅了: Javascript 发布-订阅模式
*/

```

### 4.2 观察者模式

## 五、异步

### 5.1 手撕 promise

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

### 5.2 手撕 promise.all

```ts
let p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(88);
  }, 1000);
});
let p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(99);
  }, 3000);
});

let arr = [p1, p2, 3, 4];

function myPromiseALL(array) {
  //返回的是一个Promise，直接用async包裹
  let result = [];
  let flag = 0;
  return new Promise((resolve, reject) => {
    for (let index in array) {
      if (array[index] instanceof Promise) {
        array[index].then(
          (res) => {
            result[index] = res;
            flag++;
            if (flag == array.length) {
              resolve(result);
            }
          },
          (err) => {
            reject(err);
          },
        );
      } else {
        result[index] = array[index];
        flag++;
        if (flag == array.length) {
          resolve(result);
        }
      }
    }
  });
}

Promise.myPromiseAll = myPromiseALL;
myPromiseALL(arr).then(
  (res) => {
    console.log(res, 'res');
  },
  (err) => {
    console.log(err, 'err');
  },
);
//[88,99,3,4] 'res'

//将p2改为reject
let p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(99);
  }, 3000);
});
//99 'err'
```

### 5.3 手撕 promise.race

```ts
let p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(88);
  }, 1000);
});
let p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(99);
  }, 2000);
});

let arr = [111, p1, p2];
function myPromiseRace(array) {
  return new Promise((resolve, reject) => {
    for (let item of array) {
      if (item instanceof Promise) {
        item.then(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          },
        );
      }
    }
  });
}
Promise.myPromiseRace = myPromiseRace;
myPromiseRace(arr).then(
  (res) => {
    console.log(res, 'res');
  },
  (err) => {
    console.log(err, 'err');
  },
);
```

### 5.4 手撕 promise.any

```ts
let p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(99);
  }, 1000);
});
let p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(88);
  }, 2000);
});

let arr = [111, p1, p2];
function myPromiseAny(array) {
  return new Promise((resolve, reject) => {
    for (let item of array) {
      if (item instanceof Promise) {
        item.then(
          (res) => {
            resolve(res);
          },
          (err) => {
            if (item == array[arr.length - 1]) reject('all promise were rejected');
          },
        );
      }
    }
  });
}
Promise.myPromiseRace = myPromiseAny;
myPromiseAny(arr).then(
  (res) => {
    console.log(res);
  },
  (err) => {
    console.log(err);
  },
);
```

### 5.5 手撕 promise.allSettle

```ts
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('123');
  }, 500);
});
const p2 = new Promise((resolve, reject) => {
  reject('456');
});
const p3 = new Promise((resolve, reject) => {
  resolve('789');
});

let arr = [Promise.resolve('resolve'), p1, 'abc', p2, p3, Promise.reject('error')];
Promise.allSettled = function (arr) {
  return new Promise((resolve) => {
    let count = 0; // 确保每个函数(宏任务)都要执行到
    const length = arr.length;
    const result = [];
    arr.forEach((promise, index) => {
      Promise.resolve(promise).then(
        (value) => {
          count++;
          result[index] = { status: 'fulfilled', value };
          if (count === length) resolve(result);
        },
        (reason) => {
          count++;
          result[index] = { status: 'rejected', reason };
          if (count === length) resolve(result);
        },
      );
    });
  });
};

Promise.allSettled(arr).then((res) => {
  console.log(res);
});
```

### 5.6 实现控制并发

```ts
/**
 * @param {number} limit 并发限制数
 * @param {(() => Promise<any>)[]} requestArr 包含所有请求的数组
 * @returns {Promise<any[]>} 结果数组
 */
async function concurrentControl(limit, requestArr) {
  const res = []; // 存储所有的异步任务
  const executing = []; // 存储正在执行的异步任务

  for (const request of requestArr) {
    res.push(request); // 保存新的异步任务
    if (limit < requestArr.length) {
      // then为异步(此时e为完成的任务request)，当任务完后，从 executing 中移除当前任务
      const e = request.then(
        () => executing.splice(executing.indexOf(e), 1),
        () => {
          executing.splice(executing.indexOf(e), 1);
        },
      );
      executing.push(e); // 增加当前异步任务 此时 e == request.then(fn)
      if (executing.length >= limit) {
        await Promise.race(executing); // 等待最快的任务执行完成
      }
    }
  }
  console.log('res: ', res);
  return res;
}

const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(1);
  }, [1000]);
});

const p2 = new Promise((resolve) => {
  setTimeout(() => {
    resolve(2);
  }, [2000]);
});

const p3 = new Promise((resolve) => {
  setTimeout(() => {
    resolve(3);
  }, [3000]);
});

concurrentControl(2, [p1, p2, p3, p1, p2, p3]);
```

```ts
p.then(() => executing.splice(executing.indexOf(e), 1));
// 这段代码其实等同于下面这样
const e = p.then(fn);
executing.push(e); // p resolve 后执行 fn
() => executing.splice(executing.indexOf(e), 1);
```

### 5.7 实现失败重试

```ts
async function retry(request, limit, times = 1) {
  try {
    const value = await request();
    console.log('获取成功');
    return value;
  } catch (error) {
    // 当超过最大重试次数时，就返回错误
    if (times > limit) error;
    console.log(`请求失败，第 ${times} 次重试...`);
    return retry(request, limit, ++times);
  }
}
```

### 5.8 超时中断

```js
// 本质上利用了闭包
let cancelToken = undefined;
const myPromise = new Promise((resolve, reject) => {
  let timeout = setTimeout(() => {
    resolve('promise resolved!');
  }, 3000);

  cancelToken = () => {
    clearTimeout(timeout);
    reject('promise rejected!');
  };
});

myPromise
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });

cancelToken();
```

## 六、React

### 6.1 手撕 setState
