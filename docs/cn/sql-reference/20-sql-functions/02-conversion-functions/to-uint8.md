---
title: TO_UINT8
---

将一个值转换为 UINT8 数据类型。

## Syntax

```sql
TO_UINT8( <expr> )
```

## Examples

```sql
SELECT TO_UINT8('123');

┌─────────────────┐
│ to_uint8('123') │
├─────────────────┤
│             123 │
└─────────────────┘
```