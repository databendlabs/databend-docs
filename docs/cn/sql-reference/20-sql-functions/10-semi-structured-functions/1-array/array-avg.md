---
title: ARRAY_AVG
---

计算数组中数值元素的平均值。NULL 元素会被忽略，若数组包含非数值类型将报错。

## 语法

```sql
ARRAY_AVG(<array>)
```

## 返回类型

数值类型（使用能够容纳结果的最小数值精度）。

## 示例

```sql
SELECT ARRAY_AVG([1, 2, 3, 4]) AS avg_int;
```

```
+---------+
| avg_int |
+---------+
|     2.5 |
+---------+
```

```sql
SELECT ARRAY_AVG([1.5, 2.5, 3.5]) AS avg_decimal;
```

```
+-------------+
| avg_decimal |
+-------------+
|      2.5000 |
+-------------+
```

```sql
SELECT ARRAY_AVG([10, NULL, 4]) AS avg_with_null;
```

```
+---------------+
| avg_with_null |
+---------------+
|           7.0 |
+---------------+
```
