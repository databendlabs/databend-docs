---
title: MAP_TRANSFORM_KEYS
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.762"/>

使用 [Lambda 表达式](../../../00-sql-reference/42-lambda-expressions.md) (Lambda Expression) 对 JSON 对象中的每个键应用转换。

## 语法

```sql
MAP_TRANSFORM_KEYS(<json_object>, (<key>, <value>) -> <key_transformation>)
```

## 返回类型

返回一个 JSON 对象，其值与输入的 JSON 对象相同，但键已根据指定的 Lambda 转换进行了修改。

## 示例

此示例将 “_v1” 追加到每个键的末尾，从而创建一个具有已修改键的新 JSON 对象：

```sql
SELECT MAP_TRANSFORM_KEYS('{"name":"John", "role":"admin"}'::VARIANT, (k, v) -> CONCAT(k, '_v1')) AS versioned_metadata;

┌──────────────────────────────────────┐
│          versioned_metadata          │
├──────────────────────────────────────┤
│ {"name_v1":"John","role_v1":"admin"} │
└──────────────────────────────────────┘
```