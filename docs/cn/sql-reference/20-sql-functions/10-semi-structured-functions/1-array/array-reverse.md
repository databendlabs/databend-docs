---
title: ARRAY_REVERSE
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.762"/>

反转数组中元素的顺序。

## 语法

```sql
ARRAY_REVERSE(array)
```

## 参数

| 参数 | 描述 |
|-----------|-------------|
| array     | 要反转的数组。 |

## 返回类型

元素顺序反转后的数组。

## 说明

此函数适用于标准数组类型 (Standard Array Types) 和变体数组类型 (Variant Array Types)。

## 示例

### 示例 1：反转标准数组

```sql
SELECT ARRAY_REVERSE([1, 2, 3, 4, 5]);
```

结果：

```
[5, 4, 3, 2, 1]
```

### 示例 2：反转变体数组

```sql
SELECT ARRAY_REVERSE(PARSE_JSON('["apple", "banana", "orange"]'));
```

结果：

```
["orange", "banana", "apple"]
```

### 示例 3：反转空数组

```sql
SELECT ARRAY_REVERSE([]);
```

结果：

```
[]
```