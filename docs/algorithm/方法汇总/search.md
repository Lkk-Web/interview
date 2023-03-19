---
order: 2
---

# 搜索

## 一、二分查找

通过一次次平分评断，来找到符合值的算法

### 1、整数二分

核心思想：在考虑整数二分时，需要考虑边界问题（如：0,1,1,2），每次找到需要刷新边界，取左边界 l 为值时，在找右边界时需要加 1，避免死循环（即边界问题）

```c
bool check(int x) {/* ... */} // 检查x是否满足某种性质

// 区间[l, r]被划分成[l, mid]和[mid + 1, r]时使用：
int bsearch_1(int l, int r)
{
    while (l < r)
    {
        int mid = l + r >> 1;
        if (check(mid)) r = mid;  // check()判断mid是否满足性质
        else l = mid + 1;
    }
    return l;
}
// 区间[l, r]被划分成[l, mid - 1]和[mid, r]时使用：
int bsearch_2(int l, int r)
{
    while (l < r)
    {
        int mid = l + r + 1 >> 1;
        if (check(mid)) l = mid;
        else r = mid - 1;
    }
    return l;
}
```

### 2、浮点数二分

核心思想：相对于整数二分不需要考虑边界问题，一般认为二分的次数足够多时（精度比较大时），即认为找到了答案。

```c
double bsearch_3(double l, double r)
{
    const double eps = 1e-6;   // eps 表示精度，取决于题目对精度的要求
    while (r - l > eps)
    {
        double mid = (l + r) / 2;
        if (check(mid)) r = mid;
        else l = mid;
    }
    return l;
}
```

## 二、（深/广）度优先搜索（DFS/BFS）

时间复杂度都为 O(n+m), n 表示点数，m 表示边数；

### 1、深度优先搜索

数据结构为栈（stack），空间复杂度为 O(h)，不具有最短路性质，具有回溯和剪枝，采用递归的方法。

```c

void dfs(int u)
{
    //捕捉路径
    for(int i = 0; i < n; i++){ cout << path[i];}
    for(int i = 1; i <= n; i++){ //n为树的深度
        if(!st[i]){	//未遍历过（剪枝条件）
            path[u] = i;  //第u层赋值i，保存路径
            st[i] = true;
            dfs(u+1); //递归下一层
            st[i] = false; //回溯，恢复现场
        }
    }
}
```

典型问题：n-皇后问题、二叉树的深度...

### 2、广度优先搜索

数据结构为队列（queue），空间复杂度为 O(2^h^)，具有最短路性质

```c
typedef pair<int,int> PII;
int d[N][N];	//队列深度（长度）
int g[N][N]; //存图
PII q[N * N], Prev[N][N];

bfs(){
    //模拟队列
    int hh = 0, tt = 0;
    q[0] = {0, 0};

    memset(d,-1,sizeof d); //将d内的所有数数初始化为-1
	d[0][0] = 0;

    int dx[4] = {-1,0,1,0},dy[4] = {0,1,0,-1};
    while(hh <= tt){
        auto t = q[hh ++];
        for(int i = 0;i < 4;i ++ ){
            int x = t.first + dx[i],y = t.second + dy[i];
            if(x >= 0 && x < n && y >= 0 && y < m && g[x][y] == 0 && d[x][y] == -1){
                d[x][y] = d[t.first][t.second] + 1;	//深度
                Prev[x][y] = t;	//记录路径
                q[++tt] = {x,y};
            }
        }
    }
    return d[n -1][m - 1];
}
```
