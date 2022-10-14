# 数组排序算法

## 一、快速排序

- 核心思想：传入一个数组，以及左指针 l，右指针 r 的位置（初始则为左右边界）。设置一个边界 x（可取任何位置），如果该数组的左右节点位置不满足边界条件，则交换位置。当左节点大于右节点时则结束循环，递归左边界到右指针+1（如果边界取右边界则递归到左指针-1）。最终左右节点的外围排好序的结束循环（如果取右边界为基准点，则右边的为排好序的），未排好序的内层继续递归。
- 时间复杂度：长度为 n 的数组需计算：n=2^x^ 即时间复杂度 x=log~2~n

```c
void quick_sort(int q[], int l, int r)
{
    if (l >= r) return;
    int i = l - 1, j = r + 1, x = q[l + r >> 1];//这里边界取中间值
    while (i < j)
    {
        do i ++ ; while (q[i] < x);
        do j -- ; while (q[j] > x);
        if (i < j) swap(q[i], q[j]);
    }
    quick_sort(q, l, j), quick_sort(q, j + 1, r);
}
```

## 二、归并排序

- 核心思想：即将数组（l+r>>2)平分 n 次，即进行 2^n^个数组的归并（树的最底层），通过比较 2 个数组大小，得到排好序的数组
- 时间复杂度：x=log~2~n

```C
void merge_sort(int q[], int l, int r)
{
    if (l >= r) return;

    int mid = l + r >> 1;
    merge_sort(q, l, mid);merge_sort(q, mid + 1, r);

    int k = 0, i = l, j = mid + 1; //归并
    while (i <= mid && j <= r)
        if (q[i] <= q[j]) tmp[k ++ ] = q[i ++ ];
        else tmp[k ++ ] = q[j ++ ];

    while (i <= mid) tmp[k ++ ] = q[i ++ ];
    while (j <= r) tmp[k ++ ] = q[j ++ ];

    for (i = l, j = 0; i <= r; i ++, j ++ ) q[i] = tmp[j];
}
```

# 搜索

## 一、二分查找

通过一次次平分评断，来找到符合值的算法

- 整数二分

核心思想：在考虑整数二分时，需要考虑边界问题（如：0,1,1,2），每次找到需要刷新边界，取左边界 l 为值时，在找右边界时需要加 1，避免死循环（即边界问题）

```C
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

- 浮点数二分

核心思想：相对于整数二分不需要考虑边界问题，一般认为二分的次数足够多时（精度比较大时），即认为找到了答案。

```C
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

# 高精度

高精度读入时用字符串存储，用数组倒序存储每位的值，方便进位。

## 一、高精度加法

核心思想：模拟人工加法，t+=ai+bi+t，逢十进一，计算 t 的值，t%10 为当前位值，t/10 为进位值

```C
// C = A + B, A >= 0, B >= 0
vector<int> add(vector<int> &A, vector<int> &B)
{
    if (A.size() < B.size()) return add(B, A);

    vector<int> C;
    int t = 0;
    for (int i = 0; i < A.size(); i ++ )
    {
        t += A[i];
        if (i < B.size()) t += B[i];
        C.push_back(t % 10);
        t /= 10;
    }

    if (t) C.push_back(t);
    return C;
}
```

## 二、高精度减法

核心思想：模拟人工减法，t-=ai-bi-t，计算 t 的值，t%10 为当前位值，t 为借位值

```C
// C = A - B, 满足A >= B, A >= 0, B >= 0,计算结果为负数时即-(B-A)
vector<int> sub(vector<int> &A, vector<int> &B)
{
    vector<int> C;
    for (int i = 0, t = 0; i < A.size(); i ++ )
    {
        t = A[i] - t;
        if (i < B.size()) t -= B[i];
        C.push_back((t + 10) % 10); //当前位
        if (t < 0) t = 1;	//借位
        else t = 0;
    }

    while (C.size() > 1 && C.back() == 0) C.pop_back();
    return C;
}
```

## 三、高精度乘法

- 高精度乘低精度

核心思想：模拟人工乘法，t+=(ai\*b)+t/10，计算 t 的值，t%10 为当前位值，t/10 为进位值

```C
// C = A * b, A >= 0, b >= 0
vector<int> mul(vector<int> &A, int b)
{
    vector<int> C;

    int t = 0;
    for (int i = 0; i < A.size() || t; i ++ )
    {
        if (i < A.size()) t += A[i] * b;
        C.push_back(t % 10);
        t /= 10;
    }

    while (C.size() > 1 && C.back() == 0) C.pop_back();  //vector.back()为容器最后一位

    return C;
}
```

三、高精度除法

- 高精度除低精度

核心思想：模拟人工除法，r+=(r\*10)+ai/b，计算 r 的值，b 为除数，r 为余数

```C
// A / b = C ... r, A >= 0, b > 0
vector<int> div(vector<int> &A, int b, int &r)
{
    vector<int> C;
    r = 0;
    for (int i = A.size() - 1; i >= 0; i -- )
    {
        r = r * 10 + A[i];
        C.push_back(r / b);	//当前位
        r %= b;	//余数
    }
    reverse(C.begin(), C.end());
    while (C.size() > 1 && C.back() == 0) C.pop_back();
    return C;
}

```

# 前缀和、差分

## 前缀和

- 一维前缀和

核心思想：模拟等差数列前缀和，利用 S[n]来存储前 n 项，求[l,r]的序列和只需 S[r]-S[l-1]。

```C
for(int n = 0;n < data.length;n++){
	S[n] = x + S[n-1];	//x为当前值,data为n项
}

a[l] + ... + a[r] = S[r] - S[l - 1];

```

- 二维前缀和

核心思想：模拟矩阵二维等差

## 差分（数列）

- 一维差分

核心思想：给区间[l, r]中的每个数加上 c，在数组做标记，用前缀和求差分。

```C
b[l] += c , b[r+1] -= c; //
for(int i = 1; i < n; i++ ) b[i] += b[i - 1];//前缀和做差分
```

# 数论

## 一、质数（素数）

**素数**是指质数，一个大于 1 的自然数，除了 1 和它自身外，不能整除其他自然数的数叫做质数；

**质因子**能整除给定正整数的质数

### 1、判断质数

```C
*试除法
*由于非质数的约数都是成对出现的，因此只需试除根号n，时间复杂度也优化为根号n

bool is_prime(int n){
    if(n <= 1) return false;
    for(int i = 2; i <= n / i;i++){
        if(n % i == 0) return false;
    }
    return true;
}
```

### 2、分解质因子

```C
*试除法
*时间复杂度小于根号n
void dvidide(int n){
	for(int i = 2;i <= n / i;i++){
        int s = 0;
        if(n % i == 0){
            while (n % i == 0){
                s++;
                n/=i;
            }
            cout >>"质因子：">> i >>"个数(指数)：" >> s;
        }
    }
    if(n > 1) cout >>"质因子：">> n >>"个数（指数）：" >> 1;
}
```

### 3、筛质数

求 0-n 的所有质数

```c
*埃式筛法
void get_primes(int n){
	for(int i = 2; i <= n ; i++){
		if(!st[i]){
			primes[m++] = i;
			for(int j = i + i; j <= n ;j += i) st[j] = true;
		}
	}
}

*线性筛法
void get_primes(int n){
    for(int i = 2 ;i <= n;i++){
        if(!st[i]) primes[m++] = i;
        for(int j = 0; primes[j] <= n / i; j ++){
            st[primes[j] * i] = true;
            if(i % primes[j] == 0) break; //由于primes[j]是递增，所以primes[j]一定是i的最小质因子（去除合数）
        }
    }
}
```

## 二、组合数

### 1、递归法求组合数

组合数：C ^b^~a~ 从 a 个中选 b 个

```c
// c[a][b] 表示从a个苹果中选b个的方案数
const mod = 1e9 + 7;  //模上一个

for (int i = 0; i < N; i ++ )
    for (int j = 0; j <= i; j ++ ){
        if (!j) c[i][j] = 1;
        else c[i][j] = (c[i - 1][j] + c[i - 1][j - 1]) %mod;
    }

```

# 图论

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
