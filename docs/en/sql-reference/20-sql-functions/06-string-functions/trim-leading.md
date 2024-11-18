---
title: TRIM_LEADING
---

Removes specific characters from the beginning (left side) of a string.

See also: [TRIM_TRAILING](trim-trailing.md)

## Syntax

```sql
TRIM_LEADING(<string>, <trim_character>)
```

## Examples

```sql
SELECT TRIM_LEADING('xxdatabend', 'xx');

┌──────────────────────────────────┐
│ trim_leading('xxdatabend', 'xx') │
├──────────────────────────────────┤
│ databend                         │
└──────────────────────────────────┘
```