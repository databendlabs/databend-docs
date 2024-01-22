```markdown
---
title: ARRAY_UNIQUE
---

计算数组中的唯一元素数量（NULL除外）。

## 语法 {/*syntax*/}

```sql
ARRAY_UNIQUE( <array> )
```

## 示例 {/*examples*/}

```sql
SELECT ARRAY_UNIQUE([1, 2, 3, 3, 4]);

┌───────────────────────────────┐
│ array_unique([1, 2, 3, 3, 4]) │
├───────────────────────────────┤
│                             4 │
└───────────────────────────────┘
```
```