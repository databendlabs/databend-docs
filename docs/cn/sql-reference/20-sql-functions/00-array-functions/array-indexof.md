```markdown
---
title: ARRAY_INDEXOF
---

返回元素在数组中的索引（基于1），如果数组包含该元素。

## 语法 {#syntax}

```sql
ARRAY_INDEXOF( <array>, <element> )
```

## 示例 {#examples}

```sql
SELECT ARRAY_INDEXOF([1, 2, 9], 9);

┌─────────────────────────────┐
│ array_indexof([1, 2, 9], 9) │
├─────────────────────────────┤
│                           3 │
└─────────────────────────────┘
```
```