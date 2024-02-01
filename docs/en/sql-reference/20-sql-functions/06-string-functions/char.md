---
id: string-char
title: CHAR
---

Return the character for each integer passed.

## Syntax

```sql
CHAR(N, ...)
```

## Arguments

| Arguments | Description    |
|-----------|----------------|
| N         | Numeric Column |

## Return Type

`BINARY`

## Examples

```sql
SELECT CHAR(77,121,83,81,76) as a, a::String;
┌────────────────────────┐
│      a     │ a::string │
│   Binary   │   String  │
├────────────┼───────────┤
│ 4D7953514C │ MySQL     │
└────────────────────────┘
```
