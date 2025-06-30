---
title: GET_IGNORE_CASE
---

通过字段名从包含 `OBJECT` (OBJECT) 的 `VARIANT` (VARIANT) 中提取值。
如果任一参数为 `NULL` (NULL)，则返回 `VARIANT` 或 `NULL`。

`GET_IGNORE_CASE` (GET_IGNORE_CASE) 与 `GET` (GET) 类似，但对字段名进行不区分大小写的匹配。
首先尝试匹配完全相同的字段名；若未找到，则按字母顺序匹配不区分大小写的字段名。

## 语法

```sql
GET_IGNORE_CASE( <variant>, <field_name> )
```

## 参数

| 参数 | 描述 |
| :--- | :--- |
| `<variant>` | 包含 ARRAY (ARRAY) 或 OBJECT 的 VARIANT 值 |
| `<field_name>` | 指定 OBJECT 键值对中键的字符串值 |

## 返回类型

VARIANT

## 示例

```sql
SELECT get_ignore_case(parse_json('{"aa":1, "aA":2, "Aa":3}'), 'AA');
+---------------------------------------------------------------+
| get_ignore_case(parse_json('{"aa":1, "aA":2, "Aa":3}'), 'AA') |
+---------------------------------------------------------------+
| 3                                                             |
+---------------------------------------------------------------+
```