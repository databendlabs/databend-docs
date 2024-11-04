---
title: JSON_ARRAY_TRANSFORM
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.644"/>

使用指定的转换 Lambda 表达式转换 JSON 数组的每个元素。有关 Lambda 表达式的更多信息，请参阅 [Lambda 表达式](../../00-sql-reference/42-lambda-expressions.md)。

## 语法

```sql
JSON_ARRAY_TRANSFORM(<json_array>, <lambda_expression>)
```

## 别名

- [JSON_ARRAY_APPLY](json-array-apply.md)
- [JSON_ARRAY_MAP](json-array-map.md)

## 返回类型

JSON 数组。

## 示例

在此示例中，数组中的每个数值元素都乘以 10，将原始数组转换为 `[10, 20, 30, 40]`：

```sql
SELECT JSON_ARRAY_TRANSFORM(
    [1, 2, 3, 4]::JSON,
    data -> (data::Int * 10)
);

-[ RECORD 1 ]-----------------------------------
json_array_transform([1, 2, 3, 4]::VARIANT, data -> data::Int32 * 10): [10,20,30,40]
```