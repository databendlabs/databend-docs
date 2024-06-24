---
title: BITMAP_UNION
---

对位图执行逻辑 UNION 操作，并统计设置为 1 的位数。

## 语法

```sql
BITMAP_UNION( <bitmap> )
```

## 示例

```sql
SELECT BITMAP_UNION(TO_BITMAP('1, 3, 5'))::String;

┌────────────────────────────────────────────┐
│ bitmap_union(to_bitmap('1, 3, 5'))::string │
├────────────────────────────────────────────┤
│ 1,3,5                                      │
└────────────────────────────────────────────┘
```