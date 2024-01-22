```markdown
---
title: ARRAY_APPEND
---

向数组中追加一个元素。

## 语法 {/*syntax*/}

```sql
ARRAY_APPEND( <array>, <element>)
```

## 示例 {/*examples*/}

```sql
SELECT ARRAY_APPEND([3, 4], 5);

┌─────────────────────────┐
│ array_append([3, 4], 5) │
├─────────────────────────┤
│ [3,4,5]                 │
└─────────────────────────┘
```
```