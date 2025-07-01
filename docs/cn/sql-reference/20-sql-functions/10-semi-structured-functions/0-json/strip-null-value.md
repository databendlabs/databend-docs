---
title: STRIP_NULL_VALUE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.762"/>

从 JSON 对象中移除所有值为 null 的属性。

## 语法

```sql
STRIP_NULL_VALUE(<json_string>)
```

## 返回类型

返回与输入 JSON 值相同类型的值。

## 示例

```sql
SELECT STRIP_NULL_VALUE(PARSE_JSON('{"name": "Alice", "age": 30, "city": null}'));

strip_null_value(parse_json('{"name": "alice", "age": 30, "city": null}'))|
--------------------------------------------------------------------------+
{"age":30,"name":"Alice"}                                                 |
```