---
title: OBJECT_KEYS
title_includes: JSON_OBJECT_KEYS
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.762"/>

以字符串数组的形式返回最外层 JSON 对象的键。

## 别名

- `JSON_OBJECT_KEYS`

## 语法

```sql
OBJECT_KEYS(<variant>)
```

## 返回类型

字符串（STRING）的数组（ARRAY）。

## 示例

```sql
SELECT OBJECT_KEYS('{"a":1, "b":2, "c": {"d":3}}'::VARIANT);

-[ RECORD 1 ]-----------------------------------
object_keys('{"a":1, "b":2, "c": {"d":3}}'::VARIANT): ["a","b","c"]

-- 使用表示例
CREATE TABLE t (var VARIANT);
INSERT INTO t VALUES ('{"a":1, "b":2}'), ('{"x":10, "y":20}');

SELECT id, object_keys(var), json_object_keys(var) FROM t;

┌───────────┬──────────────────┬───────────────────────┐
│    id     │  object_keys(var) │ json_object_keys(var) │
├───────────┼──────────────────┼───────────────────────┤
│ 1         │ ["a","b"]        │ ["a","b"]           │
│ 2         │ ["x","y"]        │ ["x","y"]           │
└───────────┴──────────────────┴───────────────────────┘
```
