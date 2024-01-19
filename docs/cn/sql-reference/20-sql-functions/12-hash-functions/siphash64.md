```markdown
---
title: SIPHASH64
---

别名为 [SIPHASH](siphash.md)。

## 语法 {/*syntax*/}

```sql
SIPHASH64(<expr>)
```

## 示例 {/*examples*/}

```sql
SELECT SIPHASH64('1234567890');

┌─────────────────────────┐
│ siphash64('1234567890') │
├─────────────────────────┤
│    18110648197875983073 │
└─────────────────────────┘
```
```