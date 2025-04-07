---
title: TO_BITMAP
---

将值转换为 BITMAP 数据类型。

## Syntax

```sql
TO_BITMAP( <expr> )
```

## Examples

```sql
SELECT TO_BITMAP('1101');

┌───────────────────┐
│ to_bitmap('1101') │
├───────────────────┤
│ <bitmap binary>   │
└───────────────────┘
```