---
title: AS_<type>
---

严格将 `VARIANT` 值转换为其他数据类型。
如果输入数据类型不是 `VARIANT`，输出为 `NULL`。
如果 `VARIANT` 中的值类型与输出值不匹配，输出为 `NULL`。

## 语法

```sql
AS_BOOLEAN( <variant> )
AS_INTEGER( <variant> )
AS_FLOAT( <variant> )
AS_STRING( <variant> )
AS_ARRAY( <variant> )
AS_OBJECT( <variant> )
```

## 参数

| 参数        | 描述           |
|-------------|----------------|
| `<variant>` | VARIANT 值 |

## 返回类型

- AS_BOOLEAN: BOOLEAN
- AS_INTEGER: BIGINT
- AS_FLOAT:   DOUBLE
- AS_STRING:  VARCHAR
- AS_ARRAY:   包含数组的 Variant
- AS_OBJECT:  包含对象的 Variant

## 示例

```sql
SELECT as_boolean(parse_json('true'));
+--------------------------------+
| as_boolean(parse_json('true')) |
+--------------------------------+
| 1                              |
+--------------------------------+

SELECT as_integer(parse_json('123'));
+-------------------------------+
| as_integer(parse_json('123')) |
+-------------------------------+
| 123                           |
+-------------------------------+

SELECT as_float(parse_json('12.34'));
+-------------------------------+
| as_float(parse_json('12.34')) |
+-------------------------------+
| 12.34                         |
+-------------------------------+

SELECT as_string(parse_json('"abc"'));
+--------------------------------+
| as_string(parse_json('"abc"')) |
+--------------------------------+
| abc                            |
+--------------------------------+

SELECT as_array(parse_json('[1,2,3]'));
+---------------------------------+
| as_array(parse_json('[1,2,3]')) |
+---------------------------------+
| [1,2,3]                         |
+---------------------------------+

SELECT as_object(parse_json('{"k":"v","a":"b"}'));
+--------------------------------------------+
| as_object(parse_json('{"k":"v","a":"b"}')) |
+--------------------------------------------+
| {"k":"v","a":"b"}                          |
+--------------------------------------------+

```