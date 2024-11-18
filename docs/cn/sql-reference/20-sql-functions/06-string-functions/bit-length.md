---
id: string-bit_length
title: BIT_LENGTH
---

返回字符串的比特长度。

## 语法

```sql
BIT_LENGTH(<expr>)
```

## 参数

| 参数      | 描述       |
|-----------| ----------- |
| `<expr>`  | 字符串。   |

## 返回类型

`BIGINT`

## 示例

```sql
SELECT BIT_LENGTH('Word');
+----------------------------+
| SELECT BIT_LENGTH('Word'); |
+----------------------------+
| 32                         |
+----------------------------+
```