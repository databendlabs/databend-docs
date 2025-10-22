---
title: ARRAY_REDUCE
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.762"/>

通过应用指定的 Lambda 表达式（Lambda Expression），将 JSON 数组归约为单个值。有关 Lambda 表达式的更多信息，请参阅 [Lambda 表达式](/sql/stored-procedure-scripting/#lambda-expressions)。

## 语法

```sql
ARRAY_REDUCE(<json_array>, <lambda_expression>)
```

## 示例

此示例将数组中的所有元素相乘（2 * 3 * 4）：

```sql
SELECT ARRAY_REDUCE(
    [2, 3, 4],
    (acc, d) -> acc::Int * d::Int
);

-[ RECORD 1 ]-----------------------------------
array_reduce([2, 3, 4], (acc, d) -> acc::Int32 * d::Int32): 24
```