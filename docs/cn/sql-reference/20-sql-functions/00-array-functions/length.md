```markdown
---
title: LENGTH
---

返回数组的长度。

## 语法 {/*syntax*/}

```sql
LENGTH( <array> )
```

## 示例 {/*examples*/}

```sql
SELECT LENGTH([1, 2]);

┌────────────────┐
│ length([1, 2]) │
├────────────────┤
│              2 │
└────────────────┘
```
```