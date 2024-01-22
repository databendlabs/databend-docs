```markdown
---
title: SIGN 函数
---

返回参数的符号，取值为 -1、0 或 1，这取决于 `x` 是负数、零还是正数，如果参数为 NULL 则返回 NULL。

## 语法 {#syntax}

```sql
SIGN( <x> )
```

## 示例 {#examples}

```sql
SELECT SIGN(0);

┌─────────┐
│ sign(0) │
├─────────┤
│       0 │
└─────────┘
```
```