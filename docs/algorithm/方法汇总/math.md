---
order: 5
---

# 数论

## 一、质数（素数）

**素数**是指质数，一个大于 1 的自然数，除了 1 和它自身外，不能整除其他自然数的数叫做质数；

**质因子**能整除给定正整数的质数

### 1、判断质数

```c
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

```c
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

组合数：C ^b^~a~ ,从 a 个中选 b 个

```c
// c[a][b] 表示从a个苹果中选b个的方案数
const mod = 1e9 + 7;  //模上一个

for (int i = 0; i < N; i ++ )
    for (int j = 0; j <= i; j ++ ){
        if (!j) c[i][j] = 1;
        else c[i][j] = (c[i - 1][j] + c[i - 1][j - 1]) %mod;
    }

```
