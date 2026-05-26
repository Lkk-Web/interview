/**
 * title: 思维导图 — 前端知识体系
 * description: 展示层级结构
 */
import React from 'react';
import { Mermaid } from 'interview';

const chart = `
mindmap
  root((前端))
    HTML
      语义化标签
      表单
    CSS
      Flex
      Grid
      动画
    JavaScript
      ES6+
      异步编程
      模块化
    框架
      Vue
      React
`;

export default () => <Mermaid chart={chart} />;
