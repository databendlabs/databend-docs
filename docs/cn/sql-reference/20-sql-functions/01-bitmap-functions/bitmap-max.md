---
title: BITMAP_MAX
---

获取 bitmap 中的最大值。

## 语法

```sql
BITMAP_MAX( <bitmap> )
```

## 示例

```sql
SELECT BITMAP_MAX(BUILD_BITMAP([1,4,5]));

┌─────────────────────────────────────┐
│ bitmap_max(build_bitmap([1, 4, 5])) │
├─────────────────────────────────────┤
│                                   5 │
└─────────────────────────────────────┘
```