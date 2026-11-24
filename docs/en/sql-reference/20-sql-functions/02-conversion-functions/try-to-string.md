---
title: TRY_TO_STRING
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.964-nightly"/>

Converts Binary input to a String. Unlike [TO_STRING](to-string.md), it returns `NULL` for conversion failures instead of raising an error. This page describes the Binary overloads, not date formatting.

## Syntax

```sql
TRY_TO_STRING( <binary_expr> )
TRY_TO_STRING( <binary_expr>, '<format>' )
```

## Return value and errors

Returns Nullable(String). The one-argument form decodes UTF-8. It permits replacement of invalid bytes only when `binary_output_format = 'utf-8-lossy'`.

The two-argument form accepts a character set label, `hex`, or `base64`, as described in [TO_STRING](to-string.md). Malformed bytes or unsupported labels return `NULL`. A `NULL` input or scalar format also returns `NULL`.

The format must be a scalar constant. A column format raises an error; `TRY_TO_STRING` does not suppress this parameter error.

## Example

```sql
SELECT TRY_TO_STRING(FROM_HEX('C4E3BAC3'), 'gbk');
-- 你好

SELECT TRY_TO_STRING(FROM_HEX('C4'), 'gbk');
-- NULL
```
