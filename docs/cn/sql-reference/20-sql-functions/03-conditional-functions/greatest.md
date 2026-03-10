---
title: GREATEST
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新：v1.2.738"/>

返回一组值中的最大值。如果集合中的任何值为 `NULL`，则该函数返回 `NULL`。

另请参见：[GREATEST_IGNORE_NULLS](greatest-ignore-nulls.md)

## 语法

```sql
GREATEST(<value1>, <value2> ...)
```

## 示例

```sql
SELECT GREATEST(5, 9, 4), GREATEST(5, 9, null);
```

```sql
┌──────────────────────────────────────────┐
│ greatest(5, 9, 4) │ greatest(5, 9, NULL) │
├───────────────────┼──────────────────────┤
│                 9 │ NULL                 │
└──────────────────────────────────────────┘
```