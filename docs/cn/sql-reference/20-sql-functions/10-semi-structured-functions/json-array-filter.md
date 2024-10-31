---
title: JSON_ARRAY_FILTER
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.644"/>

根据指定的Lambda表达式过滤JSON数组中的元素，仅返回满足条件的元素。有关Lambda表达式的更多信息，请参阅[Lambda表达式](docs/en/sql-reference/00-sql-reference/42-lambda-expressions.md)。

## 语法

```sql
JSON_ARRAY_FILTER(<json_array>, <lambda_expression>)
```

## 返回类型

JSON数组。

## 示例

此示例过滤数组，仅返回以字母`a`开头的字符串，结果为`["apple", "avocado"]`：

```sql
SELECT JSON_ARRAY_FILTER(
    ['apple', 'banana', 'avocado', 'grape']::JSON,
    d -> d::String LIKE 'a%'
);

-[ RECORD 1 ]-----------------------------------
json_array_filter(['apple', 'banana', 'avocado', 'grape']::VARIANT, d -> d::STRING LIKE 'a%'): ["apple","avocado"]
```