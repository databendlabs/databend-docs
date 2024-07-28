---
title: LOWER
---

返回一个将所有字符转换为小写的字符串。

## 语法

```sql
LOWER(<str>)
```

## 别名

- [LCASE](lcase.md)

## 返回类型

VARCHAR

## 示例

```sql
SELECT LOWER('Hello, Databend!'), LCASE('Hello, Databend!');

┌───────────────────────────────────────────────────────┐
│ lower('hello, databend!') │ lcase('hello, databend!') │
├───────────────────────────┼───────────────────────────┤
│ hello, databend!          │ hello, databend!          │
└───────────────────────────────────────────────────────┘
```