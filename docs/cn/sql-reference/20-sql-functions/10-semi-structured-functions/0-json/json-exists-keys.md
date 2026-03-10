---
title: JSON_EXISTS_KEY
---

检测 JSON 对象中是否存在指定键：

- `JSON_EXISTS_KEY`：检查单个键。
- `JSON_EXISTS_ANY_KEYS`：传入键数组，只要其中任意一个存在即返回 `TRUE`。
- `JSON_EXISTS_ALL_KEYS`：仅当数组中的每个键都存在时返回 `TRUE`。

## 语法

```sql
JSON_EXISTS_KEY(<variant>, <key>)
JSON_EXISTS_ANY_KEYS(<variant>, <array_of_keys>)
JSON_EXISTS_ALL_KEYS(<variant>, <array_of_keys>)
```

## 返回类型

`BOOLEAN`

## 示例

```sql
SELECT JSON_EXISTS_KEY(PARSE_JSON('{"a":1,"b":2}'), 'b') AS has_b;
```

```
+-------+
| has_b |
+-------+
| true  |
+-------+
```

```sql
SELECT JSON_EXISTS_ANY_KEYS(PARSE_JSON('{"a":1,"b":2}'), ['x','b']) AS any_key;
```

```
+---------+
| any_key |
+---------+
| true    |
+---------+
```

```sql
SELECT JSON_EXISTS_ALL_KEYS(PARSE_JSON('{"a":1,"b":2}'), ['a','b','c']) AS all_keys;
```

```
+---------+
| all_keys|
+---------+
| false   |
+---------+
```

```sql
SELECT JSON_EXISTS_ALL_KEYS(PARSE_JSON('{"a":1,"b":2}'), ['a','b']) AS all_keys;
```

```
+---------+
| all_keys|
+---------+
| true    |
+---------+
```
