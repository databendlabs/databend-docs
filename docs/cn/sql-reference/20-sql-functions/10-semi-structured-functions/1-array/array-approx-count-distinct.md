---
title: ARRAY_APPROX_COUNT_DISTINCT
---

返回数组中不同元素数量的近似值（忽略 NULL）。实现基于与 [`APPROX_COUNT_DISTINCT`](../../07-aggregate-functions/aggregate-approx-count-distinct.md) 相同的 HyperLogLog 算法。

## 语法

```sql
ARRAY_APPROX_COUNT_DISTINCT(<array>)
```

## 返回类型

`BIGINT`

## 示例

```sql
SELECT ARRAY_APPROX_COUNT_DISTINCT([1, 1, 2, 3, 3, 3]) AS approx_cnt;
```

```
+------------+
| approx_cnt |
+------------+
|          3 |
+------------+
```

```sql
SELECT ARRAY_APPROX_COUNT_DISTINCT([NULL, 'a', 'a', 'b']) AS approx_cnt_text;
```

```
+------------------+
| approx_cnt_text  |
+------------------+
|                2 |
+------------------+
```
