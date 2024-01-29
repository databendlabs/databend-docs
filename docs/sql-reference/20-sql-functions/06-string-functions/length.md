---
title: LENGTH
---

Returns the length of a given input string or binary value. In the case of strings, the length represents the count of characters, with each UTF-8 character considered as a single character. For binary data, the length corresponds to the number of bytes.

## Syntax

```sql
LENGTH(<expr>)
```

## Return Type

BIGINT

## Aliases

- [CHAR_LENGTH](char-length.md)
- [CHARACTER_LENGTH](character-length.md)

## Examples

```sql
SELECT LENGTH('Word'), CHAR_LENGTH('Word'), CHARACTER_LENGTH('Word');

┌─────────────────────────────────────────────────────────────────┐
│ length('word') │ char_length('word') │ character_length('word') │
├────────────────┼─────────────────────┼──────────────────────────┤
│              4 │                   4 │                        4 │
└─────────────────────────────────────────────────────────────────┘
```
