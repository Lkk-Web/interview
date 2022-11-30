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

## 二、原型链

### 2.1 手撕 instanceof

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

### 2.5 手撕 call

### 2.6 手撕 bind

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

## 四、设计模式

### 4.1 发布订阅模式

### 4.2 观察者模式

## 五、异步

### 5.1 手撕 promise

### 5.2 手撕 promise.all

### 5.3 手撕 promise.race

### 5.4 手撕 promise.any

### 5.5 手撕 promise.allSettle

### 5.6 实现控制并发

### 5.7 实现失败重试

## 六、React

### 6.1 手撕 setState
