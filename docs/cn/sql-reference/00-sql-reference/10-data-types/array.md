---
title: Array
description: 指定数据类型的数组。
sidebar_position: 8
---

## 概览

`ARRAY(T)` 存储元素类型均为 `T` 的变长集合。在创建表时定义元素类型，并使用数组函数来读取或转换这些值。

:::note
Databend 数组的索引从 1 开始。`arr[1]` 返回第一个元素，`arr[n]` 返回最后一个元素。
:::

## 示例

```sql
CREATE TABLE array_samples (arr ARRAY(INT64));

INSERT INTO array_samples VALUES ([1, 2, 3]), ([10, 20]);

SELECT
  arr,
  arr[1]   AS first_elem,
  arr[2]   AS second_elem
FROM array_samples;
```

结果：
```
┌────────────┬────────────┬──────────────┐
│ arr        │ first_elem │ second_elem │
├────────────┼────────────┼──────────────┤
│ [1,2,3]    │          1 │            2 │
│ [10,20]    │         10 │           20 │
└────────────┴────────────┴──────────────┘
```

```sql
-- 索引 0 总是返回 NULL，因为数组是从 1 开始索引的。
SELECT arr[0] AS zeroth_elem FROM array_samples;
```

结果：
```
┌─────────────┐
│ zeroth_elem │
├─────────────┤
│ NULL        │
│ NULL        │
└─────────────┘
```
