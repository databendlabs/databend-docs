---
title: ARRAY_UNIQUE
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.762"/>

返回数组中唯一元素的数量。

## 语法

```sql
ARRAY_UNIQUE(array)
```

## 参数

| 参数   | 描述                               |
|--------|------------------------------------|
| array  | 需要分析其中唯一元素的数组。       |

## 返回类型

INTEGER

## 说明

此函数适用于标准数组类型和变体数组类型。

## 示例

### 示例 1：计算标准数组中的唯一元素

```sql
SELECT ARRAY_UNIQUE([1, 2, 2, 3, 3, 3]);
```

结果：

```
3
```

### 示例 2：计算变体数组中的唯一元素

```sql
SELECT ARRAY_UNIQUE(PARSE_JSON('["apple", "banana", "apple", "orange", "banana"]'));
```

结果：

```
3
```

### 示例 3：空数组

```sql
SELECT ARRAY_UNIQUE([]);
```

结果：

```
0
```