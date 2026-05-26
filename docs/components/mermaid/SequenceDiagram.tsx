/**
 * title: 时序图 — 登录与 Token 刷新
 * description: 结合 actor、Note、alt/else、loop
 */
import React from 'react';
import { Mermaid } from 'interview';

const chart = `
sequenceDiagram
    actor 用户
    participant 前端
    participant 网关
    participant 认证服务
    participant 数据库

    用户->>前端: 输入账号密码
    前端->>网关: POST /login
    网关->>认证服务: 转发请求
    Note over 认证服务,数据库: 验证用户身份
    认证服务->>数据库: 查询用户
    数据库-->>认证服务: 用户信息

    alt 验证通过
        认证服务-->>网关: 签发 Token
        网关-->>前端: 返回 Token
        前端-->>用户: 登录成功
    else 验证失败
        认证服务-->>网关: 401 Unauthorized
        网关-->>前端: 登录失败
        前端-->>用户: 提示错误
    end

    loop Token 刷新（每30分钟）
        前端->>网关: 携带 RefreshToken
        网关-->>前端: 新 AccessToken
    end
`;

export default () => <Mermaid chart={chart} />;
