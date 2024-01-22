```
---
title: BITMAP_OR_COUNT
---

计算通过逻辑 OR 操作执行后的位图中设置为 1 的位数。

## 语法 {/*syntax*/}

```sql
BITMAP_OR_COUNT( <bitmap> )
```

## 示例 {/*examples*/}

```sql
SELECT BITMAP_OR_COUNT(TO_BITMAP('1, 3, 5'));

┌───────────────────────────────────────┐
│ bitmap_or_count(to_bitmap('1, 3, 5')) │
├───────────────────────────────────────┤
│                                     3 │
└───────────────────────────────────────┘
```
```