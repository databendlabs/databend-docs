---
title: AS_STRING
---

将 `VARIANT` 值严格转换为 VARCHAR 数据类型。
如果输入的数据类型不是 `VARIANT`，则输出为 `NULL`。
如果 `VARIANT` 中的值不是字符串类型，则输出为 `NULL`。

## 语法

```sql
AS_STRING( <variant> )
```

## 参数

| 参数 | 描述 |
|-------------|-------------------|
| `<variant>` | VARIANT 值 |

## 返回类型

VARCHAR

## 示例

```sql
SELECT as_string(parse_json('"abc"'));
+--------------------------------+
| as_string(parse_json('"abc"')) |
+--------------------------------+
| abc                            |
+--------------------------------+

SELECT as_string(parse_json('"hello world"'));
+----------------------------------------+
| as_string(parse_json('"hello world"')) |
+----------------------------------------+
| hello world                            |
+----------------------------------------+

-- 对于非字符串值，返回 NULL
SELECT as_string(parse_json('123'));
+------------------------------+
| as_string(parse_json('123')) |
+------------------------------+
| NULL                         |
+------------------------------+
```