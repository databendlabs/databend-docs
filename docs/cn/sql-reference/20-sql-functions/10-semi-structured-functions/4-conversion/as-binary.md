---
title: AS_BINARY
---

将 `半结构化数据（VARIANT）` 值严格转换为 `二进制（BINARY）` 数据类型。
如果输入的数据类型不是 `VARIANT`，则输出为 `NULL`。
如果 `VARIANT` 中的值类型与输出值不匹配，则输出为 `NULL`。

## 语法

```sql
AS_BINARY( <variant> )
```

## 参数

| 参数 | 描述 |
|---|---|
| `<variant>` | VARIANT 值 |

## 返回类型

BINARY

## 示例

```sql
SELECT as_binary(to_binary('abcd')::variant);
+---------------------------------------+
| as_binary(to_binary('abcd')::variant) |
+---------------------------------------+
| 61626364                              |
+---------------------------------------+

SELECT as_binary(to_binary('hello')::variant);
+-----------------------------------------+
| as_binary(to_binary('hello')::variant) |
+-----------------------------------------+
| 68656C6C6F                              |
+-----------------------------------------+

-- 对于非二进制值，返回 NULL
SELECT as_binary(parse_json('"text"'));
+---------------------------------+
| as_binary(parse_json('"text"')) |
+---------------------------------+
| NULL                            |
+---------------------------------+
```