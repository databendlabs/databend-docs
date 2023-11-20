---
title: LOWER
---

Returns the string str with all characters changed to lowercase.

## Syntax

```sql
LOWER(<str>);
```

## Arguments

| Arguments | Description                |
|-----------|----------------------------|
| `<str>`   | The string to be lowercase |


## Return Type

`VARCHAR`

## Examples

```sql
SELECT LOWER('Hello, World!')
+------------------------+
| lower('Hello, World!') |
+------------------------+
| hello, world!          |
+------------------------+
```
