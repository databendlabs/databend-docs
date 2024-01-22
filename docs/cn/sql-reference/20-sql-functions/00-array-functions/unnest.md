```markdown
---
title: UNNEST
---

展开数组并返回元素集合。

## 语法 {/*syntax*/}

```sql
UNNEST( <array> )
```

## 示例 {/*examples*/}

```sql
SELECT UNNEST([1, 2]);

┌─────────────────┐
│  unnest([1, 2]) │
├─────────────────┤
│               1 │
│               2 │
└─────────────────┘

-- UNNEST(array) 可以作为表函数使用。
SELECT * FROM UNNEST([1, 2]);

┌─────────────────┐
│      value      │
├─────────────────┤
│               1 │
│               2 │
└─────────────────┘
```
```