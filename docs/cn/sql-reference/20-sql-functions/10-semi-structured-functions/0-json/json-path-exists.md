---
title: JSON_PATH_EXISTS
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="新增或更新于：v1.2.119"/>

检查 JSON 数据中是否存在指定的路径 (path)。

## 语法

```sql
JSON_PATH_EXISTS(<json_data>, <json_path_expression>)
```

- json_data: 指定要搜索的 JSON 数据。它可以是 JSON 对象或数组。

- json_path_expression: 指定要在 JSON 数据中检查的路径，该路径以 `$` 表示 JSON 数据的根。你还可以在表达式中包含条件 (condition)，使用 `@` 来引用正在评估的当前节点 (Current Node) 或元素 (element)，以筛选结果。

## 返回类型

该函数返回：

- `true`，如果指定的 JSON 路径（以及任何条件）存在于 JSON 数据中。
- `false`，如果指定的 JSON 路径（以及任何条件）不存在于 JSON 数据中。
- 如果 `json_data` 或 `json_path_expression` 为 NULL 或无效，则返回 NULL。

## 示例

```sql
SELECT JSON_PATH_EXISTS(parse_json('{"a": 1, "b": 2}'), '$.a ? (@ == 1)');

----
true


SELECT JSON_PATH_EXISTS(parse_json('{"a": 1, "b": 2}'), '$.a ? (@ > 1)');

----
false

SELECT JSON_PATH_EXISTS(NULL, '$.a');

----
NULL

SELECT JSON_PATH_EXISTS(parse_json('{"a": 1, "b": 2}'), NULL);

----
NULL
```