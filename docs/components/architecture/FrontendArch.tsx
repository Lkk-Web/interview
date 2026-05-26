/**
 * title: 前端跨页面 websocket 方案
 * description: 前端项目的工程化体系与 CI/CD 流程
 */
import React from 'react';
import { Mermaid } from 'interview';

const chart = `
sequenceDiagram
    participant PC as PC用户
    participant Foreign as cassint.casstime.com
    participant Intra as cassint.cassmall.com
    participant istio as istio网关
    participant server as intelligent-sale-workbench-web-service

    par websocket 网络拓扑图
        PC->>Foreign: 用户进入前端页面
        Note over Foreign: 广播，公用同一websocket空间
    		Foreign->>Foreign: 同源策略，父子页面广播透传websocket
        Foreign-->>Intra: Proxy到电商intra
        Intra-->>istio: Nginx转发到istio，并做socket upgrate
        istio->>server: Proxy 到服务
        server->>Foreign: token鉴权并握手
    end
`;

export default () => <Mermaid chart={chart} />;
