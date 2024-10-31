---
title: JSON_ARRAY_EXCEPT
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.644"/>

返回一个新的JSON数组，其中包含第一个JSON数组中不在第二个JSON数组中的元素。

## 语法

```sql
JSON_ARRAY_EXCEPT(<json_array1>, <json_array2>)
```

## 返回类型

JSON数组。

## 示例

```sql
SELECT JSON_ARRAY_EXCEPT(
    '["apple", "banana", "orange"]'::JSON,  
    '["banana", "grapes"]'::JSON         
);

-[ RECORD 1 ]-----------------------------------
json_array_except('["apple", "banana", "orange"]'::VARIANT, '["banana", "grapes"]'::VARIANT): ["apple","orange"]

-- 返回一个空数组，因为第一个数组中的所有元素都存在于第二个数组中。
SELECT json_array_except('["apple", "banana", "orange"]'::VARIANT, '["apple", "banana", "orange"]'::VARIANT)

-[ RECORD 1 ]-----------------------------------
json_array_except('["apple", "banana", "orange"]'::VARIANT, '["apple", "banana", "orange"]'::VARIANT): []
```