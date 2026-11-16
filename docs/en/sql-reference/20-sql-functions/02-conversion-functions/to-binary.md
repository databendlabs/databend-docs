---
title: TO_BINARY
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.673"/>

Converts supported data types, including string, variant, bitmap, geometry, and geography, into their binary representation (hex format).

See also: [TRY_TO_BINARY](try-to-binary.md)

## Syntax

```sql
TO_BINARY( <expr> )
```

## String input with an explicit format

<FunctionDescription description="Introduced or updated: v1.2.964-nightly"/>

```sql
TO_BINARY( <string_expr>, '<format>' )
```

The two-argument form supports these formats:

- `hex`: decodes hexadecimal text to bytes.
- `base64`: decodes Base64 text to bytes.
- A character set label, such as `utf-8`, `gbk`, or `gb18030`: encodes the String in that character set. See [CONVERT_TO](convert-to.md) for encoding restrictions.

The format must be a scalar constant, not a column. Labels are case-insensitive. A `NULL` input or scalar format returns `NULL`. Invalid input, an unsupported label, or a character that the target character set cannot represent raises an error. UTF-16 encoding is not supported. Use [TRY_TO_BINARY](try-to-binary.md) to return `NULL` for conversion failures.

The explicit format does not use `binary_input_format`. The existing one-argument form still uses that setting for String input. A Binary result contains bytes; its displayed text depends on `binary_output_format`. Use [TO_HEX](to-hex.md) to inspect the bytes:

```sql
SELECT TO_HEX(TO_BINARY('你好', 'gbk'));
-- c4e3bac3
```

## Examples

This example converts a string to binary:

```sql
SELECT TO_BINARY('Databend');

┌───────────────────────┐
│ to_binary('Databend') │
├───────────────────────┤
│ 4461746162656E64      │
└───────────────────────┘
```

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