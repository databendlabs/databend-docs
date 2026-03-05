---
title: GREATEST_IGNORE_NULLS
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新：v1.2.738"/>

返回一组值中的最大值，忽略任何 NULL 值。

另请参阅：[GREATEST](greatest.md)

## 语法

```sql
GREATEST_IGNORE_NULLS(<value1>, <value2> ...)
```

## 示例

```sql
SELECT GREATEST_IGNORE_NULLS(5, 9, 4), GREATEST_IGNORE_NULLS(5, 9, null);
```

```sql
┌────────────────────────────────────────────────────────────────────┐
│ greatest_ignore_nulls(5, 9, 4) │ greatest_ignore_nulls(5, 9, NULL) │
├────────────────────────────────┼───────────────────────────────────┤
│                              9 │                                 9 │
└────────────────────────────────────────────────────────────────────┘
```