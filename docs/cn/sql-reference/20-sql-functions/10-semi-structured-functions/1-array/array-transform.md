---
title: JSON_ARRAY_TRANSFORM
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本：v1.2.762"/>

使用指定的转换 Lambda 表达式（Lambda Expression）转换 JSON 数组的每个元素。有关 Lambda 表达式的更多信息，请参阅 [Lambda 表达式](/cn/sql/stored-procedure-scripting/#lambda-expressions)。

## 语法

```sql
ARRAY_TRANSFORM(<json_array>, <lambda_expression>)
```

## 返回类型

JSON 数组。

## 示例

在此示例中，数组中的每个数值元素都乘以 10，将原始数组转换为 `[10, 20, 30, 40]`：

```sql
SELECT ARRAY_TRANSFORM(
    [1, 2, 3, 4],
    data -> (data::Int * 10)
);

-[ RECORD 1 ]-----------------------------------
array_transform([1, 2, 3, 4], data -> data::Int32 * 10): [10,20,30,40]
```