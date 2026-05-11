---
title: ST_COLLECT
---

Collects multiple GEOMETRY values into a single GEOMETRY result.

This function supports GEOMETRY only.

## Syntax

```sql
ST_COLLECT(<geometry>)
```

## Arguments

| Arguments | Description |
|-----------|-------------|
| `<geometry>` | An expression of type GEOMETRY. |

## Return Type

GEOMETRY. Depending on the input, the result can be a `MULTIPOINT`, `MULTILINESTRING`, `MULTIPOLYGON`, or `GEOMETRYCOLLECTION`.

:::note
- NULL input rows are ignored.
- If all input rows are NULL, the result is NULL.
- If the input GEOMETRY values use different SRIDs, the function returns an error.
:::

## Example

```sql
WITH data AS (
    SELECT TO_GEOMETRY('POINT(0 0)') AS g
    UNION ALL
    SELECT TO_GEOMETRY('LINESTRING(1 1,2 2)')
)
SELECT ST_ASWKT(ST_COLLECT(g)) FROM data;

╭────────────────────────────────────────────────────╮
│               st_aswkt(st_collect(g))              │
├────────────────────────────────────────────────────┤
│ GEOMETRYCOLLECTION(POINT(0 0),LINESTRING(1 1,2 2)) │
╰────────────────────────────────────────────────────╯
```
