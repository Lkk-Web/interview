---
order: 2
---

# 剑指 Offer

### 18. 删除链表的节点

[剑指 Offer 18. 删除链表的节点](https://leetcode.cn/problems/shan-chu-lian-biao-de-jie-dian-lcof/description/)

给定单向链表的头指针和一个要删除的节点的值，定义一个函数删除该节点。返回删除后的链表的头节点。

思路(单链表的删除)：如果是删除头结点，则返回头结点的 next 的指针；如果是删除非头结点，则先找到删除结点的前一个位置(K-1),再删除第 k 个结点。

```c
class Solution {
public:
    ListNode* deleteNode(ListNode* head, int val) {
        ListNode *tmp = head;
        if(head->val == val) return head->next;
        while(tmp->next->val != val && head->next){
            tmp = tmp->next;
        }
        // 删除结点
        tmp->next = tmp->next->next;
        return head;
    }
};
```
