---
order: 4
---

# Jest 框架

Jest 是 Facebook 出品的一个 JavaScript 测试框架，相对其他测试框架，其一大特点是内置了常用的测试工具，比如断言、Mock、测试覆盖率、快照测试等，基本可以做到开箱即用。Jest 常用于单元测试、异步函数测试、模块测试、React 组件测试等场景。

## 一、基本使用

安装：

```bash
npm install --save-dev jest
```

在 `package.json` 中添加脚本：

```json
{
  "scripts": {
    "test": "jest"
  }
}
```

示例：

```js
// sum.js
function sum(a, b) {
  return a + b;
}

module.exports = sum;
```

```js
// sum.test.js
const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```

执行测试：

```bash
npm test
```

## 二、test、it、describe

`test` 和 `it` 都是定义一个测试用例，两者功能基本一致。`describe` 用来对一组相关测试进行分组。

```js
describe('math function', () => {
  test('add', () => {
    expect(1 + 2).toBe(3);
  });

  it('minus', () => {
    expect(3 - 1).toBe(2);
  });
});
```

## 三、expect 和常用匹配器

`expect` 用来创建断言，后面接匹配器判断实际结果是否符合预期。

### 3.1 基础类型

```js
expect(1 + 1).toBe(2);
expect('Jest').toBe('Jest');
expect(true).toBeTruthy();
expect(false).toBeFalsy();
expect(null).toBeNull();
expect(undefined).toBeUndefined();
```

`toBe` 使用 `Object.is` 比较，适合基本数据类型或者判断两个引用是否为同一个对象。

### 3.2 对象和数组

```js
expect({ name: 'Tom' }).toEqual({ name: 'Tom' });
expect([1, 2, 3]).toEqual([1, 2, 3]);
expect(['js', 'css']).toContain('js');
```

对象、数组一般使用 `toEqual`，因为它比较的是值是否递归相等。

### 3.3 数字和字符串

```js
expect(10).toBeGreaterThan(5);
expect(10).toBeLessThan(20);
expect(10).toBeGreaterThanOrEqual(10);
expect('hello jest').toMatch(/jest/);
```

### 3.4 异常

```js
function throwError() {
  throw new Error('error');
}

test('throw error', () => {
  expect(() => throwError()).toThrow('error');
});
```

测试异常时需要传入一个函数：

```js
expect(() => fn()).toThrow();
```

如果直接执行 `fn()`，异常会在断言之前抛出。

## 四、异步测试

### 4.1 Promise

```js
function fetchData() {
  return Promise.resolve('data');
}

test('fetch data', () => {
  return fetchData().then((data) => {
    expect(data).toBe('data');
  });
});
```

使用 Promise 测试时，需要 `return` 这个 Promise，否则 Jest 不会等待异步执行完成。

### 4.2 async/await

```js
test('fetch data by async await', async () => {
  const data = await fetchData();
  expect(data).toBe('data');
});
```

### 4.3 resolves 和 rejects

```js
function fetchSuccess() {
  return Promise.resolve('success');
}

function fetchError() {
  return Promise.reject(new Error('failed'));
}

test('resolve data', async () => {
  await expect(fetchSuccess()).resolves.toBe('success');
});

test('reject error', async () => {
  await expect(fetchError()).rejects.toThrow('failed');
});
```

## 五、生命周期钩子

Jest 提供了测试前后执行的钩子函数。

```js
beforeAll(() => {
  // 所有测试开始前执行一次
});

afterAll(() => {
  // 所有测试结束后执行一次
});

beforeEach(() => {
  // 每个测试开始前执行一次
});

afterEach(() => {
  // 每个测试结束后执行一次
});
```

常见用途：

1. 初始化测试数据
2. 清理副作用
3. 重置 Mock
4. 建立和关闭数据库连接

## 六、Mock 函数

Mock 函数用于模拟函数调用，常见于测试回调函数、接口请求、依赖模块等场景。

```js
const mockFn = jest.fn();

mockFn('hello');

expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledTimes(1);
expect(mockFn).toHaveBeenCalledWith('hello');
```

### 6.1 mockReturnValue

```js
const mockFn = jest.fn();

mockFn.mockReturnValue('mock data');

expect(mockFn()).toBe('mock data');
```

### 6.2 mockResolvedValue

```js
const mockFn = jest.fn();

mockFn.mockResolvedValue({ name: 'Tom' });

test('mock async function', async () => {
  const user = await mockFn();
  expect(user.name).toBe('Tom');
});
```

### 6.3 mockImplementation

```js
const mockFn = jest.fn((a, b) => a + b);

expect(mockFn(1, 2)).toBe(3);

mockFn.mockImplementation((a, b) => a * b);

expect(mockFn(2, 3)).toBe(6);
```

## 七、Mock 模块

当被测试代码依赖外部模块时，可以使用 `jest.mock` 替换真实模块。

```js
// api.js
function getUser() {
  return fetch('/user').then((res) => res.json());
}

module.exports = { getUser };
```

```js
// user.js
const { getUser } = require('./api');

async function getUserName() {
  const user = await getUser();
  return user.name;
}

module.exports = { getUserName };
```

```js
// user.test.js
jest.mock('./api', () => ({
  getUser: jest.fn(),
}));

const { getUser } = require('./api');
const { getUserName } = require('./user');

test('get user name', async () => {
  getUser.mockResolvedValue({ name: 'Tom' });

  const name = await getUserName();

  expect(name).toBe('Tom');
  expect(getUser).toHaveBeenCalledTimes(1);
});
```

## 八、定时器测试

对于 `setTimeout`、`setInterval` 这类定时器，可以使用 Jest 的假定时器控制时间流逝。

```js
function delay(callback) {
  setTimeout(() => {
    callback('done');
  }, 1000);
}

test('delay callback', () => {
  jest.useFakeTimers();

  const callback = jest.fn();
  delay(callback);

  expect(callback).not.toHaveBeenCalled();

  jest.advanceTimersByTime(1000);

  expect(callback).toHaveBeenCalledWith('done');

  jest.useRealTimers();
});
```

## 九、快照测试

快照测试用于保存某次输出结果，后续测试会将新结果和旧快照比较，常用于组件渲染结果测试。

```js
test('snapshot', () => {
  const user = {
    name: 'Tom',
    age: 18,
  };

  expect(user).toMatchSnapshot();
});
```

第一次执行时会生成快照文件，之后如果输出发生变化，测试会失败。若变化符合预期，可以更新快照：

```bash
jest -u
```

## 十、测试覆盖率

覆盖率可以用来观察代码被测试覆盖的程度。

```bash
npx jest --coverage
```

常见覆盖率指标：

1. `Statements`：语句覆盖率
2. `Branches`：分支覆盖率
3. `Functions`：函数覆盖率
4. `Lines`：行覆盖率

## 十一、常见面试点

1. `toBe` 和 `toEqual` 的区别？
   - `toBe` 使用 `Object.is` 比较，适合基本类型或判断同一个引用
   - `toEqual` 递归比较对象或数组的值

2. Jest 如何测试异步代码？
   - 返回 Promise
   - 使用 async/await
   - 使用 `resolves` / `rejects`

3. `jest.fn()` 的作用？
   - 创建 Mock 函数
   - 记录函数调用次数、调用参数、返回值
   - 模拟函数返回结果

4. `jest.mock()` 的作用？
   - 替换真实模块
   - 隔离外部依赖
   - 避免测试真实请求、真实数据库等副作用

5. 如何测试定时器？
   - 使用 `jest.useFakeTimers()` 开启假定时器
   - 使用 `jest.advanceTimersByTime()` 推进时间
   - 测试结束后使用 `jest.useRealTimers()` 恢复真实定时器

## 十二、完整示例

```js
// calculator.js
function divide(a, b) {
  if (b === 0) {
    throw new Error('除数不能为0');
  }

  return a / b;
}

function add(a, b) {
  return a + b;
}

module.exports = {
  add,
  divide,
};
```

```js
// calculator.test.js
const { add, divide } = require('./calculator');

describe('calculator', () => {
  test('add', () => {
    expect(add(1, 2)).toBe(3);
  });

  test('divide', () => {
    expect(divide(6, 2)).toBe(3);
  });

  test('divide zero', () => {
    expect(() => divide(6, 0)).toThrow('除数不能为0');
  });
});
```

学习 Jest 的重点不是 API 数量，而是理解测试思路：

1. 确定输入
2. 执行被测试函数
3. 断言输出
4. 隔离外部依赖
5. 清理测试副作用
