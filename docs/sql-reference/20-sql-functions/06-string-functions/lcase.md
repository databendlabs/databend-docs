---
title: LCASE
---

Returns the string str with all characters changed to lowercase.

## Syntax

```sql
LCASE(<str>)
```

## Aliases

- [LOWER](lower.md)

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