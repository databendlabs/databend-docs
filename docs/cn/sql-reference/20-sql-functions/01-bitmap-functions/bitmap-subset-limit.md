---
title: BITMAP_SUBSET_LIMIT
---

生成源 bitmap 的子 bitmap，从起始值开始，具有大小限制。

## 语法

```sql
BITMAP_SUBSET_LIMIT( <bitmap>, <start>, <limit> )
```

## 示例

```sql
SELECT BITMAP_SUBSET_LIMIT(BUILD_BITMAP([1,4,5]), 2, 2)::String;

┌────────────────────────────────────────────────────────────┐
│ bitmap_subset_limit(build_bitmap([1, 4, 5]), 2, 2)::string │
├────────────────────────────────────────────────────────────┤
│ 4,5                                                        │
└────────────────────────────────────────────────────────────┘
```