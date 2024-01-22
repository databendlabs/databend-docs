```markdown
---
title: 范围
---

返回由 [start, end) 收集的数组。

## 语法 {#syntax}

```sql
RANGE( <start>, <end> )
```

## 示例 {#examples}

```sql
SELECT RANGE(1, 5);

┌───────────────┐
│  range(1, 5)  │
├───────────────┤
│ [1,2,3,4]     │
└───────────────┘
```
```