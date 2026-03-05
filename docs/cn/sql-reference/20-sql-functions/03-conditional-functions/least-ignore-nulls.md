---
title: LEAST_IGNORE_NULLS
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.738"/>

返回一组值中的最小值，忽略任何 NULL 值。

另请参阅：[LEAST](least.md)

## 语法

```sql
LEAST_IGNORE_NULLS(<value1>, <value2> ...)
```

## 示例

```sql
SELECT LEAST_IGNORE_NULLS(5, 9, 4), LEAST_IGNORE_NULLS(5, 9, null);
```

```sql
┌──────────────────────────────────────────────────────────────┐
│ least_ignore_nulls(5, 9, 4) │ least_ignore_nulls(5, 9, NULL) │
├─────────────────────────────┼────────────────────────────────┤
│                           4 │                              5 │
└──────────────────────────────────────────────────────────────┘
```