---
title: CEILING
---

Alias for [CEIL](ceil.md).

## Syntax

```sql
CEILING( <x> )
```

## Examples

```sql
SELECT CEILING(-1.23);

┌───────────────────┐
│ ceiling((- 1.23)) │
├───────────────────┤
│                -1 │
└───────────────────┘
```