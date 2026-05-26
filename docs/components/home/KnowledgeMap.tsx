/**
 * title: 知识图谱
 * description: 项目所有记录的技术知识体系
 */
import React from 'react';
import { Mermaid } from 'interview';

const chart = `
mindmap
  root((知识图谱))
    前端
      HTML
      CSS
      JavaScript
      TypeScript
      React
      React Native
      浏览器原理
    工程化
      Webpack
      Vite
      Babel
      Jest
      Next.js
      Taro.js
      前端工程化
    计算机基础
      网络
      操作系统
      编译原理
      数据结构
    后端
      Node.js
      Nest.js
      Golang
    数据库
      MySQL
      Redis
      MongoDB
      Kafka
    运维
      Docker
      Nginx
      Git
      Bash
    AI
      AI Tools
      AI Agent
      LangChain
      LangGraph
    算法
      LeetCode
      方法汇总
    面试
      前端面试
      手撕代码
      复盘总结
`;

export default () => <Mermaid chart={chart} />;
