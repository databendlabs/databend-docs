---
title: MAP_TRANSFORM_KEYS
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.652"/>

使用 [lambda 表达式](../../00-sql-reference/42-lambda-expressions.md) 将转换应用于 map 中的每个键。

## 语法

```sql
MAP_TRANSFORM_KEYS(<map>, (<key>, <value>) -> <key_transformation>)
```

## 返回类型

返回一个 map，其值与输入 map 相同，但键根据指定的 lambda 转换进行修改。

## 示例

此示例将每个产品 ID 加 1,000，创建一个具有更新键的新 map，同时保持关联的价格不变：

```sql
SELECT MAP_TRANSFORM_KEYS({101: 29.99, 102: 45.50, 103: 15.00}, (product_id, price) -> product_id + 1000) AS updated_product_ids;

┌────────────────────────────────────┐
│         updated_product_ids        │
├────────────────────────────────────┤
│ {1101:29.99,1102:45.50,1103:15.00} │
└────────────────────────────────────┘
```