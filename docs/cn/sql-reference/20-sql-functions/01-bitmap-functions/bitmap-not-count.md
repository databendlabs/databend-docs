---
title: BITMAP_NOT_COUNT
---

通过执行逻辑NOT操作，计算位图中设置为0的位数。

## 语法

```sql
BITMAP_NOT_COUNT( <bitmap> )
```

## 示例

```sql
SELECT BITMAP_NOT_COUNT(TO_BITMAP('1, 3, 5'));

┌────────────────────────────────────────┐
│ bitmap_not_count(to_bitmap('1, 3, 5')) │
├────────────────────────────────────────┤
│                                      3 │
└────────────────────────────────────────┘
```