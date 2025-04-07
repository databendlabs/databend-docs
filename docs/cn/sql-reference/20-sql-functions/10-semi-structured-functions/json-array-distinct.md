---
title: JSON_ARRAY_DISTINCT
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.644"/>

从 JSON 数组中删除重复的元素，并返回一个仅包含不同元素的数组。

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