---
title: FROM_BASE64
---

Takes a string encoded with the base-64 encoded rules nd returns the decoded result as a binary string.
The result is NULL if the argument is NULL or not a valid base-64 string.

## Syntax

```sql
FROM_BASE64(<expr>)
```

## Arguments

| Arguments | Description       |
|-----------|-------------------|
| `<expr>`  | The string value. |

## Return Type

`VARCHAR`

## Examples

```sql
SELECT TO_BASE64('abc'), FROM_BASE64(TO_BASE64('abc'));
+------------------+-------------------------------+
| TO_BASE64('abc') | FROM_BASE64(TO_BASE64('abc')) |
+------------------+-------------------------------+
| YWJj             | abc                           |
+------------------+-------------------------------+
```
