---
title: BITMAP_INTERSECT
---

计算位图中设置为1的位数，通过执行逻辑INTERSECT操作。

## 语法

```sql
BITMAP_INTERSECT( <bitmap> )
```

## 示例

```sql
SELECT BITMAP_INTERSECT(TO_BITMAP('1, 3, 5'))::String;

┌────────────────────────────────────────────────┐
│ bitmap_intersect(to_bitmap('1, 3, 5'))::string │
├────────────────────────────────────────────────┤
│ 1,3,5                                          │
└────────────────────────────────────────────────┘
```