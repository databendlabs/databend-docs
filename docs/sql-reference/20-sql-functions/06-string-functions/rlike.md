---
title: RLIKE
---

Returns `true` if the string `<expr>` matches the regular expression specified by the `<pattern>`, `false` otherwise.

## Syntax

```sql
<expr> RLIKE <pattern>
```

## Aliases

- [REGEXP](regexp.md)

## Examples

```sql
SELECT 'databend' REGEXP 'd*', 'databend' RLIKE 'd*';

┌────────────────────────────────────────────────────┐
│ ('databend' regexp 'd*') │ ('databend' rlike 'd*') │
├──────────────────────────┼─────────────────────────┤
│ true                     │ true                    │
└────────────────────────────────────────────────────┘
```