---
title: UPPER
---

Returns the string str with all characters changed to uppercase.

## Syntax

```sql
UPPER(<str>);
```

## Arguments

| Arguments | Description                |
|-----------|----------------------------|
| `<str>`   | The string to be uppercase |


## Return Type

`VARCHAR`

## Examples

```sql
SELECT UPPER('Hello, World!')
+------------------------+
| upper('Hello, World!') |
+------------------------+
| HELLO, WORLD!          |
+------------------------+
```
