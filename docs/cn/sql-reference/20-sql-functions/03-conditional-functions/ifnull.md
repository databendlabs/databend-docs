```markdown
---
title: IFNULL
---

返回 `<expr1>` 如果它不是 NULL。否则返回 `<expr2>`。它们必须具有相同的数据类型。

## 语法 {/*syntax*/}

```sql
IFNULL(<expr1>, <expr2>)
```

## 示例 {/*examples*/}

```sql
SELECT IFNULL(0, NULL);

┌─────────────────┐
│ ifnull(0, null) │
├─────────────────┤
│               0 │
└─────────────────┘
```
```