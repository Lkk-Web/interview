/**
 * title: 饼图 — 前端技术栈使用比例
 * description: 展示数据占比
 */
import React from 'react';
import { Mermaid } from 'interview';

const chart = `
pie title 前端技术栈使用比例
    "Vue" : 40
    "React" : 35
    "Angular" : 15
    "其他" : 10
`;

export default () => <Mermaid chart={chart} />;
