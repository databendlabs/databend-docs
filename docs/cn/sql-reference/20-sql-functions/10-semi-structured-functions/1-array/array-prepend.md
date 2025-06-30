---
title: ARRAY_PREPEND
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.762"/>

在数组的开头添加一个元素。

## Syntax

```sql
ARRAY_PREPEND(element, array)
```

## Parameters

| 参数 | 描述 |
|-----------|-------------|
| element   | 要添加到数组开头的元素。 |
| array     | 元素将被添加到开头的源数组。 |

## Return Type

带有前置元素的数组。

## 说明

此函数适用于标准数组类型和变体数组 (Variant Array) 类型。

## 示例

### 示例 1：在标准数组前添加元素

```sql
SELECT ARRAY_PREPEND(0, [1, 2, 3]);
```

结果：

```
[0, 1, 2, 3]
```

### 示例 2：在变体数组前添加元素

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