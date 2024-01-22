---
title: ARRAY_SLICE
---

Extracts a slice from the array by index (1-based).

## Syntax

```sql
ARRAY_SLICE( <array>, <start>[, <end>] )
```

## Examples

```sql
SELECT ARRAY_SLICE([1, 21, 32, 4], 2, 3);

┌───────────────────────────────────┐
│ array_slice([1, 21, 32, 4], 2, 3) │
├───────────────────────────────────┤
│ [21,32]                           │
└───────────────────────────────────┘
```