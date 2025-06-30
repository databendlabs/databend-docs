---
title: ARRAY_INTERSECTION
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.762"/>

返回两个 JSON 数组的交集。

## 别名

- `JSON_ARRAY_INTERSECTION`

## 语法

```sql
ARRAY_INTERSECTION(<json_array1>, <json_array2>)
```

## 返回类型

JSON 数组。

## 示例

```sql
-- 查找两个 JSON 数组的交集
SELECT ARRAY_INTERSECTION('["Electronics", "Books", "Toys"]'::JSON, '["Books", "Fashion", "Electronics"]'::JSON);

-[ RECORD 1 ]-----------------------------------
array_intersection('["Electronics", "Books", "Toys"]'::VARIANT, '["Books", "Fashion", "Electronics"]'::VARIANT): ["Electronics","Books"]

-- 通过连续调用查找第一个查询结果与第三个 JSON 数组的交集
SELECT ARRAY_INTERSECTION(
    ARRAY_INTERSECTION('["Electronics", "Books", "Toys"]'::JSON, '["Books", "Fashion", "Electronics"]'::JSON),
    '["Electronics", "Books", "Clothing"]'::JSON
);

-[ RECORD 1 ]-----------------------------------
array_intersection(array_intersection('["Electronics", "Books", "Toys"]'::VARIANT, '["Books", "Fashion", "Electronics"]'::VARIANT), '["Electronics", "Books", "Clothing"]'::VARIANT): ["Electronics","Books"]
```