```markdown
---
title: LEAST
---

返回一组值中的最小值。

## 语法 {#syntax}

```sql
LEAST(<value1>, <value2> ...)
```

## 示例 {#examples}

```sql
SELECT LEAST(5, 9, 4);

┌────────────────┐
│ least(5, 9, 4) │
├────────────────┤
│              4 │
└────────────────┘
```
```