---
order: 7
toc: menu
---

# 代码编辑器

通用实时编辑器，支持多语言语法高亮与实时预览。编辑内容自动保存到本地缓存，刷新后不丢失。

---

## Mermaid 架构图

点击右上角 **✎ 编辑** 展开编辑器，修改 Mermaid 语法后图表实时更新。

<code src="../components/editor/MermaidDemo.tsx"></code>

---

## Markdown

<code src="../components/editor/MarkdownDemo.tsx"></code>

---

## HTML

<code src="../components/editor/HtmlDemo.tsx"></code>

---

## JSON

<code src="../components/editor/JsonDemo.tsx"></code>

---

## 使用方式

在任意 md 文件中引入：

```text
// Mermaid 开启编辑模式
<Mermaid editable chart={`graph TD; A-->B`} />

// 通用编辑器
<CodeEditor lang="markdown" code="# Hello" />
<CodeEditor lang="html" code="<h1>Hello</h1>" />
<CodeEditor lang="json" code='{"key":"value"}' />
```

| prop           | 说明           | 默认值     |
| -------------- | -------------- | ---------- |
| `lang`         | 语言类型       | 必填       |
| `code`         | 初始代码       | 必填       |
| `cacheKey`     | 本地缓存 key   | 自动生成   |
| `defaultOpen`  | 默认展开编辑器 | `false`    |
| `editorHeight` | 编辑区高度     | `300`      |
| `renderer`     | 自定义渲染函数 | 内置渲染器 |
