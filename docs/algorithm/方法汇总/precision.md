---
order: 3
---

# 高精度

高精度读入时用字符串存储，用数组倒序存储每位的值，方便进位。

### 高精度加法

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

### 高精度减法

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

### 高精度乘法

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

### 高精度除法

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
