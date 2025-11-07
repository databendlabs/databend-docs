---
title: ARRAY_SUM
---

求数组中数值元素的总和。NULL 项会被忽略，若存在非数值类型则报错。

## 语法

```sql
ARRAY_SUM(<array>)
```

## 返回类型

与数组中最高精度的数值类型一致。

## 示例

```sql
SELECT ARRAY_SUM([1, 2, 3, 4]) AS total;
```

```
+-------+
| total |
+-------+
|    10 |
+-------+
```

```sql
SELECT ARRAY_SUM([1.5, 2.25, 3.0]) AS total;
```

```
+-------+
| total |
+-------+
|  6.75 |
+-------+
```

```sql
SELECT ARRAY_SUM([10, NULL, -3]) AS total;
```

```
+-------+
| total |
+-------+
|     7 |
+-------+
```
