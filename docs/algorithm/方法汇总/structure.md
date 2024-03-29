---
order: 6
---

# 数据结构

## 一、链表

### 1.1 单链表

单链表用来写邻接表，邻接表用来解决存储图和树、最短路问题、最小生成树问题

```c
//表示头结点的下标
//e[i] 结点i的值
//ne[i] 表示结点i的下一个指针
//idx 存储当前已经用到了哪个点
void init(){
	head = -1;
	idx = 0;
}

//将x插在下标是k的点后面
void add(int k,int x){
	e[idx] = x;
	ne[idx] = ne[k];
	ne[k] = idx;
	idx ++;
}

//将下标是k的后面一个点删掉
void remove(int k){
    ne[k] = ne[ne[k]]; //k-1的结点直接指向下下个结点
}
```

### 1.2 双链表

双链表优化某些问题

```c
#include <iostream>;
using namespace std;

const int N = 100010;

int m;
int e[N], l[N], r[N], idx
// e表示结点的值，l,r分别表示左链和右链，idx表示插入的点
void init(){
    // 1 为右端点，0 为左端点
    r[0] = 1,l[1] = 0;
    idx = 2; //idx 表示链表从2开始(0,1已经被占用)
}

// 在第k点的右边插入x
void add(int k, int x){
    e[idx] = x;
    r[idx] = r[k];   //先插入，后改链
    l[idx] = k;
    l[r[k]] = idx;
    r[k] = idx;
}

// 删除第k个点
void remove(int k){
    r[l[k]] = r[k];
    l[r[k]] = l[k];
}

```

## 二、栈、队列

### 2.1 栈

受限的线性表，先进后出

```c
#include <iostream>
using namespace std;

const int N = 100010;

int stack[N];
int top = -1;

// 插入x,入栈
stack[++top] = x;
// 弹出，出栈
top--;
// 栈顶
int stack_top = stack[top];
// 判断栈为空
if(top > 0) not empty
    eles empty
```

经典应用：

1. 括号匹配：[有效的括号](/algorithm/leet-code/1-100#20-有效的括号)
2. 中缀表达式->后缀表达式

### 2.1.1 单调栈

### 2.2 队列

受限的线性表，先进先出（队头入队，出队）

```c
#include <iostream>
using namespace std;

const int N = 100010;

int queue[N];
int head = 0,tail = -1;

// 插入x，入队
queue[++tail] = x;
// 弹出,出队
head++;
// 队尾
int queue_tail = queue[tail];
// 判断队为空
if(head > tail)  'empty'
    eles 'not empty'
```

### 2.2.1 单调队列

滑动窗口

## 三、串

### 3.1 模板朴素算法

时间复杂度：O(mn)

- 王道模板：

```c
int Index(SString S,SString T){
    int i = 1,j = 1;
    while(i < S.length && j < T.length){
        if(S.ch[i] == T.ch[j]){
            ++i;++j;
        }else{
            i = i - j + 2; // i-j+1 为初始位置，j为当前比较数（偏差值）
            j = 1;
        }
    }
    if(j > T.length) return i-T.length;
    else return 0;
}
```

### 3.2 KMP 算法

KMP 算法的关键在于可以将已匹配`相等的前缀序列和后缀序列`(称为模板匹配值)，向后滑动到与这些相等字符对齐的位置。相对于朴素算法，指针 i 不会回溯。

> next[ j ]的含义（模板匹配值）：在子串的第 j 个字符与主串发生失配时，则跳到子串的 next[j]位置重新与主串当前位置进行比较。

- 王道模板：时间复杂度：O(m + n)

```c
// 求模式串的Next数组：ne[]
void get_ne(SString T,int ne[]){
    int i = 1,j = 0;
    ne[1] = 0;
    while(i < T.length){
        if(j == 0 || T.ch[i] == T.ch[j]){
            ++i,++j;
            if(T.ch[i] != T.ch[j]) ne[i] = j;
            else ne[i] = ne[j]; // ne[]的优化，相当于找ne[ne[j]]
        }else{
            j = ne[j];
        }
    }
}

// S长文本，T是模式串
int Index(SString S,SString T){
    int i = 1,j = 1;
    while(i < S.length && j < T.length){
        if(S.ch[i] == T.ch[j]){
            ++i;++j;
        }else{
            j = ne[j];    //其他一致。只需更改1、i不回溯 2、j的初始值为ne[j]
        }
    }
    if(j > T.length) return i-T.length;
    else return 0;
}
```

- acwing 模板：时间复杂度：O(2m) => O(n)

```c
char p[],s[];
int n,m;
int ne[];
// s[]是长文本，p[]是模式串，n是s的长度，m是p的长度
// 求模式串的Next数组：ne[]
for (int i = 2, j = 0; i <= m; i ++ )   // ne[1]必为 0，因此i从2开始匹配
{
    while (j && p[i] != p[j + 1]) j = ne[j];
    if (p[i] == p[j + 1]) j ++ ;
    ne[i] = j;
}

// 匹配
for (int i = 1, j = 0; i <= n; i ++ )
{
    while (j && s[i] != p[j + 1]) j = ne[j];
    if (s[i] == p[j + 1]) j ++ ;
    if (j == m)
    {
        j = ne[j];
        // 匹配成功后的逻辑
    }
```

## 二、Hash 表

Hash 表是基于哈希函数建立的一种查找表，把庞大的数据结构映射到 0-N 的数，即 Key 值，由于是小的数据结构隐射到大的数据结构，因此会产生哈希冲突（一般取模为质数，这样冲突最少 ）。

解决哈希冲突的哈希函数：开放寻址法、拉链法（链地址法）

```c
*开放寻址法
  int h[N];

    // 如果x在哈希表中，返回x的下标；如果x不在哈希表中，返回x应该插入的位置
    int find(int x)
    {
        int t = (x % N + N) % N;
        while (h[t] != null && h[t] != x)
        {
            t ++ ;
            if (t == N) t = 0;
        }
        return t;
    }

```

```c
*拉链法
    int h[N], e[N], ne[N], idx;

    // 向哈希表中插入一个数
    void insert(int x)
    {
        int k = (x % N + N) % N;	//保证取模后一定是正数
        e[idx] = x;
        ne[idx] = h[k];
        h[k] = idx ++ ;
    }

    // 在哈希表中查询某个数是否存在
    bool find(int x)
    {
        int k = (x % N + N) % N;
        for (int i = h[k]; i != -1; i = ne[i])
            if (e[i] == x)
                return true;
        return false;
    }
```

## 三、Trie 树

trie 又称 前缀树 或 字典樹 ，是一种有序树 ，用于保存关联数组 ，其中的键通常是字符串

```c
int son[N][26], cnt[N], idx;
// 0号点既是根节点，又是空节点
// son[][]存储树中每个节点的子节点
// cnt[]存储以每个节点结尾的单词数量

// 插入一个字符串
void insert(char *str)
{
    int p = 0;
    for (int i = 0; str[i]; i ++ )
    {
        int u = str[i] - 'a';
        if (!son[p][u]) son[p][u] = ++ idx;
        p = son[p][u];
    }
    cnt[p] ++ ;
}

// 查询字符串出现的次数
int query(char *str)
{
    int p = 0;
    for (int i = 0; str[i]; i ++ )
    {
        int u = str[i] - 'a';
        if (!son[p][u]) return 0;
        p = son[p][u];
    }
    return cnt[p];
}
```

## 四、并查集

基本原理：每个集合用一棵树来表示，树根的编号就是整个集合的编号。每个结点存储它的父节点，p[x]表示 x 的父节点。

1、**并查集只有两个操作，“并”** 和 “查”。 ① 用于将两个区间合并 ② 询问两个元素是否在同一个 集合当中
