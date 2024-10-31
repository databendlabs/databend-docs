---
title: JSON_ARRAY_OVERLAP
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.644"/>

检查两个JSON数组之间是否存在重叠，如果存在共同元素则返回`true`，否则返回`false`。

## 语法

```sql
JSON_ARRAY_OVERLAP(<json_array1>, <json_array2>)
```

## 返回类型

该函数返回一个布尔值：

- `true` 如果两个JSON数组之间至少有一个共同元素，
- `false` 如果没有共同元素。

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