---
title: ARRAY_STDDEV_POP
---

计算数组中数值的总体标准差。NULL 元素会被忽略。别名：`ARRAY_STD`。

## 语法

```sql
ARRAY_STDDEV_POP(<array>)
```

## 返回类型

浮点型。

## 示例

```sql
SELECT ARRAY_STDDEV_POP([2, 4, 4, 4, 5, 5, 7, 9]) AS stddev_pop;
```

```
+------------+
| stddev_pop |
+------------+
|          2 |
+------------+
```

```sql
SELECT ARRAY_STDDEV_POP([1.5, 2.5, NULL, 3.5]) AS stddev_pop_null;
```

```
+------------------+
| stddev_pop_null  |
+------------------+
| 0.816496580927726|
+------------------+
```
