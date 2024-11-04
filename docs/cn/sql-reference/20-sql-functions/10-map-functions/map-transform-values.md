---
title: MAP_TRANSFORM_VALUES
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.652"/>

使用[lambda表达式](../../00-sql-reference/42-lambda-expressions.md)对map中的每个值应用转换。

## 语法

```sql
MAP_TRANSFORM_VALUES(<map>, (<key>, <value>) -> <value_transformation>)
```

## 返回类型

返回一个map，其键与输入map相同，但值根据指定的lambda转换进行修改。

## 示例

此示例将每个产品的价格降低10%，而产品ID（键）保持不变：

```sql
SELECT MAP_TRANSFORM_VALUES({101: 100.0, 102: 150.0, 103: 200.0}, (product_id, price) -> price * 0.9) AS discounted_prices;

┌───────────────────────────────────┐
│         discounted_prices         │
├───────────────────────────────────┤
│ {101:90.00,102:135.00,103:180.00} │
└───────────────────────────────────┘
```