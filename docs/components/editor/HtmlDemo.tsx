/**
 * title: HTML 编辑器
 * description: 实时预览 HTML 渲染效果，支持内联样式和脚本
 */
import React from 'react';
import { CodeEditor } from 'interview';

export default () => (
  <CodeEditor
    lang="html"
    cacheKey="demo-html"
    defaultOpen
    code={`<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; padding: 16px; }
    .card {
      border: 1px solid #e8e8e8;
      border-radius: 8px;
      padding: 16px;
      max-width: 300px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    h2 { color: #1890ff; margin: 0 0 8px; }
    p { color: #666; margin: 0; }
  </style>
</head>
<body>
  <div class="card">
    <h2>Hello World</h2>
    <p>这是一个 HTML 实时预览示例</p>
  </div>
</body>
</html>`}
  />
);
