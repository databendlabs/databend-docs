---
title: JSON_ARRAY_DISTINCT
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.644"/>

从 JSON 数组中移除重复元素，并返回仅包含唯一元素的数组。

## 语法

```sql
JSON_ARRAY_DISTINCT(<json_array>)
```

## 返回类型

JSON 数组。

## 示例

```sql
SELECT JSON_ARRAY_DISTINCT('["apple", "banana", "apple", "orange", "banana"]'::VARIANT);

-[ RECORD 1 ]-----------------------------------
json_array_distinct('["apple", "banana", "apple", "orange", "banana"]'::VARIANT): ["apple","banana","orange"]
```