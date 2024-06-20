---
title: BITMAP_OR_COUNT
---

计算位图中设置为1的位数，通过执行逻辑OR操作。

## 语法

```sql
BITMAP_OR_COUNT( <bitmap> )
```

## 示例

```sql
SELECT BITMAP_OR_COUNT(TO_BITMAP('1, 3, 5'));

┌───────────────────────────────────────┐
│ bitmap_or_count(to_bitmap('1, 3, 5')) │
├───────────────────────────────────────┤
│                                     3 │
└───────────────────────────────────────┘
```