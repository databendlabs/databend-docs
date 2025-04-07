---
title: BITMAP_UNION
---

通过执行逻辑 UNION 操作，计算 bitmap 中设置为 1 的位数。

## Syntax

```sql
BITMAP_UNION( <bitmap> )
```

## Examples

```sql
SELECT BITMAP_UNION(TO_BITMAP('1, 3, 5'))::String;

┌────────────────────────────────────────────┐
│ bitmap_union(to_bitmap('1, 3, 5'))::string │
├────────────────────────────────────────────┤
│ 1,3,5                                      │
└────────────────────────────────────────────┘
```