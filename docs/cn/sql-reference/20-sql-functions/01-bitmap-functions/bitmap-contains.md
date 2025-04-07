---
title: BITMAP_CONTAINS
---

检查 bitmap 是否包含特定值。

## 句法

```sql
BITMAP_CONTAINS( <bitmap>, <value> )
```

## 示例

```sql
SELECT BITMAP_CONTAINS(BUILD_BITMAP([1,4,5]), 1);

┌─────────────────────────────────────────────┐
│ bitmap_contains(build_bitmap([1, 4, 5]), 1) │
├─────────────────────────────────────────────┤
│ true                                        │
└─────────────────────────────────────────────┘
```