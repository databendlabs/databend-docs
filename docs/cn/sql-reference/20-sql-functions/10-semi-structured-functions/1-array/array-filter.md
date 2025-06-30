---
title: ARRAY_FILTER
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.762"/>

根据指定的 Lambda 表达式 (Lambda Expression) 从 JSON 数组 (JSON Array) 中筛选元素，仅返回满足条件的元素。有关 Lambda 表达式的更多信息，请参见 [Lambda 表达式](../../../00-sql-reference/42-lambda-expressions.md)。

## 语法

```sql
ARRAY_FILTER(<json_array>, <lambda_expression>)
```

## 返回类型

JSON 数组。

## 示例

此示例筛选数组，仅返回以字母 `a` 开头的字符串，结果为 `["apple", "avocado"]`：

```sql
SELECT ARRAY_FILTER(
    ['apple', 'banana', 'avocado', 'grape'],
    d -> d::String LIKE 'a%'
);

-[ RECORD 1 ]-----------------------------------
array_filter(['apple', 'banana', 'avocado', 'grape'], d -> d::STRING LIKE 'a%'): ["apple","avocado"]
```