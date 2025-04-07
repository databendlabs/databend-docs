---
title: LOWER
---

返回一个字符串，其中所有字符都已更改为小写。

## 句法

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