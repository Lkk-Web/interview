---
order: 3
---

# Mermaid 语法

Mermaid 是一种基于 JavaScript 的图表工具，通过类似 Markdown 的文本语法来生成图表。

在 Markdown 中使用 ` ```mermaid ` 代码块即可渲染图表。

## 一、流程图（Flowchart）

流程图用于描述流程、决策和步骤。

### 1. 方向

```text
TB / TD  从上到下
BT       从下到上
LR       从左到右
RL       从右到左
```

### 2. 节点形状

```text
id[矩形]
id(圆角矩形)
id((圆形))
id{菱形}
id>不对称]
id[(数据库)]
```

### 3. 连线类型

```text
A --> B        带箭头实线
A --- B        无箭头实线
A -.-> B       带箭头虚线
A ==> B        粗实线箭头
A -->|文字| B  带标签箭头
```

### 4. 子图

```text
subgraph 子图名称
    节点定义
end
```

结合子图、多种节点形状、标签与样式，描述 CI/CD 流程：

<code src="../components/mermaid/FlowChart.tsx"></code>

## 二、时序图（Sequence Diagram）

时序图描述对象之间的交互顺序。

### 1. 基本语法

```text
participant 参与者
actor 参与者（人形图标）
A->>B: 消息          实线箭头
A-->>B: 消息         虚线箭头
Note over A,B: 注释
alt 条件 / else / end
loop 循环名 / end
```

结合 actor、Note、alt/else、loop，描述完整登录与 Token 刷新流程：

<code src="../components/mermaid/SequenceDiagram.tsx"></code>

## 三、类图（Class Diagram）

类图用于描述面向对象的类结构和关系。

### 1. 类定义

```text
class 类名 {
    <<interface>>        接口标注
    +公有属性: 类型
    -私有属性: 类型
    #保护属性: 类型
    +公有方法(): 返回类型
}
```

### 2. 关系类型

```text
A --|> B    继承
A ..|> B    实现接口
A --> B     关联
A --* B     组合
A --o B     聚合
```

结合接口实现、继承、组合、关联，描述支付系统类结构：

<code src="../components/mermaid/ClassDiagram.tsx"></code>

## 四、状态图（State Diagram）

状态图描述系统在不同状态之间的转换。

### 1. 基本语法

```text
[*]              初始/终止状态
A --> B: 条件    状态转换
state A {        嵌套状态
    [*] --> B
}
```

结合嵌套状态，描述订单完整生命周期：

<code src="../components/mermaid/StateDiagram.tsx"></code>

## 五、甘特图（Gantt）

甘特图用于项目进度管理。

```text
title 标题
dateFormat YYYY-MM-DD
section 阶段名
任务名: 状态, 开始日期, 结束日期
```

状态：`done`（完成）、`active`（进行中）、`crit`（关键路径）

<code src="../components/mermaid/GanttChart.tsx"></code>

## 六、饼图（Pie Chart）

```text
pie title 标题
    "标签" : 数值
```

<code src="../components/mermaid/PieChart.tsx"></code>

## 七、思维导图（Mindmap）

```text
mindmap
  root((根节点))
    一级节点
      二级节点
```

<code src="../components/mermaid/Mindmap.tsx"></code>

## 八、常用技巧

### 注释

```text
%% 这是注释
```

### 样式

```text
style 节点id fill:#颜色,stroke:#颜色,color:#颜色
classDef 类名 fill:#颜色
class 节点id 类名
```

结合 `classDef` 批量样式与子图：

<code src="../components/mermaid/StyleDemo.tsx"></code>
