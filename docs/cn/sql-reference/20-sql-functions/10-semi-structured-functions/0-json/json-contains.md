---
title: JSON_CONTAINS_IN_LEFT
---

判断两个 JSON 值的包含关系：

- `JSON_CONTAINS_IN_LEFT(left, right)`：当 `left` 包含 `right`（即 `left` 是 `right` 的超集）时返回 `TRUE`。
- `JSON_CONTAINS_IN_RIGHT(left, right)`：当 `right` 包含 `left` 时返回 `TRUE`。

适用于对象和数组。

## 语法

```sql
JSON_CONTAINS_IN_LEFT(<variant_left>, <variant_right>)
JSON_CONTAINS_IN_RIGHT(<variant_left>, <variant_right>)
```

## 返回类型

`BOOLEAN`

## 示例

```sql
SELECT JSON_CONTAINS_IN_LEFT(PARSE_JSON('{"a":1,"b":{"c":2}}'),
                             PARSE_JSON('{"b":{"c":2}}')) AS left_contains;
```

```
+--------------+
| left_contains|
+--------------+
| true         |
+--------------+
```

```sql
SELECT JSON_CONTAINS_IN_LEFT(PARSE_JSON('[1,2,3]'), PARSE_JSON('[2,3]')) AS left_contains;
```

```
+--------------+
| left_contains|
+--------------+
| true         |
+--------------+
```

```sql
SELECT JSON_CONTAINS_IN_LEFT(PARSE_JSON('[1,2]'), PARSE_JSON('[2,4]')) AS left_contains;
```

```
+--------------+
| left_contains|
+--------------+
| false        |
+--------------+
```

```sql
SELECT JSON_CONTAINS_IN_RIGHT(PARSE_JSON('{"a":1}'), PARSE_JSON('{"a":1,"b":2}')) AS right_contains;
```

```
+---------------+
| right_contains|
+---------------+
| true          |
+---------------+
```
