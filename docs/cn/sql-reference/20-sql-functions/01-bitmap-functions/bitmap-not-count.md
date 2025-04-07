---
title: BITMAP_NOT_COUNT
---

通过执行逻辑 NOT 运算，计算 bitmap 中设置为 0 的位数。

## Syntax

```sql
BITMAP_NOT_COUNT( <bitmap> )
```

## Examples

```sql
SELECT BITMAP_NOT_COUNT(TO_BITMAP('1, 3, 5'));

┌────────────────────────────────────────┐
│ bitmap_not_count(to_bitmap('1, 3, 5')) │
├────────────────────────────────────────┤
│                                      3 │
└────────────────────────────────────────┘
```