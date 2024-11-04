---
title: JSON_MAP_FILTER
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.652"/>

根据指定的条件过滤 JSON 对象中的键值对，条件由 [lambda 表达式](../../00-sql-reference/42-lambda-expressions.md) 定义。

## 语法

```sql
JSON_MAP_FILTER(<json_object>, (<key>, <value>) -> <condition>)
```

## 返回类型

返回一个 JSON 对象，其中仅包含满足指定条件的键值对。

## 示例

此示例仅从 JSON 对象中提取 `"status": "active"` 键值对，过滤掉其他字段：

```sql
SELECT JSON_MAP_FILTER('{"status":"active", "user":"admin", "time":"2024-11-01"}'::VARIANT, (k, v) -> k = 'status') AS filtered_metadata;

┌─────────────────────┐
│  filtered_metadata  │
├─────────────────────┤
│ {"status":"active"} │
└─────────────────────┘
```