---
title: CONVERT_FROM / TRY_CONVERT_FROM
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.964-nightly"/>

Decodes Binary bytes in a specified character set to a String. Use this function for text stored as GBK or other non-UTF-8 bytes. To encode a String as bytes, use [CONVERT_TO](convert-to.md).

## Syntax

```sql
CONVERT_FROM( <binary_expr>, '<charset>' )
TRY_CONVERT_FROM( <binary_expr>, '<charset>' )
```

## Arguments

- `binary_expr`: the Binary value to decode.
- `charset`: a scalar constant String with a WHATWG encoding label. Labels are case-insensitive. Common labels include `utf-8`, `gbk`, `gb2312` (a GBK alias), `gb18030`, `big5`, `shift_jis`, `euc-kr`, `windows-1252`, `utf-16le`, and `utf-16be`.

Character set labels follow the [WHATWG Encoding Standard](https://encoding.spec.whatwg.org/#names-and-labels). They are not arbitrary database collation names. `CONVERT_FROM` accepts character sets only, not `hex` or `base64`. Use [TO_STRING](to-string.md) to produce hexadecimal or Base64 text from bytes.

## Return value and errors

`CONVERT_FROM` returns String. A `NULL` input or scalar character set returns `NULL`. Malformed bytes or an unsupported label raise an error. Decoding does not replace malformed bytes with replacement characters. The explicit label determines decoding; a byte order mark does not select another character set.

`TRY_CONVERT_FROM` returns Nullable(String). It returns `NULL` for conversion failures, including malformed bytes and unsupported labels. Both functions reject a column character set argument with an error, even if its values contain valid labels.

## Examples

Decode GBK bytes stored directly or wrapped in Base64:

```sql
SELECT CONVERT_FROM(FROM_HEX('C4E3BAC3'), 'gbk');
-- 你好

SELECT CONVERT_FROM(FROM_BASE64('xOO6ww=='), 'GBK');
-- 你好
```

Use GB18030 for a four-byte character, or decode UTF-16LE:

```sql
SELECT CONVERT_FROM(FROM_HEX('9439FC36'), 'gb18030');
-- 😀

SELECT CONVERT_FROM(FROM_HEX('604F7D59'), 'utf-16le');
-- 你好
```

Return `NULL` for an incomplete GBK byte sequence:

```sql
SELECT TRY_CONVERT_FROM(FROM_HEX('C4'), 'gbk');
-- NULL
```
