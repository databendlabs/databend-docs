---
title: BITMAP_INTERSECT
---

计算通过执行逻辑 INTERSECT 操作在 bitmap 中设置为 1 的位数。

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