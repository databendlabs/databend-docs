---
title: SIPHASH
---

Produces a 64-bit [SipHash](https://en.wikipedia.org/wiki/SipHash) hash value.

## Syntax

```sql
SIPHASH(<expr>)
```

## Aliases

- [SIPHASH64](siphash64.md)

## Examples

```sql
SELECT SIPHASH('1234567890'), SIPHASH64('1234567890');

┌─────────────────────────────────────────────────┐
│ siphash('1234567890') │ siphash64('1234567890') │
├───────────────────────┼─────────────────────────┤
│  18110648197875983073 │    18110648197875983073 │
└─────────────────────────────────────────────────┘
```