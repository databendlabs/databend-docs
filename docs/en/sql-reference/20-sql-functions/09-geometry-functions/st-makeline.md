---
title: ST_MAKELINE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.391"/>

Constructs a GEOMETRY object that represents a line connecting the points in the input two GEOMETRY objects.

## Syntax

```sql
ST_MAKELINE(<geometry1>, <geometry2>)
```

## Aliases

- [ST_MAKE_LINE](st-make-line.md)

## Arguments

| Arguments     | Description                                                                                                 |
|---------------|-------------------------------------------------------------------------------------------------------------|
| `<geometry1>` | A GEOMETRY object containing the points to connect. This object must be a Point, MultiPoint, or LineString. |
| `<geometry2>` | A GEOMETRY object containing the points to connect. This object must be a Point, MultiPoint, or LineString. |

## Return Type

Geometry.

## Examples

```sql
SELECT
  ST_MAKELINE(
    ST_GEOMETRYFROMWKT(
      'POINT(-122.306100 37.554162)'
    ),
    ST_GEOMETRYFROMWKT(
      'POINT(-104.874173 56.714538)'
    )
  ) AS pipeline_line;

┌───────────────────────────────────────────────────────┐
│                     pipeline_line                     │
├───────────────────────────────────────────────────────┤
│ LINESTRING(-122.3061 37.554162,-104.874173 56.714538) │
└───────────────────────────────────────────────────────┘
```
