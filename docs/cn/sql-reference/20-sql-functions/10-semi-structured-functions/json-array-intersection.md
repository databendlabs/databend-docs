---
title: JSON_ARRAY_INTERSECTION
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.644"/>

返回两个 JSON 数组之间的共同元素。

## 语法

```sql
JSON_ARRAY_INTERSECTION(<json_array1>, <json_array2>)
```

## 返回类型

JSON 数组。

## 示例

```sql
-- 查找两个 JSON 数组的交集
SELECT json_array_intersection('["Electronics", "Books", "Toys"]'::JSON, '["Books", "Fashion", "Electronics"]'::JSON);

-[ RECORD 1 ]-----------------------------------
json_array_intersection('["Electronics", "Books", "Toys"]'::VARIANT, '["Books", "Fashion", "Electronics"]'::VARIANT): ["Electronics","Books"]

-- 使用迭代方法查找第一个查询结果与第三个 JSON 数组的交集
SELECT json_array_intersection(
    json_array_intersection('["Electronics", "Books", "Toys"]'::JSON, '["Books", "Fashion", "Electronics"]'::JSON),
    '["Electronics", "Books", "Clothing"]'::JSON
);

-[ RECORD 1 ]-----------------------------------
json_array_intersection(json_array_intersection('["Electronics", "Books", "Toys"]'::VARIANT, '["Books", "Fashion", "Electronics"]'::VARIANT), '["Electronics", "Books", "Clothing"]'::VARIANT): ["Electronics","Books"]
```