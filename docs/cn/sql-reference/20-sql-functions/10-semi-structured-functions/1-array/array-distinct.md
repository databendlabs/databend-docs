---
title: ARRAY_DISTINCT
title_includes: JSON_ARRAY_DISTINCT
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.762"/>

从 JSON 数组 (JSON Array) 中移除重复元素，并返回一个仅包含唯一元素的数组。

## 别名

- `JSON_ARRAY_DISTINCT`

## 语法

```sql
ARRAY_DISTINCT(<json_array>)
```

## 返回类型

JSON 数组。

## 示例

```sql
SELECT ARRAY_DISTINCT('["apple", "banana", "apple", "orange", "banana"]'::VARIANT);

-[ RECORD 1 ]-----------------------------------
array_distinct('["apple", "banana", "apple", "orange", "banana"]'::VARIANT): ["apple","banana","orange"]
```
