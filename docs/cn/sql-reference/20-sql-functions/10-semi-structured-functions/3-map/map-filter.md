---
title: MAP_FILTER
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本：v1.2.762"/>

根据指定条件过滤 JSON 对象中的键值对，条件使用 [Lambda 表达式](../../../30-stored-procedure-scripting/index.md#lambda-表达式)定义。

## 语法

```sql
MAP_FILTER(<json_object>, (<key>, <value>) -> <condition>)
```

## 返回类型

返回一个仅包含满足指定条件的键值对的 JSON 对象。

## 示例

此示例从 JSON 对象中仅提取 `"status": "active"` 键值对，过滤掉其他字段：

```sql
SELECT MAP_FILTER('{"status":"active", "user":"admin", "time":"2024-11-01"}'::VARIANT, (k, v) -> k = 'status') AS filtered_metadata;

┌─────────────────────┐
│  filtered_metadata  │
├─────────────────────┤
│ {"status":"active"} │
└─────────────────────┘
```
