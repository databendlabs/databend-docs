---
title: BITMAP_AND_COUNT
---

通过执行逻辑与（AND）操作，计算位图（bitmap）中设置为 1 的比特位数量。

## 语法

```sql
BITMAP_AND_COUNT( <bitmap> )
```

## 示例

```sql
SELECT BITMAP_AND_COUNT(TO_BITMAP('1, 3, 5'));

┌────────────────────────────────────────┐
│ bitmap_and_count(to_bitmap('1, 3, 5')) │
├────────────────────────────────────────┤
│                                      3 │
└────────────────────────────────────────┘
```