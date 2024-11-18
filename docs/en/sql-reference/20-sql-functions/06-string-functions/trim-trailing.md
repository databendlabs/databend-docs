---
title: TRIM_TRAILING
---

Removes specific characters from the end (right side) of a string.

See also: 

- [RTRIM](rtrim.md)
- [TRIM_LEADING](trim-leading.md)

## Syntax

```sql
TRIM_TRAILING(<string>, <trim_character>)
```

## Examples

```sql
SELECT TRIM_TRAILING('databendxx', 'xx');

┌───────────────────────────────────┐
│ trim_trailing('databendxx', 'xx') │
├───────────────────────────────────┤
│ databend                          │
└───────────────────────────────────┘
```