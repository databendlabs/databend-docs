```markdown
---
title: BITMAP_AND_COUNT
---

对位图执行逻辑与操作后，计算设置为1的位数。

## 语法 {/*syntax*/}

```sql
BITMAP_AND_COUNT( <bitmap> )
```

## 示例 {/*examples*/}

```sql
SELECT BITMAP_AND_COUNT(TO_BITMAP('1, 3, 5'));

┌────────────────────────────────────────┐
│ bitmap_and_count(to_bitmap('1, 3, 5')) │
├────────────────────────────────────────┤
│                                      3 │
└────────────────────────────────────────┘
```
```