---
title: JSON_MAP_TRANSFORM_KEYS
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.652"/>

使用 [lambda 表达式](../../00-sql-reference/42-lambda-expressions.md) 将转换应用于 JSON 对象中的每个键。

## 语法

```sql
JSON_MAP_TRANSFORM_KEYS(<json_object>, (<key>, <value>) -> <key_transformation>)
```

## 返回类型

返回一个 JSON 对象，该对象具有与输入 JSON 对象相同的值，但键已根据指定的 lambda 转换进行了修改。

## 示例

此示例将 "_v1" 附加到每个键，从而创建一个具有修改键的新 JSON 对象：

```sql
SELECT JSON_MAP_TRANSFORM_KEYS('{"name":"John", "role":"admin"}'::VARIANT, (k, v) -> CONCAT(k, '_v1')) AS versioned_metadata;

┌──────────────────────────────────────┐
│          versioned_metadata          │
├──────────────────────────────────────┤
│ {"name_v1":"John","role_v1":"admin"} │
└──────────────────────────────────────┘
```