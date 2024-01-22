```
---
title: BITMAP_UNION
---

通过执行逻辑UNION操作，计算位图中设置为1的位数。

## 语法 {#syntax}

```sql
BITMAP_UNION( <bitmap> )
```

## 示例 {#examples}

```sql
SELECT BITMAP_UNION(TO_BITMAP('1, 3, 5'))::String;

┌────────────────────────────────────────────┐
│ bitmap_union(to_bitmap('1, 3, 5'))::string │
├────────────────────────────────────────────┤
│ 1,3,5                                      │
└────────────────────────────────────────────┘
```
```