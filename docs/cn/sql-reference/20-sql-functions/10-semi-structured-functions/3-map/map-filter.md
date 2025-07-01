---
title: MAP_FILTER
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.762"/>

根据指定的条件（使用 [lambda 表达式 (Lambda Expression)](../../../00-sql-reference/42-lambda-expressions.md) 定义）筛选 JSON 对象中的键值对。

## 语法

```sql
MAP_FILTER(<json_object>, (<key>, <value>) -> <condition>)
```

## 返回类型

返回一个仅包含满足指定条件的键值对的 JSON 对象。

## 示例

此示例仅从 JSON 对象中提取 `"status":"active"` 键值对，并过滤掉其他字段：

```sql
SELECT MAP_FILTER('{"status":"active", "user":"admin", "time":"2024-11-01"}'::VARIANT, (k, v) -> k = 'status') AS filtered_metadata;

┌─────────────────────┐
│  filtered_metadata  │
├─────────────────────┤
│ {"status":"active"} │
└─────────────────────┘
```