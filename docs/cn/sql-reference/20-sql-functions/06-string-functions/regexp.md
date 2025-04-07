---
title: REGEXP
---

如果字符串 `<expr>` 与 `<pattern>` 指定的正则表达式匹配，则返回 `true`，否则返回 `false`。

## 句法

```sql
<expr> REGEXP <pattern>
```

## 别名

- [RLIKE](rlike.md)

## 示例

```sql
SELECT 'databend' REGEXP 'd*', 'databend' RLIKE 'd*';

┌────────────────────────────────────────────────────┐
│ ('databend' regexp 'd*') │ ('databend' rlike 'd*') │
├──────────────────────────┼─────────────────────────┤
│ true                     │ true                    │
└────────────────────────────────────────────────────┘
```