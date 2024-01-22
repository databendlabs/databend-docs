```markdown
---
title: BITMAP_CONTAINS
---

检查位图是否包含特定值。

## 语法 {/*syntax*/}

```sql
BITMAP_CONTAINS( <bitmap>, <value> )
```

## 示例 {/*examples*/}

```sql
SELECT BITMAP_CONTAINS(BUILD_BITMAP([1,4,5]), 1);

┌─────────────────────────────────────────────┐
│ bitmap_contains(build_bitmap([1, 4, 5]), 1) │
├─────────────────────────────────────────────┤
│ true                                        │
└─────────────────────────────────────────────┘
```
```