---
title: TRY_TO_BINARY
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.673"/>

An enhanced version of [TO_BINARY](to-binary.md) that converts an input expression to a binary value, returning `NULL` if the conversion fails instead of raising an error.

See also: [TO_BINARY](to-binary.md)

## Syntax

```sql
TRY_TO_BINARY( <expr> )
```

## String input with an explicit format

<FunctionDescription description="Introduced or updated: v1.2.964-nightly"/>

```sql
TRY_TO_BINARY( <string_expr>, '<format>' )
```

Accepts the formats of [TO_BINARY](to-binary.md): `hex`, `base64`, or a character set label. Returns Nullable(Binary). A `NULL` input or scalar format returns `NULL`. Conversion failures return `NULL`. These include invalid text, unknown labels, unsupported UTF-16 encoding, and characters that the target character set cannot represent.

The format must be a scalar constant. A column format raises an error, even with `TRY_TO_BINARY`. **Compatibility change:** before v1.2.964-nightly, the two-argument form returned `NULL` for a column format. Replace that argument with a constant format. Do not use `TRY_TO_BINARY` to suppress this parameter error.

```sql
SELECT TO_HEX(TRY_TO_BINARY('你好', 'gbk'));
-- c4e3bac3

SELECT TRY_TO_BINARY('😀', 'gbk');
-- NULL
```

## Examples

This example successfully converts the JSON data to binary:

```sql
SELECT TRY_TO_BINARY(PARSE_JSON('{"key":"value", "number":123}')) AS binary_variant_success;

┌──────────────────────────────────────────────────────────────────────────┐
│                              binary_variant                              │
├──────────────────────────────────────────────────────────────────────────┤
│ 40000002100000031000000610000005200000026B65796E756D62657276616C7565507B │
└──────────────────────────────────────────────────────────────────────────┘
```

This example demonstrates that the function fails to convert when the input is `NULL`:

```sql
SELECT TRY_TO_BINARY(PARSE_JSON(NULL)) AS binary_variant_invalid_json;

┌─────────────────────────────┐
│ binary_variant_invalid_json │
├─────────────────────────────┤
│ NULL                        │
└─────────────────────────────┘
```