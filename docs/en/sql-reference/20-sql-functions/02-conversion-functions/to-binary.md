---
title: TO_BINARY
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.673"/>

Converts supported data types, including variant, bitmap, geometry, and geography, into their binary representation.

See also: [TRY_TO_BINARY](try-to-binary.md)

## Syntax

```sql
TO_BINARY( <expr> )
```

## Examples

This example converts JSON data to binary:

```sql
SELECT TO_BINARY(PARSE_JSON('{"key":"value", "number":123}')) AS binary_variant;

┌──────────────────────────────────────────────────────────────────────────┐
│                              binary_variant                              │
├──────────────────────────────────────────────────────────────────────────┤
│ 40000002100000031000000610000005200000026B65796E756D62657276616C7565507B │
└──────────────────────────────────────────────────────────────────────────┘
```

This example converts bitmap data to binary:

```sql
SELECT TO_BINARY(TO_BITMAP('10,20,30')) AS binary_bitmap;

┌──────────────────────────────────────────────────────────────────────┐
│                             binary_bitmap                            │
├──────────────────────────────────────────────────────────────────────┤
│ 0100000000000000000000003A3000000100000000000200100000000A0014001E00 │
└──────────────────────────────────────────────────────────────────────┘
```

This example converts geometry data (WKT format) to binary:

```sql
SELECT TO_BINARY(ST_GEOMETRYFROMWKT('SRID=4326;POINT(1.0 2.0)')) AS binary_geometry;

┌────────────────────────────────────────────────────┐
│                   binary_geometry                  │
├────────────────────────────────────────────────────┤
│ 0101000020E6100000000000000000F03F0000000000000040 │
└────────────────────────────────────────────────────┘
```

This example converts geography data (EWKT format) to binary:

```sql
SELECT TO_BINARY(ST_GEOGRAPHYFROMEWKT('SRID=4326;POINT(-122.35 37.55)')) AS binary_geography;

┌────────────────────────────────────────────────────┐
│                  binary_geography                  │
├────────────────────────────────────────────────────┤
│ 0101000020E61000006666666666965EC06666666666C64240 │
└────────────────────────────────────────────────────┘
```