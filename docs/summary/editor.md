---
order: 7
toc: menu
---

# 代码编辑器

通用实时编辑器，支持多语言语法高亮与实时预览。编辑内容自动保存到本地缓存，刷新后不丢失。

---

## Mermaid 架构图

点击右上角 **✎ 编辑** 展开编辑器，修改 Mermaid 语法后图表实时更新。

```tsx
import React from 'react';
import { CodeGateway } from 'interview';

export default () => <CodeGateway codeKey="demo-mermaid" />;
```

---

## Markdown

```tsx
import React from 'react';
import { CodeGateway } from 'interview';

export default () => <CodeGateway codeKey="demo-markdown" />;
```

---

## HTML

```tsx
import React from 'react';
import { CodeGateway } from 'interview';

export default () => <CodeGateway codeKey="demo-html" />;
```

---

## JSON

```tsx
import React from 'react';
import { CodeGateway } from 'interview';

export default () => <CodeGateway codeKey="demo-json" />;
```

---

## 使用方式

在任意 md 文件中引入：

```text
// Mermaid 开启编辑模式
<CodeGateway codeKey="demo-mermaid" />

// 通用编辑器
<CodeGateway codeKey="demo-markdown" />
<CodeGateway codeKey="demo-html" />
<CodeGateway codeKey="demo-json" />
```

| prop           | 说明                         | 默认值           |
| -------------- | ---------------------------- | ---------------- |
| `codeKey`      | 代码内容 key                 | 必填             |
| `pageKey`      | 页面/业务域 key              | `summary-editor` |
| `cacheKey`     | 本地缓存 key                 | mock 中的 key    |
| `defaultOpen`  | 默认展开编辑器               | mock 中的配置    |
| `editorHeight` | 编辑区高度                   | `300`            |
| `editable`     | Mermaid 是否开启编辑模式     | mock 中的配置    |
| `zoomable`     | Mermaid 是否开启缩放/拖拽    | mock 中的配置    |
