---
title: CEILING
---

Rounds the number up.

## Syntax

```sql
CEILING( <x> )
```

## Aliases

- [CEIL](ceil.md)

## Examples

```sql
SELECT CEILING(-1.23), CEIL(-1.23);

┌────────────────────────────────────┐
│ ceiling((- 1.23)) │ ceil((- 1.23)) │
├───────────────────┼────────────────┤
│                -1 │             -1 │
└────────────────────────────────────┘
```