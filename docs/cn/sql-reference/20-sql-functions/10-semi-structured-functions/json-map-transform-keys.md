---
title: JSON_MAP_TRANSFORM_KEYS
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.652"/>

使用[lambda表达式](../../00-sql-reference/42-lambda-expressions.md)对JSON对象中的每个键应用转换。

## 语法

```sql
JSON_MAP_TRANSFORM_KEYS(<json_object>, (<key>, <value>) -> <key_transformation>)
```

## 返回类型

返回一个JSON对象，其值与输入的JSON对象相同，但键根据指定的lambda转换进行了修改。

## 示例

此示例将"_v1"附加到每个键，创建一个具有修改键的新JSON对象：

```sql
SELECT JSON_MAP_TRANSFORM_KEYS('{"name":"John", "role":"admin"}'::VARIANT, (k, v) -> CONCAT(k, '_v1')) AS versioned_metadata;

┌──────────────────────────────────────┐
│          versioned_metadata          │
├──────────────────────────────────────┤
│ {"name_v1":"John","role_v1":"admin"} │
└──────────────────────────────────────┘
```