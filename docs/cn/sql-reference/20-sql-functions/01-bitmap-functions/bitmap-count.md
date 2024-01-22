```markdown
---
title: BITMAP_COUNT
---

计算位图中设置为1的位数。

## 语法 {/*syntax*/}

```sql
BITMAP_COUNT( <bitmap> )
```

## 示例 {/*examples*/}

```sql
SELECT BITMAP_COUNT(BUILD_BITMAP([1,4,5]));

┌───────────────────────────────────────┐
│ bitmap_count(build_bitmap([1, 4, 5])) │
├───────────────────────────────────────┤
│                                     3 │
└───────────────────────────────────────┘
```
```