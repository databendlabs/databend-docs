---
title: JSON_PATH_EXISTS
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.119"/>

检查指定的路径是否存在于JSON数据中。

## 语法

```sql
JSON_PATH_EXISTS(<json_data>, <json_path_expression>)
```

- json_data: 指定要搜索的JSON数据。它可以是一个JSON对象或数组。

- json_path_expression: 指定从JSON数据的根（用`$`表示）开始的路径，用于在JSON数据中进行检查。您还可以在表达式中包含条件，使用`@`来引用当前正在评估的节点或元素，以过滤结果。

## 返回类型

该函数返回：

- `true` 如果指定的JSON路径（及条件，如果有）存在于JSON数据中。
- `false` 如果指定的JSON路径（及条件，如果有）不存在于JSON数据中。
- NULL 如果json_data或json_path_expression为NULL或无效。

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