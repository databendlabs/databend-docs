---
title: ARRAY_STDDEV_SAMP
---

计算数组中数值的样本标准差。NULL 元素会被忽略。别名：`ARRAY_STDDEV`。

## 语法

```sql
ARRAY_STDDEV_SAMP(<array>)
```

## 返回类型

浮点型。

## 示例

```sql
SELECT ARRAY_STDDEV_SAMP([2, 4, 4, 4, 5, 5, 7, 9]) AS stddev_samp;
```

```
+-------------+
| stddev_samp |
+-------------+
| 2.1380899353|
+-------------+
```

```sql
SELECT ARRAY_STDDEV_SAMP([1.5, 2.5, NULL, 3.5]) AS stddev_samp_null;
```

```
+------------------+
| stddev_samp_null |
+------------------+
|                1 |
+------------------+
```
