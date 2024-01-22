```markdown
---
title: CEILING
---

别名为 [CEIL](ceil.md)。

## 语法 {#syntax}

```sql
CEILING( <x> )
```

## 示例 {#examples}

```sql
SELECT CEILING(-1.23);

┌───────────────────┐
│ ceiling((- 1.23)) │
├───────────────────┤
│                -1 │
└───────────────────┘
```
```