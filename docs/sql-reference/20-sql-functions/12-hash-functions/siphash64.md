---
title: SIPHASH64
---

Alias for [SIPHASH](siphash.md).

## Syntax

```sql
SIPHASH64(<expr>)
```

## Examples

```sql
SELECT SIPHASH64('1234567890');

┌─────────────────────────┐
│ siphash64('1234567890') │
├─────────────────────────┤
│    18110648197875983073 │
└─────────────────────────┘
```