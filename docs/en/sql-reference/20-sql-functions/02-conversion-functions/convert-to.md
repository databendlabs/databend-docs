---
title: CONVERT_TO / TRY_CONVERT_TO
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.964-nightly"/>

Encodes a String as Binary bytes in a specified character set. Use [CONVERT_FROM](convert-from.md) to decode those bytes back to a String.

## Syntax

```sql
CONVERT_TO( <string_expr>, '<charset>' )
TRY_CONVERT_TO( <string_expr>, '<charset>' )
```

## Arguments

- `string_expr`: the String to encode.
- `charset`: a scalar constant String with a case-insensitive WHATWG encoding label. Common labels include `utf-8`, `gbk`, `gb2312` (a GBK alias), `gb18030`, `big5`, `shift_jis`, `euc-kr`, and `windows-1252`. See [character set labels](convert-from.md#arguments).

`CONVERT_TO` accepts character sets only. To decode hexadecimal or Base64 text into bytes, use [TO_BINARY](to-binary.md) with `hex` or `base64` instead.

## Return value and errors

`CONVERT_TO` returns Binary. A `NULL` input or scalar character set returns `NULL`. An unsupported label or a character that the target character set cannot represent raises an error. Encoding does not substitute a question mark or numeric character reference for an unrepresentable character.

UTF-16 decoding is supported, but UTF-16 encoding is not. Labels that would fall back to a different output encoding are rejected. For example, `utf-16le` and `utf-16be` raise an error rather than produce UTF-8 bytes.

`TRY_CONVERT_TO` returns Nullable(Binary). It returns `NULL` for conversion failures, including unsupported labels or output encodings. Both functions reject a column character set argument with an error, even if its values contain valid labels.

The result contains bytes, not hexadecimal text. Its displayed text depends on `binary_output_format`. Use [TO_HEX](to-hex.md) to inspect the bytes.

## Examples

Encode a String as GBK bytes and decode it again:

```sql
SELECT TO_HEX(CONVERT_TO('你好', 'gbk'));
-- c4e3bac3

SELECT CONVERT_FROM(CONVERT_TO('你好', 'gbk'), 'gbk');
-- 你好
```

GBK cannot represent this emoji, but GB18030 can:

```sql
SELECT TRY_CONVERT_TO('😀', 'gbk');
-- NULL

SELECT TO_HEX(CONVERT_TO('😀', 'gb18030'));
-- 9439fc36
```
