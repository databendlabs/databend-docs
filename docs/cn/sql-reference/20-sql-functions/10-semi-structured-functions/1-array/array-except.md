---
title: ARRAY_EXCEPT
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.762"/>

返回一个新的 JSON 数组，包含第一个 JSON 数组中有而第二个 JSON 数组中没有的元素。

## 别名

- `JSON_ARRAY_EXCEPT`

## 语法

```sql
ARRAY_EXCEPT(<source_array>, <array_of_elements_to_exclude>)
```

## 返回类型

JSON 数组。

## 示例

```sql
SELECT ARRAY_EXCEPT(
    '["apple", "banana", "orange"]'::VARIANT,  
    '["banana", "grapes"]'::VARIANT         
);

-[ RECORD 1 ]-----------------------------------
array_except('["apple", "banana", "orange"]'::VARIANT, '["banana", "grapes"]'::VARIANT): ["apple","orange"]

-- 返回一个空数组，因为第一个数组中的所有元素在第二个数组中都已存在。
SELECT ARRAY_EXCEPT('["apple", "banana", "orange"]'::VARIANT, '["apple", "banana", "orange"]'::VARIANT)

-[ RECORD 1 ]-----------------------------------
array_except('["apple", "banana", "orange"]'::VARIANT, '["apple", "banana", "orange"]'::VARIANT): []
```