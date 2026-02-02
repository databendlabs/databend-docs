---
title: ST_AREA
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.555"/>

Returns the area of a GEOMETRY or GEOGRAPHY object.

## Syntax

```sql
ST_AREA(<geometry_or_geography>)
```

## Arguments

| Arguments                 | Description                                                     |
|---------------------------|-----------------------------------------------------------------|
| `<geometry_or_geography>` | The argument must be an expression of type GEOMETRY or GEOGRAPHY. |

## Return Type

Double.

## Examples

### GEOMETRY examples

```sql
SELECT
  ST_AREA(
    TO_GEOMETRY('POLYGON((0 0, 1 0, 1 1, 0 1, 0 0))')
  ) AS area

┌──────┐
│ area │
├──────┤
│ 1.0  │
└──────┘
```

### GEOGRAPHY examples

```sql
SELECT
  ST_AREA(
    TO_GEOGRAPHY('POLYGON((0 0, 1 0, 1 1, 0 1, 0 0))')
  ) AS area

╭────────────────────╮
│        area        │
├────────────────────┤
│ 12308778361.469452 │
╰────────────────────╯
```
