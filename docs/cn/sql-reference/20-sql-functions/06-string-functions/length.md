---
id: string-length
title: LENGTH
---

Returns the length of an input string or binary value. For strings, the length is the number of characters, and UTF-8 characters are counted as a single character. For binary, the length is the number of bytes.

## Syntax

```sql
LENGTH(<input>)
```

## Arguments

| Arguments | Description |
|-----------|-------------|
| `<input>`   | The string or binary. |

## Return Type

`BIGINT`

## Examples

```sql
SELECT LENGTH('Word');
+----------------+
| LENGTH('Word') |
+----------------+
|              4 |
+----------------+
```
