---
order: 8
---

# C++ 常用语法

本章记录常用 api，以防做算法时忘记

## 常用语法

字符串操作

```c
str.find_first_of('abc');     // 获取字符串中第一个指定字符(串)的位置
str.find_last_of('.');        // 获取字符串中最后一个指定字符(串)的位置
str.substr(a,b);      // 根据以上两个端位置，保留从第a位开始，共b个字符到字符串
str.atoi("123".c_str())     //c_str()把C++字符串转换为C字符串，然后用C的方法把字符串转整数
```

## STL

### vector

动态数组长度，能够变长数组，倍增的思想

- size(),数组长度，时间复杂度 O(1)

- empty(),是否为空,bool

- clear(),清空

### string

- substr() 放回某一个字符串

- c_str() 放回字符数组的头指针

### queue

- push(),队尾插入

- front(),返回队头元素

- pop(),队头排出

#### priority_queue

优先队列，是一个堆。

- push(),堆尾插入

- top(),返回堆头元素

- pop(),队头排出

### stack

- push(),栈顶插入

- top(),返回栈顶元素

- pop(),栈顶排出

### deque

双向队列

### set,map,multiset,multmap

基于平衡二叉树（红黑树），动态维护一个有序序列

### unordered_set,unordered_map,unordered_multset,unordered_multimap

哈希表

### bitset

压位
