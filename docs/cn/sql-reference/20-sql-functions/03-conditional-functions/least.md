---
title: LEAST
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.738"/>

返回一组值中的最小值。如果集合中的任何值为 `NULL`，则该函数返回 `NULL`。

另请参阅：[LEAST_IGNORE_NULLS](least-ignore-nulls.md)

## 语法

```sql
LEAST(<value1>, <value2> ...)
```

## 示例

```sql
SELECT LEAST(5, 9, 4), LEAST(5, 9, null);
```

```
┌────────────────────────────────────┐
│ least(5, 9, 4) │ least(5, 9, NULL) │
├────────────────┼───────────────────┤
│              4 │ NULL              │
└────────────────────────────────────┘
```