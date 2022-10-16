---
order: 1
toc: menu
---

# 排序

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
