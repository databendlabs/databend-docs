---
title: MAP_TRANSFORM_VALUES
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.652"/>

使用 [lambda 表达式](../../00-sql-reference/42-lambda-expressions.md) 将转换应用于 map 中的每个值。

## 语法

```sql
MAP_TRANSFORM_VALUES(<map>, (<key>, <value>) -> <value_transformation>)
```

## 返回类型

返回一个 map，该 map 具有与输入 map 相同的键，但值根据指定的 lambda 转换进行修改。

## 示例

此示例将每种产品的价格降低 10%，而产品 ID（键）保持不变：

```sql
SELECT MAP_TRANSFORM_VALUES({101: 100.0, 102: 150.0, 103: 200.0}, (product_id, price) -> price * 0.9) AS discounted_prices;

┌───────────────────────────────────┐
│         discounted_prices         │
├───────────────────────────────────┤
│ {101:90.00,102:135.00,103:180.00} │
└───────────────────────────────────┘
```