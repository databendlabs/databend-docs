```markdown
---
title: ARRAY_REMOVE_LAST
---

从数组中移除最后一个元素。

## 语法 {#syntax}

```sql
ARRAY_REMOVE_LAST( <array> )
```

## 示例 {#examples}

```sql
SELECT ARRAY_REMOVE_LAST([1, 2, 3]);

┌──────────────────────────────┐
│ array_remove_last([1, 2, 3]) │
├──────────────────────────────┤
│ [1,2]                        │
└──────────────────────────────┘
```
```