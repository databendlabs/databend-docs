---
title: TO_INT8
---

将值转换为 INT8 数据类型。

## Syntax

```sql
TO_INT8( <expr> )
```

## Examples

```sql
SELECT TO_INT8('123');

┌────────────────┐
│ to_int8('123') │
│      UInt8     │
├────────────────┤
│            123 │
└────────────────┘
```