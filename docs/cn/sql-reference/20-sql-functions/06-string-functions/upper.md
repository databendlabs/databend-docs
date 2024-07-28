---
title: UPPER
---

返回一个将所有字符转换为大写的字符串。

## 语法

```sql
UPPER(<str>)
```

## 别名

- [UCASE](ucase.md)

## 返回类型

VARCHAR

## 示例

```sql
SELECT UPPER('Hello, Databend!'), UCASE('Hello, Databend!');

┌───────────────────────────────────────────────────────┐
│ upper('hello, databend!') │ ucase('hello, databend!') │
├───────────────────────────┼───────────────────────────┤
│ HELLO, DATABEND!          │ HELLO, DATABEND!          │
└───────────────────────────────────────────────────────┘
```