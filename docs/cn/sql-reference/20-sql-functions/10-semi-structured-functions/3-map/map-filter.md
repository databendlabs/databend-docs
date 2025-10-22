---
title: MAP_FILTER
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.762"/>

使用 [lambda 表达式](/sql/stored-procedure-scripting/#lambda-expressions) 定义的条件，筛选 JSON 对象中的键值对。

## 语法

```sql
MAP_FILTER(<json_object>, (<key>, <value>) -> <condition>)
```

## 返回类型

返回仅包含满足指定条件的键值对的 JSON 对象。

## 示例

以下示例仅从 JSON 对象中提取 `"status": "active"` 键值对，并过滤掉其他字段：

```sql
SELECT MAP_FILTER('{"status":"active", "user":"admin", "time":"2024-11-01"}'::VARIANT, (k, v) -> k = 'status') AS filtered_metadata;

┌─────────────────────┐
│  filtered_metadata  │
├─────────────────────┤
│ {"status":"active"} │
└─────────────────────┘
```