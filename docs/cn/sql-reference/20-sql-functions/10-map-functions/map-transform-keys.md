---
title: MAP_TRANSFORM_KEYS
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.652"/>

使用[lambda表达式](../../00-sql-reference/42-lambda-expressions.md)对map中的每个键应用转换。

## 语法

```sql
MAP_TRANSFORM_KEYS(<map>, (<key>, <value>) -> <key_transformation>)
```

## 返回类型

返回一个map，其值与输入map相同，但键根据指定的lambda转换进行了修改。

## 示例

此示例将每个产品ID加1,000，创建一个新map，其键已更新，而关联的价格保持不变：

```sql
SELECT MAP_TRANSFORM_KEYS({101: 29.99, 102: 45.50, 103: 15.00}, (product_id, price) -> product_id + 1000) AS updated_product_ids;

┌────────────────────────────────────┐
│         updated_product_ids        │
├────────────────────────────────────┤
│ {1101:29.99,1102:45.50,1103:15.00} │
└────────────────────────────────────┘
```