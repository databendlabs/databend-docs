---
title: JSON_OBJECT_KEYS
---

返回一个包含输入 Variant OBJECT 中键列表的数组。

## 语法

```sql
JSON_OBJECT_KEYS(<variant>)
```

## 参数

| 参数        | 描述                               |
|-------------|-------------------------------------------|
| `<variant>` | 包含 OBJECT 的 VARIANT 值 |

## 别名

- [OBJECT_KEYS](object-keys.md)

## 返回类型

Array`<String>`

## 示例

```sql
CREATE TABLE IF NOT EXISTS objects_test1(id TINYINT, var VARIANT);

INSERT INTO
  objects_test1
VALUES
  (1, parse_json('{"a": 1, "b": [1,2,3]}'));

INSERT INTO
  objects_test1
VALUES
  (2, parse_json('{"b": [2,3,4]}'));

SELECT
  id,
  object_keys(var),
  json_object_keys(var)
FROM
  objects_test1;

┌────────────────────────────────────────────────────────────┐
│       id       │  object_keys(var) │ json_object_keys(var) │
├────────────────┼───────────────────┼───────────────────────┤
│              1 │ ["a","b"]         │ ["a","b"]             │
│              2 │ ["b"]             │ ["b"]                 │
└────────────────────────────────────────────────────────────┘
```