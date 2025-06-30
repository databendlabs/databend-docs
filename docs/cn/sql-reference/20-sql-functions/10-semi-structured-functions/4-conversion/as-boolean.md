---
title: AS_BOOLEAN
---

将 `VARIANT` 类型的值严格转换为布尔（BOOLEAN）数据类型。
如果输入的数据类型不是 `VARIANT`，则输出为 `NULL`。
如果 `VARIANT` 中的值类型与输出值类型不匹配，则输出为 `NULL`。

## 语法

```sql
AS_BOOLEAN( <variant> )
```

## 参数

| 参数 | 描述 |
|-------------|-------------------|
| `<variant>` | VARIANT 类型的值 |

## 返回类型

BOOLEAN

## 示例

```sql
SELECT as_boolean(parse_json('true'));
+--------------------------------+
| as_boolean(parse_json('true')) |
+--------------------------------+
| 1                              |
+--------------------------------+

SELECT as_boolean(parse_json('false'));
+---------------------------------+
| as_boolean(parse_json('false')) |
+---------------------------------+
| 0                               |
+---------------------------------+

-- 对于非布尔值，返回 NULL
SELECT as_boolean(parse_json('123'));
+-------------------------------+
| as_boolean(parse_json('123')) |
+-------------------------------+
| NULL                          |
+-------------------------------+
```