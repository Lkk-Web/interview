# MarkDown 使用技巧

## 一、常用快捷键

- 加粗： `Ctrl + B`
- 撤销： `Ctrl + Z`
- 字体倾斜 ：`Ctrl+I`
- 下划线：`Ctrl+U`
- 多级标题： `Ctrl + 1~6`
- 有序列表：`Ctrl + Shift + [`
- 无序列表：`Ctrl + Shift + ]`
- 降级快捷键 ：`Tab`
- 升级快捷键：`Shift + Tab`
- 插入链接： `Ctrl + K`
- 插入公式： `Ctrl + Shift + M`
- 行内代码： `Ctrl + Shift + K`
- 插入图片： `Ctrl + Shift + I`
- 返回 Typora 顶部：`Ctrl+Home`
- 返回 Typora 底部 ：`Ctrl+End`
- 创建表格 ：`Ctrl+T`
- 选中某句话 ：`Ctrl+L`
- 选中某个单词 ：`Ctrl+D`
- 选中相同格式的文字 ：`Ctrl+E`
- 搜索: `Ctrl+F`
- 搜索并替换 ：`Ctrl+H`
- 删除线 ：`Alt+Shift+5`
- 引用 ：`Ctrl+Shift+Q`
- 生成目录：`[TOC]+Enter`

注：一些实体符号需要在实体符号之前加” \ ”才能够显示

## 二、数学式

$$


$$

打开 Typora 选择数学模块

- 点击“段落”—>“公式块”
- 快捷键 Ctrl+Shift+m
- `“$$”+回车`

以上三种方式都能打开数学公式的编辑栏。

示例：

```text
输入$，然后按ESC键，之后输入Tex命令，可预览
例如：
$\lim_{x\to\infty}\exp(-x)=0$
```

![img](https://pic2.zhimg.com/80/v2-c0139796d5848b706c9f2f4d79c7a749_720w.png)

下标使用~~括住内容。需要自己在偏好设置里面打开这项功能

```text
H~2~O
```

H~2~O

上标

使用^括住内容。需要自己在偏好设置里面打开这项功能

```text
y^2^=4
```

y^2^=4

## 三、其他

### 1.表情

Typora 语法支持添加 emoji 表情，输入不同的符号码（两个冒号包围的字符）可以显示出不同的表情。

```text
以:开始，然后输入表情的英文单词,以：结尾，将直接输入该表情.例如：
:smile
:cry
:happy
```

### 2.分割线

输入 `***` 或者 `---`,按换行键换行，即可绘制一条水平线。

```text
***---
```

---

### 3.引用

开头>表示，空格+文字，按换行键换行，双按换行跳出

```text
> 引注1
> ···
> 引注2
>还有一行，双按换行键跳出引注模式
```

示例：

> 引注 1 ··· 引注 2 还有一行，双按换行键跳出引注模式

普通引用

> 空格 + 引用文字：在引用的文字前加>+空格即可，引用可以嵌套。

```text
> 引用文本前使用 [大于号+空格]
> 这行可以不加，新起一行都要加上哦
>这是引用的内容
>>这是引用的内容
```

示例：

> 引用文本前使用 [大于号+空格]这行可以不加，新起一行都要加上哦这是引用的内容这是引用的内容

列表中使用

```text
* 第一项
> 引用1
> 引用2
* 第二项
```

示例：

- 第一项

> 引用 1 引用 2

- 第二项

引用里嵌套引用

```text
> 最外层引用
> > 多一个
> 嵌套一层引用
> > > 可以嵌套很多层
```

引用里嵌套列表

```text
> - 这是引用里嵌套的一个列表
> - 还可以有子列表
>     * 子列表需要从 - 之后延后四个空格开始
```

引用里嵌套代码块

````text
>     同样的，在前面加四个空格形成代码块
> ```
> 或者使用 ``` 形成代码块
> ```
````

### 4.链接

链接输入网址，单击链接，展开后可编辑 ctr+单击，打开链接例如：[https://www.baidu.com](https://link.zhihu.com/?target=https%3A//www.baidu.com)

常用链接方法

```text
文字链接 [链接名称](http://链接网址)网址链接 <http://链接网址>
```

示例效果：百度

超链接

格式 1：用[ ]括住要超链接的内容，紧接着用( )括住超链接源+名字，超链接源后面+超链接命名同样 ctrl+单击，打开链接例如：

```text
这是[百度](https://www.baidu.com)官网
```

这是 百度官网格式 2：超链接 title 可加可不加

```text
This is [an example](http://example.com/ "Title") inline link.
[This link](http://example.net/) has no title attribute.
```

This is an example inline link.This link has no title attribute.

高级链接技巧

使用[+超链接文字+]+[+标签+]，创建可定义链接 ctrl+单击，打开链接。示例 1：

```text
这是[百度][id][id]:https://www.baidu.com
```

这是百度示例 2：

```text
这个链接用 1 作为网址变量 [Google][1].
这个链接用 yahoo 作为网址变量 [Yahoo!][yahoo].
然后在文档的结尾为变量赋值（网址）
[1]: http://www.google.com/
[yahoo]: http://www.yahoo.com/
```
