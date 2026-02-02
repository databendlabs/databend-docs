---
title: ST_DISTANCE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.555"/>

Returns the minimum [Euclidean distance](https://en.wikipedia.org/wiki/Euclidean_distance) between two GEOMETRY or GEOGRAPHY objects.

## Syntax

```sql
ST_DISTANCE(<geometry_or_geography1>, <geometry_or_geography2>)
```

## Arguments

| Arguments     | Description                                                                   |
|---------------|-------------------------------------------------------------------------------|
| `<geometry_or_geography1>` | The argument must be an expression of type GEOMETRY or GEOGRAPHY and must contain a Point. |
| `<geometry_or_geography2>` | The argument must be an expression of type GEOMETRY or GEOGRAPHY and must contain a Point. |

:::note
- Returns NULL if one or more input points are NULL.
- The function reports an error if the two input GEOMETRY or GEOGRAPHY objects have different SRIDs.
:::

## Return Type

Double.

## Examples

### GEOMETRY examples

```sql
SELECT
  ST_DISTANCE(
    TO_GEOMETRY('POINT(0 0)'),
    TO_GEOMETRY('POINT(1 1)')
  ) AS distance

┌─────────────┐
│   distance  │
├─────────────┤
│ 1.414213562 │
└─────────────┘
```

### GEOGRAPHY examples

```sql
SELECT
  ST_DISTANCE(
    ST_GEOGFROMWKT('POINT(0 0)'),
    ST_GEOGFROMWKT('POINT(1 0)')
  ) AS distance

╭──────────────────╮
│     distance     │
├──────────────────┤
│ 111195.080233533 │
╰──────────────────╯
```
