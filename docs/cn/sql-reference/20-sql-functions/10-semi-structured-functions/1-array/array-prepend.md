---
title: ARRAY_PREPEND
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.762"/>

在数组的开头添加一个元素。

## 语法

```sql
ARRAY_PREPEND(element, array)
```

## 参数

| 参数 | 说明 |
|-----------|-------------|
| element   | 要添加到数组开头的元素。 |
| array     | 要添加元素的源数组。 |

## 返回类型

返回添加了元素后的数组。

## 说明

此函数适用于标准数组类型和变体数组类型 (Variant Array Types)。

## 示例

### 示例 1：向标准数组添加元素

```sql
SELECT ARRAY_PREPEND(0, [1, 2, 3]);
```

结果：

```
[0, 1, 2, 3]
```

### 示例 2：向变体数组添加元素

```sql
SELECT ARRAY_PREPEND('apple', PARSE_JSON('["banana", "orange"]'));
```

结果：

```
["apple", "banana", "orange"]
```

### 示例 3：添加复杂元素

```sql
SELECT ARRAY_PREPEND(PARSE_JSON('{"value": 0}'), [1, 2, 3]);
```

结果：

```
[{"value": 0}, 1, 2, 3]
```