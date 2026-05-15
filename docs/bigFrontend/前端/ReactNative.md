---
order: 6
---

# React Native

## 1.React Native 是什么

React Native（简称 RN）是 Facebook 开源的一套跨端开发方案，使用 JavaScript / TypeScript + React 来开发移动端应用，最终渲染出来的不是浏览器 DOM，而是 iOS / Android 的原生组件。

它的核心目标有两个：

1. 提升跨平台开发效率
2. 在保证开发体验的前提下，尽量接近原生体验

RN 并不是写一套代码生成 Web 页面，而是：

- React 负责声明式 UI
- JS 负责业务逻辑
- Native 负责真正的视图渲染与系统能力

## 2.React Native 与 React 的区别

React Native 本质上仍然是 React 思想，只是运行平台和渲染目标不同。

### 2.1 相同点

- 都使用组件化思想
- 都使用 JSX
- 都有 state、props、hooks、context 等概念
- 都遵循单向数据流
- 都支持函数组件与副作用管理

### 2.2 不同点

1. 渲染目标不同

- React DOM：渲染到浏览器 DOM
- React Native：渲染到原生控件

2. 标签不同

RN 中没有：

- div
- span
- p
- img
- button

取而代之的是：

- `View`
- `Text`
- `Image`
- `Pressable`
- `ScrollView`
- `TextInput`

3. 样式系统不同

RN 使用 JS 对象写样式，不是传统 CSS。

4. 路由机制不同

Web 常用：

- react-router
- history
- hash

RN 常用：

- React Navigation
- Native Stack
- Bottom Tabs
- Drawer

5. 平台能力不同

RN 可以直接调用：

- 相机
- 蓝牙
- 定位
- 存储
- 推送
- 文件系统

## 3.React Native 的架构理解

RN 的经典架构可以简单理解为三层：

1. JS 线程
2. Bridge / JSI 通信层
3. Native 渲染层

### 3.1 旧架构

旧架构里 JS 和 Native 之间通过 Bridge 做异步通信。

特点：

- JS 与 Native 不共享内存
- 通信需要序列化 / 反序列化
- 高频通信场景容易有性能瓶颈

典型问题：

- 动画卡顿
- 大量列表更新时通信成本高
- 复杂模块桥接成本大

### 3.2 新架构

RN 新架构主要包括：

- JSI
- TurboModules
- Fabric

#### JSI

JSI（JavaScript Interface）让 JS 可以更高效地与 C++ / Native 交互，不再完全依赖传统 Bridge。

#### TurboModules

新的 Native Module 体系，支持按需加载，减少初始化开销。

#### Fabric

新的渲染系统，使布局、渲染和事件处理更高效。

### 3.3 为什么新架构重要

新架构的本质目标是：

- 降低 Bridge 瓶颈
- 提升渲染性能
- 优化启动速度
- 提升复杂交互能力

## 4.React Native 的运行机制

RN 项目启动时，通常会经历这些步骤：

1. App 启动原生容器
2. 加载 JS Bundle
3. 执行 React 代码
4. 生成组件树
5. 将组件描述交给 Native 渲染
6. 用户事件回传给 JS 层处理

也就是说：

- UI 描述写在 JS
- UI 实际展示靠 Native
- 用户操作最终还会回到 JS 逻辑层

## 5.React Native 常用基础组件

### 5.1 View

RN 里的基础布局容器，类似 Web 里的 `div`。

```ts
import { View } from 'react-native';

export default function Demo() {
  return <View />;
}
```

### 5.2 Text

所有文本都必须放在 `Text` 组件中。

```ts
import { Text } from 'react-native';

export default function Demo() {
  return <Text>Hello RN</Text>;
}
```

注意：RN 里不能像 Web 一样直接在 `View` 中裸写文本。

### 5.3 Image

用于展示图片，支持本地资源和远程资源。

```ts
<Image source={{ uri: 'https://xxx.com/a.png' }} style={{ width: 100, height: 100 }} />
```

### 5.4 TextInput

输入框组件。

```ts
<TextInput value={value} onChangeText={setValue} placeholder="请输入内容" />
```

### 5.5 ScrollView

滚动容器，适合内容量不大的场景。

### 5.6 FlatList

高性能列表组件，适合长列表。

### 5.7 Pressable / Touchable

处理点击、按压、长按等交互。

现代项目更推荐 `Pressable`。

## 6.React Native 样式系统

RN 的样式不是 CSS 文件，而是 JS 对象。

```ts
const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
};
```

### 6.1 常见特点

1. 属性名使用小驼峰

- `background-color` -> `backgroundColor`
- `font-size` -> `fontSize`

2. 大部分尺寸默认是无单位数值

```ts
{
  width: 100,
}
```

3. 不支持完整 CSS 语法

比如：

- 不支持复杂选择器
- 不支持伪类
- 不支持层级选择
- 不支持直接写媒体查询

### 6.2 StyleSheet

RN 推荐使用 `StyleSheet.create` 管理样式。

```ts
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
});
```

优点：

- 可读性更好
- 便于复用
- 更符合 RN 生态习惯

### 6.3 样式优先级

RN 可以通过数组合并样式，后面的优先级更高。

```ts
<View style={[styles.box, active && styles.active]} />
```

## 7.Flex 布局

RN 的布局核心几乎都是 Flex。

### 7.1 与 Web 的一个关键差异

Web 中默认：

- `flex-direction: row`

RN 中默认：

- `flexDirection: 'column'`

这点非常容易写错。

### 7.2 常见属性

- `flex`
- `flexDirection`
- `justifyContent`
- `alignItems`
- `alignSelf`
- `flexWrap`

```ts
<View
  style={{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }}
/>
```

### 7.3 flex: 1 的含义

在 RN 中 `flex: 1` 经常表示：

- 占满父容器剩余空间

页面根节点一般都会加上：

```ts
{
  flex: 1;
}
```

否则很容易出现布局塌陷或高度异常。

## 8.尺寸适配

移动端适配是 RN 的核心问题之一。

### 8.1 常见适配方式

1. 百分比布局
2. flex 布局
3. 根据屏幕宽高做比例换算
4. 根据 PixelRatio 做像素处理
5. 使用安全区适配刘海屏 / 底部横条

### 8.2 Dimensions

获取屏幕宽高：

```ts
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
```

### 8.3 PixelRatio

用于处理设备像素密度。

```ts
import { PixelRatio } from 'react-native';

const ratio = PixelRatio.get();
```

### 8.4 SafeAreaView

用于处理 iPhone 刘海屏、安全区域问题。

```ts
import { SafeAreaView } from 'react-native';

<SafeAreaView style={{ flex: 1 }} />;
```

## 9.平台差异处理

RN 是跨平台，但并不代表完全没有平台差异。

常见差异：

- 状态栏样式
- 阴影实现
- 返回键行为
- 字体渲染
- 权限模型
- 滚动表现

### 9.1 Platform 模块

```ts
import { Platform } from 'react-native';

const styles = {
  paddingTop: Platform.OS === 'ios' ? 20 : 0,
};
```

### 9.2 平台文件拆分

RN 支持：

- `index.ios.tsx`
- `index.android.tsx`

这样可以对不同平台实现不同逻辑。

## 10.事件系统

RN 的事件和 Web 类似，但事件对象、组件能力不完全相同。

常见事件：

- `onPress`
- `onLongPress`
- `onChangeText`
- `onScroll`
- `onLayout`

```ts
<Pressable onPress={() => console.log('click')}>
  <Text>按钮</Text>
</Pressable>
```

### 10.1 onLayout

用于拿到组件布局信息。

```ts
<View
  onLayout={(e) => {
    console.log(e.nativeEvent.layout);
  }}
/>
```

可以获取：

- x
- y
- width
- height

## 11.状态管理

RN 的状态管理和 React 本身一致。

### 11.1 小型项目

一般使用：

- `useState`
- `useReducer`
- `Context`

### 11.2 中大型项目

一般使用：

- Redux Toolkit
- Zustand
- MobX
- Jotai

### 11.3 状态管理注意点

RN 中除了业务状态，还经常要管理：

- 页面焦点状态
- App 前后台状态
- 网络状态
- 权限状态
- 离线缓存状态

## 12.导航

RN 不像 Web 那样基于浏览器地址栏做路由，通常使用导航库管理页面栈。

最常见的是 React Navigation。

### 12.1 常见导航模式

1. Stack

- 页面入栈出栈
- 适合详情页流转

2. Bottom Tabs

- 底部标签页
- 适合主框架切换

3. Drawer

- 抽屉导航

### 12.2 典型结构

```ts
BottomTabs
  ├── HomeStack
  │   ├── Home
  │   └── Detail
  ├── ProfileStack
  └── SettingStack
```

### 12.3 导航参数

RN 页面跳转常常会传参。

```ts
navigation.navigate('Detail', { id: 1 });
```

接收参数：

```ts
route.params.id;
```

## 13.网络请求

RN 可以直接使用：

- `fetch`
- `axios`

本质与浏览器 JS 请求类似，但运行环境不是浏览器。

### 13.1 常见问题

1. 请求超时处理
2. token 刷新
3. 弱网处理
4. 重试机制
5. 离线缓存
6. 大文件上传下载

### 13.2 请求封装建议

一般会封装：

- baseURL
- 公共 header
- 错误码处理
- 登录失效处理
- loading 状态管理
- 请求取消

## 14.本地存储

RN 没有浏览器的 localStorage 概念，需要使用移动端存储方案。

常见方案：

- AsyncStorage
- MMKV
- SQLite
- WatermelonDB

### 14.1 AsyncStorage

适合轻量级 key-value 存储。

适用场景：

- token
- 用户偏好
- 缓存配置
- 首次启动标记

### 14.2 MMKV

性能通常更好，很多项目用来替代 AsyncStorage。

## 15.原生能力调用

RN 的价值之一，就是可以调用原生系统能力。

常见能力：

- 相机
- 相册
- 定位
- 蓝牙
- 通讯录
- 日历
- 文件选择
- 推送
- 生物识别

### 15.1 Native Module

RN 中调用原生能力，常见方式是：

- 直接使用社区库
- 自己封装 Native Module

### 15.2 使用场景

当 JS 无法满足需求时，就需要原生扩展，例如：

- 高性能图片处理
- 音视频采集与编解码
- 蓝牙 / NFC
- 原生 SDK 集成

## 16.RN 与 WebView

RN 本身是原生渲染，不等于 H5 容器。

但 RN 也可以嵌入 WebView。

### 16.1 什么时候用 WebView

1. 已有成熟 H5 页面
2. 活动页迭代快
3. 富文本内容复杂
4. 某些功能只需轻量接入

### 16.2 RN + WebView 的问题

- 性能不如原生组件
- 通信链路更复杂
- 调试成本更高
- 页面状态同步更麻烦

### 16.3 JSBridge

RN 与 WebView 间常常需要通信。

比如：

- H5 通知 RN 跳转页面
- RN 通知 H5 更新用户信息
- H5 调起原生支付 / 登录 / 分享

## 17.生命周期与 AppState

React 层面仍然使用：

- `useEffect`
- 卸载清理

但移动端还会关心 App 前后台切换。

### 17.1 AppState

```ts
import { AppState } from 'react-native';
```

常见状态：

- `active`
- `background`
- `inactive`

### 17.2 典型场景

- 页面切后台暂停轮询
- 切回前台刷新数据
- 上报停留时长
- 重新校验权限 / 登录状态

## 18.性能优化

RN 性能优化一般从渲染、通信、资源、列表四个方面入手。

### 18.1 减少无效渲染

- 合理拆组件
- `React.memo`
- `useMemo`
- `useCallback`
- 避免频繁创建大对象

### 18.2 长列表优化

优先使用：

- `FlatList`
- `SectionList`

避免：

- 长列表直接用 `ScrollView`

常见优化项：

- `keyExtractor`
- `getItemLayout`
- `initialNumToRender`
- `windowSize`
- `removeClippedSubviews`

### 18.3 图片优化

- 控制图片尺寸
- 使用合适格式
- 懒加载
- 占位图
- 缓存策略

### 18.4 动画优化

复杂动画尽量避免频繁走 JS 线程。

常见方案：

- `Animated`
- `react-native-reanimated`
- `react-native-gesture-handler`

### 18.5 Bridge 通信优化

旧架构下，JS 与 Native 的高频通信容易造成性能损耗。

所以要尽量避免：

- 高频 setState
- 高频测量布局
- 高频原生调用

## 19.RN 中的动画

### 19.1 Animated

RN 自带动画库。

常见能力：

- timing
- spring
- decay
- interpolation

### 19.2 Reanimated

复杂动效项目更常用 Reanimated。

优点：

- 性能更好
- 更适合手势 + 动画联动
- 更适合复杂转场

### 19.3 Gesture Handler

配合手势库实现：

- 拖拽
- 滑动返回
- 下拉刷新
- 卡片交互

## 20.RN 中的调试方案

常见调试方式：

- console
- React DevTools
- Flipper
- Xcode / Android Studio 日志
- 网络抓包

### 20.1 常见问题排查思路

1. 是 JS 层问题还是 Native 层问题
2. 是布局问题还是业务状态问题
3. 是 iOS 独有还是 Android 独有
4. 是开发环境特有还是生产环境也存在

## 21.RN 中常见坑

### 21.1 View 中不能直接写文本

```ts
<View>
  <Text>hello</Text>
</View>
```

### 21.2 默认布局方向是 column

这和 Web 很不一样。

### 21.3 样式不是 CSS

不能直接套浏览器思维。

### 21.4 列表不要滥用 ScrollView

长列表必须优先考虑虚拟列表。

### 21.5 Android / iOS 行为不完全一致

尤其在：

- 阴影
- 字体
- 返回键
- 权限
- 弹窗
- 键盘弹起

### 21.6 键盘遮挡问题

表单页非常常见，需要处理：

- `KeyboardAvoidingView`
- 滚动定位
- 输入框聚焦滚动

### 21.7 线上包体积问题

RN 业务增长后，包体积、图片资源、三方 SDK 都可能导致安装包过大。

## 22.React Native 与 Flutter / 小程序 / H5 的对比

### 22.1 RN 与 Flutter

RN：

- JS / TS 生态更友好
- React 思想迁移成本低
- 原生桥接更常见

Flutter：

- 自绘渲染一致性更强
- 动画能力强
- Dart 学习成本更高

### 22.2 RN 与 H5

RN：

- 接近原生体验
- 可直接调系统能力
- 发布流程更偏客户端

H5：

- 发布快
- 跨端成本低
- 性能和系统能力受限

### 22.3 RN 与小程序

小程序：

- 依附平台生态
- 上线成本低
- 平台限制多

RN：

- 更像真正意义上的 App
- 自主能力更强
- 工程复杂度更高

## 23.项目实践中的工程化建议

### 23.1 目录设计

一般建议按业务模块拆分：

```bash
src/
  api/
  components/
  hooks/
  navigation/
  pages/
  store/
  utils/
  services/
  constants/
```

### 23.2 类型管理

RN 项目非常建议使用 TypeScript。

重点类型：

- 组件 props
- 导航参数
- 接口数据结构
- 状态管理类型
- Native Module 类型

### 23.3 环境管理

至少拆分：

- dev
- test
- prod

### 23.4 日志与埋点

移动端比 Web 更依赖埋点与日志监控。

建议做好：

- 页面曝光
- 点击埋点
- 崩溃监控
- 性能监控
- 网络异常监控

## 24.React Native 面试题

### 24.1 RN 和 React 的区别是什么

重点回答：

- 渲染目标不同
- 组件体系不同
- 样式系统不同
- 导航方式不同
- 平台能力不同

### 24.2 RN 为什么会有性能问题

重点回答：

- JS 线程阻塞
- Bridge 通信成本高
- 长列表渲染不当
- 动画执行在 JS 线程
- 频繁 setState 和重渲染

### 24.3 ScrollView 和 FlatList 的区别

- `ScrollView` 适合少量内容，全部渲染
- `FlatList` 适合长列表，支持虚拟化

### 24.4 RN 如何和原生通信

- Native Modules
- TurboModules
- JSI
- WebView 场景下可通过 postMessage / injectJavaScript

### 24.5 RN 适合什么业务

适合：

- 中后台移动端应用
- 电商、内容、工具类 App
- 已有 React 团队，希望快速扩展移动端

不太适合：

- 重度音视频底层场景
- 大量 3D 图形渲染
- 极致性能要求且大量依赖原生 SDK 的复杂场景

## 25.总结

React Native 的核心价值是：

1. 用 React 思维开发移动端
2. 使用一套业务逻辑覆盖多个平台
3. 在效率与性能之间做工程化平衡

理解 RN，重点不是只会写几个组件，而是要真正理解：

- 它不是 Web
- 它也不是纯原生
- 它是 React + Native 渲染 + 跨端工程化的结合体

如果是面试或实际工作，建议重点掌握下面这些内容：

- RN 基础组件
- Flex 布局
- 导航方案
- Native 通信
- 列表优化
- 动画与手势
- 平台差异处理
- 性能优化
- 工程化拆分
