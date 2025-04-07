---
title: BITMAP_AND_COUNT
---

通过执行逻辑 AND 操作，计算 bitmap 中设置为 1 的位数。

## Syntax

```sql
BITMAP_AND_COUNT( <bitmap> )
```

## Examples

```sql
SELECT BITMAP_AND_COUNT(TO_BITMAP('1, 3, 5'));

┌────────────────────────────────────────┐
│ bitmap_and_count(to_bitmap('1, 3, 5')) │
├────────────────────────────────────────┤
│                                      3 │
└────────────────────────────────────────┘
```