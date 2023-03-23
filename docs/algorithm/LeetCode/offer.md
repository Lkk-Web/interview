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

### 24. 反转链表

[剑指 Offer II 024. 反转链表](https://leetcode.cn/problems/UHnkqh/)

给定单链表的头节点 head ，请反转链表，并返回反转后的链表的头节点。

```
输入：head = [1,2,3,4,5]
输出：[5,4,3,2,1]
```

解法一：`思路(头指针后插入元素)`：创建一个新节点，用来存储反装链表当前值,然后循环插入到反转链表的头指针后。

```c
class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        ListNode *rever = new ListNode(-1);

        while(head != nullptr){
            //创建一个新节点，用来存储反装链表当前值
            ListNode *current = new ListNode(head->val);
            //在头结点后插入当前值
            current->next = rever->next;
            rever->next = current;
            head = head->next;
        }
        return rever->next;
    }
};
```

解法二：`思路(单链表尾部添加元素)`：在遍历链表时，将当前节点的 next 指针改为指向前一个节点。由于节点没有引用其前一个节点，因此必须事先存储其前一个节点。在更改引用之前，还需要存储后一个节点。最后返回新的头引用。

```c
class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        ListNode* prev = nullptr;
        ListNode* curr = head;
        while (curr) {
            ListNode* next = curr->next;
            curr->next = prev;
            prev = curr;
            curr = next;
        }
        return prev;
    }
};

```

### 25. 合并两个排序的链表

[剑指 Offer 25. 合并两个排序的链表](https://leetcode.cn/problems/he-bing-liang-ge-pai-xu-de-lian-biao-lcof/)

输入两个递增排序的链表，合并这两个链表并使新链表中的节点仍然是递增排序的。

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

### 27. 回文链表

[剑指 Offer II 027. 回文链表](https://leetcode.cn/problems/aMhZSa/description/)

给定一个链表的 头节点 head ，请判断其是否为回文链表。

如果一个链表是回文，那么链表节点序列从前往后看和从后往前看是相同的。

```
输入: head = [1,2,3,3,2,1]
输出: true
```

`思路(反转链表，比较回文数)`：在遍历链表的同时创建一个新的链表来存储反转链表，并记录链表长度，然后循环比较前 n/2 个回文数。因此时间复杂度为 O(2n),空间复杂度为 O(n).

```c
class Solution {
public:
    bool judgeIsPalind(ListNode* head,ListNode* reverse,int count){
        for(int i = 0;i < count;i++){
            if(reverse->val != head->val) return false;
            head = head->next;
            reverse = reverse->next;
        }
        return true;
    }

    bool isPalindrome(ListNode* head) {
        ListNode *tmp = head;   //取一个新链表，是head的指针在头部位置不移动
        if(tmp->next == nullptr) return true;  // 处理1位数
        ListNode *reverse = new ListNode(-1);

        int index = 0;
        while(tmp != nullptr){
            //反转链表
            ListNode *newNode = new ListNode(tmp->val);
            newNode->next = reverse->next;
            reverse->next = newNode;
            //设置索引，获得链表长度
            ++index;
            tmp = tmp->next;
        }
        return  judgeIsPalind(head,reverse->next,index>>1);
    }
};
```
