---
title: UNHEX
---

For a string argument str, UNHEX(str) interprets each pair of characters in the argument as a hexadecimal number and converts it to the byte represented by the number. The return value is a binary string.

## Syntax

```sql
UNHEX(<expr>)
```

## Aliases

- [FROM_HEX](from-hex.md)

## Examples

```sql
SELECT UNHEX('6461746162656e64'), FROM_HEX('6461746162656e64');

┌──────────────────────────────────────────────────────────┐
│ unhex('6461746162656e64') │ from_hex('6461746162656e64') │
├───────────────────────────┼──────────────────────────────┤
│ 6461746162656E64          │ 6461746162656E64             │
└──────────────────────────────────────────────────────────┘

SELECT UNHEX(HEX('string')), FROM_HEX(HEX('string'));

┌────────────────────────────────────────────────┐
│ unhex(hex('string')) │ from_hex(hex('string')) │
├──────────────────────┼─────────────────────────┤
│ 737472696E67         │ 737472696E67            │
└────────────────────────────────────────────────┘
```