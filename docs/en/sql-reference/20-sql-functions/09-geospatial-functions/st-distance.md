---
title: ST_DISTANCE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.555"/>

Returns the minimum [Euclidean distance](https://en.wikipedia.org/wiki/Euclidean_distance) between two GEOMETRY objects.

## Syntax

```sql
ST_DISTANCE(<geometry1>, <geometry2>)
```

## Arguments

| Arguments     | Description                                                                   |
|---------------|-------------------------------------------------------------------------------|
| `<geometry1>` | The argument must be an expression of type GEOMETRY and must contain a Point. |
| `<geometry2>` | The argument must be an expression of type GEOMETRY and must contain a Point. |

:::note
- Returns NULL if one or more input points are NULL.
- The function reports an error if the two input GEOMETRY objects have different SRIDs.
:::

## Return Type

Double.

## Examples

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
