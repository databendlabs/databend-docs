---
title: SIPHASH
---

Produces a 64-bit [SipHash](https://en.wikipedia.org/wiki/SipHash) hash value.

## Syntax

```sql
SIPHASH(<expr>)
```

## Examples

```sql
SELECT SIPHASH('1234567890');

┌───────────────────────┐
│ siphash('1234567890') │
├───────────────────────┤
│  18110648197875983073 │
└───────────────────────┘
```