---
title: AS_DECIMAL
---

将 `VARIANT` 类型的值严格转换为 DECIMAL 数据类型。
如果输入的数据类型不是 `VARIANT`，则输出为 `NULL`。
如果 `VARIANT` 中的值类型与输出值的类型不匹配，则输出为 `NULL`。

## 语法

```sql
AS_DECIMAL( <variant> )
```

## 参数

| 参数 | 说明 |
|-------------|-------------------|
| `<variant>` | `VARIANT` 类型的值 |

## 返回类型

DECIMAL

## 示例

```sql
SELECT as_decimal(parse_json('12.34'));
+---------------------------------+
| as_decimal(parse_json('12.34')) |
+---------------------------------+
| 12.34                           |
+---------------------------------+

SELECT as_decimal(parse_json('123.456789'));
+--------------------------------------+
| as_decimal(parse_json('123.456789')) |
+--------------------------------------+
| 123.456789                           |
+--------------------------------------+

-- 对于非十进制值，返回 NULL
SELECT as_decimal(parse_json('"abc"'));
+---------------------------------+
| as_decimal(parse_json('"abc"')) |
+---------------------------------+
| NULL                            |
+---------------------------------+
```