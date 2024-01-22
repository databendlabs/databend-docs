```markdown
---
title: ARRAY_CONTAINS
---

检查数组是否包含特定元素。

## 语法 {#syntax}

```sql
ARRAY_CONTAINS( <array>, <element> )
```

## 示例 {#examples}

```sql
SELECT ARRAY_CONTAINS([1, 2], 1);

┌───────────────────────────┐
│ array_contains([1, 2], 1) │
├───────────────────────────┤
│ true                      │
└───────────────────────────┘
```
```