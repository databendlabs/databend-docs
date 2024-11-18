---
title: TRIM_BOTH
---

Removes specific characters from both ends of a string.

See also: [TRIM](trim.md)

## Syntax

```sql
TRIM_BOTH(<string>, <trim_character>)
```

## Examples

```sql
SELECT TRIM_BOTH('xxdatabendxx', 'xx');

┌─────────────────────────────────┐
│ trim_both('xxdatabendxx', 'xx') │
├─────────────────────────────────┤
│ databend                        │
└─────────────────────────────────┘
```