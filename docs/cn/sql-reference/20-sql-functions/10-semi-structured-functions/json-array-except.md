---
title: JSON_ARRAY_EXCEPT
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.644"/>

返回一个新的 JSON 数组，其中包含第一个 JSON 数组中存在但第二个 JSON 数组中不存在的元素。

## 语法

```sql
JSON_ARRAY_EXCEPT(<json_array1>, <json_array2>)
```

## 返回类型

JSON 数组。

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