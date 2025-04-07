---
title: JSON_ARRAY_OVERLAP
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.644"/>

检查两个 JSON 数组之间是否存在任何重叠，如果存在公共元素，则返回 `true`；否则，返回 `false`。

## 语法

```sql
JSON_ARRAY_OVERLAP(<json_array1>, <json_array2>)
```

## 返回类型

该函数返回一个布尔值：

- 如果两个 JSON 数组之间至少有一个公共元素，则返回 `true`，
- 如果没有公共元素，则返回 `false`。

## 示例

```sql
SELECT json_array_overlap(
    '["apple", "banana", "cherry"]'::JSON,  
    '["banana", "kiwi", "mango"]'::JSON
);

-[ RECORD 1 ]-----------------------------------
json_array_overlap('["apple", "banana", "cherry"]'::VARIANT, '["banana", "kiwi", "mango"]'::VARIANT): true


SELECT json_array_overlap(
    '["grape", "orange"]'::JSON,  
    '["apple", "kiwi"]'::JSON     
);

-[ RECORD 1 ]-----------------------------------
json_array_overlap('["grape", "orange"]'::VARIANT, '["apple", "kiwi"]'::VARIANT): false
```