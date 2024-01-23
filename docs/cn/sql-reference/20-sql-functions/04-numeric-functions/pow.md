```markdown
---
title: POWER, POW
---

返回 `x` 的 `y` 次幂的值。

## 语法 {#syntax}

```sql
POWER( <x, y> )

-- POW 是 POWER 的别名
POW( <x, y> )
```

## 示例 {#examples}

```sql
SELECT POW(-2, 2);

┌───────────────┐
│ pow((- 2), 2) │
├───────────────┤
│             4 │
└───────────────┘
```
```