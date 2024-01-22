---
title: "CAST, ::"
---

Converts a value from one data type to another. `::` is an alias for CAST.

## Syntax

```sql
CAST( <expr> AS <data_type> )

<expr>::<data_type>
```

## Examples

```sql
SELECT CAST(1 AS VARCHAR), 1::VARCHAR;

┌───────────────────────────────┐
│ cast(1 as string) │ 1::string │
├───────────────────┼───────────┤
│ 1                 │ 1         │
└───────────────────────────────┘
```