---
order: 2
toc: menu
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
