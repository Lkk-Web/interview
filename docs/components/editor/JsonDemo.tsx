/**
 * title: JSON 编辑器
 * description: 实时格式化和校验 JSON 数据
 */
import React from 'react';
import { CodeEditor } from 'interview';

export default () => (
  <CodeEditor
    lang="json"
    cacheKey="demo-json"
    defaultOpen
    code={`{
  "name": "interview",
  "version": "1.0.0",
  "portfolio": {
    "allocation": [
      { "name": "低估股", "ratio": 50 },
      { "name": "周期股", "ratio": 30 },
      { "name": "科技股", "ratio": 20 }
    ]
  },
  "principles": [
    "不满仓操作",
    "操作前先想好退出策略"
  ]
}`}
  />
);
