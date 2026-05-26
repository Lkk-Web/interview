/**
 * title: 甘特图 — 项目开发计划
 * description: 结合 section、done、active、crit 状态
 */
import React from 'react';
import { Mermaid } from 'interview';

const chart = `
gantt
    title 项目开发计划
    dateFormat YYYY-MM-DD
    section 需求阶段
        需求分析    :done,    2024-01-01, 2024-01-07
        原型设计    :done,    2024-01-08, 2024-01-14
    section 开发阶段
        前端开发    :active,  2024-01-15, 2024-02-15
        后端开发    :active,  2024-01-15, 2024-02-10
    section 测试阶段
        功能测试    :crit,    2024-02-16, 2024-02-28
        上线发布    :         2024-03-01, 2024-03-03
`;

export default () => <Mermaid chart={chart} />;
