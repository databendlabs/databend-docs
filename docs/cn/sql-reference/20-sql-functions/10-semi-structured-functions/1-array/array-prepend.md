---
title: ARRAY_PREPEND
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.762"/>

在数组开头前置一个元素。

## 语法

```sql
ARRAY_PREPEND(element, array)
```

## 参数

| 参数 | 说明 |
|-----------|-------------|
| element   | 需要前置到数组的元素 |
| array     | 待修改的源数组 |

## 返回类型

包含前置元素的数组。

## 说明

此函数同时支持标准数组类型和变体数组 (Variant Array) 类型。

## 示例

### 示例 1：向标准数组前置元素

```sql
SELECT ARRAY_PREPEND(0, [1, 2, 3]);
```

结果：

```
[0, 1, 2, 3]
```

### 示例 2：向变体数组前置元素

```sql
SELECT ARRAY_PREPEND('apple', PARSE_JSON('["banana", "orange"]'));
```

结果：

```
["apple", "banana", "orange"]
```

### 示例 3：前置复杂元素

```sql
SELECT ARRAY_PREPEND(PARSE_JSON('{"value": 0}'), [1, 2, 3]);
```

结果：

```
[{"value": 0}, 1, 2, 3]
```