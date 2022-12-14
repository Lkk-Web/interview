---
order: 6
---

# 数据结构

## 一、链表

### 1、单链表

用来写链接表存储图和树、最短路问题、最小生成树问题

双链表优化某些问题

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
    ne[k] = ne[ne[k]]; //下下个结点
}
```

## 二、Hash 表

Hash 表是基于哈希函数建立的一种查找表，把庞大的数据结构映射到 0-N 的数，即 Key 值，由于是小的数据结构隐射到大的数据结构，因此会产生哈希冲突（一般取模为质数，这样冲突最少 ）。

解决哈希冲突的哈希函数：开放寻址法、拉链法（链地址法）

```C
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
