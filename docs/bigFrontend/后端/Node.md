---
group:
  # title: '后端'
  order: 3
order: 1
---

# Node

## 1、洋葱圈模型

在 `koa` 中，中间件被 `next()` 方法分成了两部分。`next()` 方法上面部分会先执行，下面部门会在后续中间件执行全部结束之后再执行。

我们需要知道一个请求或者操作 `db` 的耗时是多少，而且想获取其他中间件的信息。在 `koa` 中，我们可以使用 `async await` 的方式结合洋葱模型做到。

```js
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const delta = new Date() - start;
  console.log(`请求耗时: ${delta} MS`);
  console.log('拿到上一次请求的结果：', ctx.state.baiduHTML);
});

app.use(async (ctx, next) => {
  // 处理 db 或者进行 HTTP 请求
  ctx.state.baiduHTML = await axios.get('http://baidu.com');
});
```
