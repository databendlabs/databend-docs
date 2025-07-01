---
title: ARRAY_OVERLAP
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.762"/>

检查两个 JSON 数组之间是否存在重叠，若存在共同元素则返回 `true`，否则返回 `false`。

## 别名

- `JSON_ARRAY_OVERLAP`

## 语法

```sql
ARRAY_OVERLAP(<json_array1>, <json_array2>)
```

## 返回类型

该函数返回一个布尔值：

- `true`：两个 JSON 数组存在共同元素
- `false`：两个 JSON 数组不存在共同元素

## 示例

```sql
SELECT ARRAY_OVERLAP(
    '["apple", "banana", "cherry"]'::JSON,  
    '["banana", "kiwi", "mango"]'::JSON
);

-[ RECORD 1 ]-----------------------------------
array_overlap('["apple", "banana", "cherry"]'::VARIANT, '["banana", "kiwi", "mango"]'::VARIANT): true


SELECT ARRAY_OVERLAP(
    '["grape", "orange"]'::JSON,  
    '["apple", "kiwi"]'::JSON     
);

-[ RECORD 1 ]-----------------------------------
array_overlap('["grape", "orange"]'::VARIANT, '["apple", "kiwi"]'::VARIANT): false
```