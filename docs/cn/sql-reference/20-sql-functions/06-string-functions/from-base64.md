---
title: FROM_BASE64
---

接受一个使用 base-64 编码规则编码的字符串，并返回解码后的二进制结果。如果参数为 NULL 或不是有效的 base-64 字符串，则结果为 NULL。

## 语法

```sql
FROM_BASE64(<expr>)
```

## 参数

| 参数      | 描述       |
|-----------|------------|
| `<expr>`  | 字符串值。 |

## 返回类型

`BINARY`

## 示例

```sql
SELECT TO_BASE64('abc'), FROM_BASE64(TO_BASE64('abc')) as b, b::String;
┌───────────────────────────────────────┐
│ to_base64('abc') │    b   │ b::string │
│      String      │ Binary │   String  │
├──────────────────┼────────┼───────────┤
│ YWJj             │ 616263 │ abc       │
└───────────────────────────────────────┘
```