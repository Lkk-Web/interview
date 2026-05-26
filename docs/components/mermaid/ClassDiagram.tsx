/**
 * title: 类图 — 支付系统
 * description: 结合接口实现、继承、组合、关联
 */
import React from 'react';
import { Mermaid } from 'interview';

const chart = `
classDiagram
    class Payable {
        <<interface>>
        +pay(amount: float): bool
        +refund(amount: float): bool
    }
    class Order {
        +String orderId
        +float totalAmount
        +List~OrderItem~ items
        +createOrder(): void
        +cancel(): void
    }
    class OrderItem {
        +String productId
        +int quantity
        +float price
    }
    class Payment {
        +String paymentId
        +float amount
        +String status
        +pay(amount: float): bool
        +refund(amount: float): bool
    }
    class AlipayPayment {
        +String alipayAccount
        +pay(amount: float): bool
        +refund(amount: float): bool
    }
    class WechatPayment {
        +String openId
        +pay(amount: float): bool
        +refund(amount: float): bool
    }

    Payable <|.. Payment
    Payment <|-- AlipayPayment
    Payment <|-- WechatPayment
    Order --* OrderItem : 包含
    Order --> Payment : 使用
`;

export default () => <Mermaid chart={chart} />;
