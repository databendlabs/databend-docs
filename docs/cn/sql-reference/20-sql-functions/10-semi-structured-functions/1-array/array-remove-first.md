---
title: ARRAY_REMOVE_FIRST
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.762"/>

从数组中移除第一个出现的指定元素。

## 语法

```sql
ARRAY_REMOVE_FIRST(array, element)
```

## 参数

| 参数 | 描述 |
|-----------|-------------|
| array     | 要从中移除元素的源数组。 |
| element   | 要从数组中移除的元素。 |

## 返回类型

移除了第一个指定元素后的数组。

## 说明

此函数适用于标准数组类型 (Standard Array Types) 和变体数组类型 (Variant Array Types)。

## 示例

### 示例 1：从标准数组中移除

```sql
SELECT ARRAY_REMOVE_FIRST([1, 2, 2, 3], 2);
```

结果：

```
[1, 2, 3]
```

### 示例 2：从变体数组中移除

```sql
SELECT ARRAY_REMOVE_FIRST(PARSE_JSON('["apple", "banana", "apple", "orange"]'), 'apple');
```

结果：

```
["banana", "apple", "orange"]
```

### 示例 3：未找到元素

```sql
SELECT ARRAY_REMOVE_FIRST([1, 2, 3], 4);
```

结果：

```
[1, 2, 3]
```