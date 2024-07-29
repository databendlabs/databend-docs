---
title: JSON_STRIP_NULLS
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.89"/>

从 JSON 对象中移除所有值为 null 的属性。

## 语法

```sql
JSON_STRIP_NULLS(<json_string>)
```

## 返回类型

返回与输入 JSON 值相同类型的值。

## 示例

```sql
SELECT JSON_STRIP_NULLS(PARSE_JSON('{"name": "Alice", "age": 30, "city": null}'));

json_strip_nulls(parse_json('{"name": "alice", "age": 30, "city": null}'))|
--------------------------------------------------------------------------+
{"age":30,"name":"Alice"}                                                 |
```