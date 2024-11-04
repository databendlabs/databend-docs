---
title: JSON_ARRAY_REDUCE
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.644"/>

通过应用指定的 Lambda 表达式，将 JSON 数组缩减为单个值。有关 Lambda 表达式的更多信息，请参阅 [Lambda 表达式](../../00-sql-reference/42-lambda-expressions.md)。

## 语法

```sql
JSON_ARRAY_REDUCE(<json_array>, <lambda_expression>)
```

## 示例

此示例将数组中的所有元素相乘（2 _ 3 _ 4）：

```sql
SELECT JSON_ARRAY_REDUCE(
    [2, 3, 4]::JSON,
    (acc, d) -> acc::Int * d::Int
);

-[ RECORD 1 ]-----------------------------------
json_array_reduce([2, 3, 4]::VARIANT, (acc, d) -> acc::Int32 * d::Int32): 24
```