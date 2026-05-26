/**
 * title: 状态图 — 订单生命周期
 * description: 结合嵌套状态描述完整订单流转
 */
import React from 'react';
import { Mermaid } from 'interview';

const chart = `
stateDiagram-v2
    [*] --> 待支付
    待支付 --> 已支付: 用户付款
    待支付 --> 已取消: 超时/取消

    state 已支付 {
        [*] --> 待发货
        待发货 --> 配送中: 商家发货
        配送中 --> 已签收: 用户签收
        已签收 --> [*]
    }

    已支付 --> 售后中: 申请退款
    售后中 --> 已退款: 审核通过
    售后中 --> 已支付: 审核拒绝
    已取消 --> [*]
    已退款 --> [*]
    已支付 --> [*]: 完成
`;

export default () => <Mermaid chart={chart} />;
