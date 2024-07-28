---
title: LENGTH
---

返回给定输入字符串或二进制值的长度。对于字符串，长度表示字符的计数，每个 UTF-8 字符被视为一个字符。对于二进制数据，长度对应于字节数。

## 语法

```sql
LENGTH(<expr>)
```

## 别名

- [CHAR_LENGTH](char-length.md)
- [CHARACTER_LENGTH](character-length.md)
- [LENGTH_UTF8](length-utf8.md)

## 返回类型

BIGINT

## 示例

```sql
SELECT LENGTH('Hello'), LENGTH_UTF8('Hello'), CHAR_LENGTH('Hello'), CHARACTER_LENGTH('Hello');

┌───────────────────────────────────────────────────────────────────────────────────────────┐
│ length('hello') │ length_utf8('hello') │ char_length('hello') │ character_length('hello') │
├─────────────────┼──────────────────────┼──────────────────────┼───────────────────────────┤
│               5 │                    5 │                    5 │                         5 │
└───────────────────────────────────────────────────────────────────────────────────────────┘
```