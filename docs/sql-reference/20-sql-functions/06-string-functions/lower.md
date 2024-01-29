---
title: LOWER
---

Returns the string str with all characters changed to lowercase.

## Syntax

```sql
LOWER(<str>)
```

## Aliases

- [LCASE](lcase.md)

## Return Type

VARCHAR

## Examples

```sql
SELECT LOWER('Hello, World!'), LCASE('Hello, World!');

┌─────────────────────────────────────────────────┐
│ lower('hello, world!') │ lcase('hello, world!') │
├────────────────────────┼────────────────────────┤
│ hello, world!          │ hello, world!          │
└─────────────────────────────────────────────────┘
```
