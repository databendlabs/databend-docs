---
title: ST_EQUALS
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.564"/>

Returns TRUE if two GEOMETRY objects are spatially equal.

## Syntax

```sql
ST_EQUALS(<geometry1>, <geometry2>)
```

## Arguments

| Arguments     | Description                                           |
|---------------|-------------------------------------------------------|
| `<geometry1>` | The argument must be an expression of type GEOMETRY. |
| `<geometry2>` | The argument must be an expression of type GEOMETRY. |

:::note
- The function reports an error if the two input GEOMETRY objects have different SRIDs.
:::

## Return Type

Boolean.

## Examples

```sql
SELECT ST_EQUALS(
  TO_GEOMETRY('POINT(1 1)'),
  TO_GEOMETRY('POINT(1 1)')
) AS equals;

╭────────╮
│ equals │
├────────┤
│ true   │
╰────────╯

SELECT ST_EQUALS(
  TO_GEOMETRY('POINT(1 1)'),
  TO_GEOMETRY('POINT(1 2)')
) AS equals;

╭────────╮
│ equals │
├────────┤
│ false  │
╰────────╯
```
