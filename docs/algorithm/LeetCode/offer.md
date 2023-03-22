---
order: 2
---

# 剑指 Offer

### 18. 删除链表的节点

[剑指 Offer 18. 删除链表的节点](https://leetcode.cn/problems/shan-chu-lian-biao-de-jie-dian-lcof/description/)

给定单向链表的头指针和一个要删除的节点的值，定义一个函数删除该节点。返回删除后的链表的头节点。

`思路(单链表的删除)`：如果是删除头结点，则返回头结点的 next 的指针；如果是删除非头结点，则先找到删除结点的前一个位置(K-1),再删除第 k 个结点。

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

### 25. 合并两个排序的链表

[剑指 Offer 25. 合并两个排序的链表](https://leetcode.cn/problems/he-bing-liang-ge-pai-xu-de-lian-biao-lcof/)

输入两个递增排序的链表，合并这两个链表并使新链表中的节点仍然是递增排序的。

`思路(单链表尾部添加元素)`：比较2个链表的当前值，值小的添加到新的链表，并将指针往后挪一位，当其中1个链表没有值后，直接将有值的链表放在新链表后。

```
输入：1->2->4, 1->3->4
输出：1->1->2->3->4->4
```

`思路(单链表尾部添加元素)`：比较 2 个链表的当前值，值小的添加到新的链表，并将指针往后挪一位，当其中 1 个链表没有值后，直接将有值的链表放在新链表后。

```c
class Solution {
public:
    ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
        ListNode* prehead = new ListNode(-1); // 新建一个空的头节点
        ListNode* res = prehead;
        while(l1 != nullptr && l2 != nullptr){
            if(l1->val < l2->val){
                res->next = l1;
                l1 = l1->next;
            }else{
                res->next = l2;
                l2 = l2 -> next;
            }
            res = res->next;
        }
        res->next = l1 == nullptr ? l2 : l1;

        return  prehead->next;
    }
};
```
