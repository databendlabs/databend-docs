---
title: REGEXP
---

如果字符串 `<expr>` 匹配 `<pattern>` 指定的正则表达式，则返回 `true`，否则返回 `false`。

## 语法

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