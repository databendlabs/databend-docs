---
title: FROM_BASE64
---

将使用 base-64 编码规则编码的字符串解码，并返回解码后的二进制结果。
如果参数为 NULL 或不是有效的 base-64 字符串，则结果为 NULL。

## 语法 {/*syntax*/}

```sql
FROM_BASE64(<expr>)
```

## 参数 {/*arguments*/}

| 参数      | 描述           |
|-----------|----------------|
| `<expr>`  | 字符串值。     |

## 返回类型 {/*return-type*/}

`BINARY`

## 示例 {/*examples*/}

```sql
SELECT TO_BASE64('abc'), FROM_BASE64(TO_BASE64('abc')) as b, b::String;
┌───────────────────────────────────────┐
│ to_base64('abc') │    b   │ b::string │
│      String      │ Binary │   String  │
├──────────────────┼────────┼───────────┤
│ YWJj             │ 616263 │ abc       │
└───────────────────────────────────────┘
```