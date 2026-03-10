---
title: ARRAY_MEDIAN
---

计算数组中数值的中位数。NULL 元素会被忽略；当数组长度为偶数时，返回两个中间值的平均数。

## 语法

```sql
ARRAY_MEDIAN(<array>)
```

## 返回类型

数值型。

## 示例

```sql
SELECT ARRAY_MEDIAN([1, 3, 2, 4]) AS med_even;
```

```
+----------+
| med_even |
+----------+
|      2.5 |
+----------+
```

```sql
SELECT ARRAY_MEDIAN([1, 3, 5]) AS med_odd;
```

```
+--------+
| med_odd|
+--------+
|    3.0 |
+--------+
```

```sql
SELECT ARRAY_MEDIAN([NULL, 10, 20, 30]) AS med_null;
```

```
+---------+
| med_null|
+---------+
|    20.0 |
+---------+
```
