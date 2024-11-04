---
title: MAP_FILTER
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.652"/>

使用[lambda表达式](../../00-sql-reference/42-lambda-expressions.md)过滤映射中的键值对，以定义条件。

## 语法

```sql
MAP_FILTER(<map>, (<key>, <value>) -> <condition>)
```

## 返回类型

返回一个映射，其中仅包含满足lambda表达式指定条件的键值对。

## 示例

此示例返回一个映射，其中仅包含库存数量低于10的产品：

```sql
SELECT MAP_FILTER({101:15, 102:8, 103:12, 104:5}, (product_id, stock) -> (stock < 10)) AS low_stock_products;

┌────────────────────┐
│ low_stock_products │
├────────────────────┤
│ {102:8,104:5}      │
└────────────────────┘
```