---
title: Array(T)
description: 定义数据类型的数组。
---

## Array(T) 数据类型

ARRAY(T) 由定义的可变长度的内部 T 数据类型值组成，与半结构化数组非常相似，只是内部数据类型需要定义，而不是任意的。T 可以是任何数据类型。

:::note
Databend 使用基于 1 的编号约定来表示数组。一个包含 n 个元素的数组从 array [1] 开始，以 array [n] 结束。
:::

### 示例

```sql
CREATE TABLE array_int64_table(arr ARRAY(INT64));
```

```sql
DESC array_int64_table;
```

结果：

```
┌───────────────────────────────────────────────────┐
│  Field │     Type     │  Null  │ Default │  Extra │
├────────┼──────────────┼────────┼─────────┼────────┤
│ arr    │ ARRAY(INT64) │ YES    │ NULL    │        │
└───────────────────────────────────────────────────┘
```

```sql
-- Inserting array values into the table
INSERT INTO array_int64_table
VALUES
([1, 2, 3, 4]),
([5, 6, 7, 8]);
```

```sql
SELECT arr FROM array_int64_table;
```

结果：

```
┌─────────────────┐
│      arr[1]     │
├─────────────────┤
│               1 │
│               5 │
└─────────────────┘
```

```sql
-- Selecting the zeroth element of the 'arr' array from the table
SELECT arr[0]
FROM array_int64_table;
```

结果：

```
┌─────────────────┐
│      arr[0]     │
├─────────────────┤
│            NULL │
│            NULL │
└─────────────────┘
```