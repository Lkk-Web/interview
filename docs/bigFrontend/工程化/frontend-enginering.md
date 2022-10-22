---
order: 1
---

# 前端工程化

模块化、组件化、规范化、自动化 4 个方面

**模块化**：

模块化就是把一个大的文件，拆分成多个相互依赖的小文件，按一个个模块来划分

**组件化**：

页面上所有的东西都可以看成组件，页面是个大型组件，可以拆成若干个中型组件，然后中型组件还可以再拆，拆成若干个小型组件

- 组件化 ≠ 模块化。模块化只是在文件层面上，对代码和资源的拆分；组件化是在设计层面上，对于 UI 的拆分
- 目前市场上的组件化的框架，主要的有 Vue，React，Angular2

**规范化**：

在项目规划初期制定的好坏对于后期的开发有一定影响。包括的规范有

- 目录结构的制定
- 编码规范
- 前后端接口规范
- 文档规范
- 组件管理
- Git 分支管理
- Commit 描述规范
- 定期 codeReview
- 视觉图标规范

**自动化**：

也就是简单重复的工作交给机器来做，自动化也就是有很多自动化工具代替我们来完成，例如持续集成、自动化构建、自动化部署、自动化测试等等

## 1、设计模式

### 1.观察者模式

### 2.发布-订阅模式

发布-订阅模式其实是一种对象间一对多的依赖关系，当一个对象的状态发送改变时，所有依赖于它的对象都将得到状态改变的通知。

订阅者（Subscriber）把自己想订阅的事件注册（Subscribe）到调度中心（Event Channel），当发布者（Publisher）发布该事件（Publish Event）到调度中心，也就是该事件触发时，由调度中心统一调度（Fire Event）订阅者注册到调度中心的处理代码。

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

## 2、TDD(测试驱动开发)

它要求在编写某个功能的代码之前先编写好测试代码，然后只编写使测试通过的功能代码，通过测试来推动整个开发的进行。这有助于编写简洁可用和高质量的代码，并加速开发过程。

#### 测试驱动开发的优缺点

从以上的 TDD 周期图中也可以看出，测试驱动开发最大的优点就是重构了，不断迭代，不断地对现有代码进行重构，不断优化代码的内部结构，最终实现对整体代码的改进。以此不断减少一些设计冗余、代码冗余、接口复杂度等等。

另外，对于一些前期需求不明确，甚至需求信息量特别少，且后期又会有大量业务功能修改时，传统的开发模式需要加班加点以此赶工开发，测试，缺陷修复，人工、时间成本且不说，最重要的产品质量也无法得到保证。当然 ，这种模式下也最适合采用原型法、敏捷开发模式了，毕竟拥抱变化是敏捷的宗旨 。而测试驱动开发也是敏捷开发模式的基础，这样无论是来自客户的紧急需求还是项目团队的一次技术改革，都可以通过重构设计、增加测试脚本来实现了。

## 3、CICD

CICD 是 持续集成（Continuous Integration）和持续部署（Continuous Deployment）简称。指在开发过程中自动执行一系列脚本来减低开发引入 bug 的概率，在新代码从开发到部署的过程中，尽量减少人工的介入。
