---
title: ARRAY_INDEXOF
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.762"/>

返回数组中指定元素首次出现的索引。

## 语法

```sql
ARRAY_INDEXOF(array, element)
```

## 参数

| 参数     | 描述           |
|----------|----------------|
| array    | 要搜索的数组。 |
| element  | 要搜索的元素。 |

## 返回类型

整数（INTEGER）

## 关于索引的重要说明

- 对于标准数组类型：索引是 **从 1 开始的**（第一个元素的位置是 1）。
- 对于 VARIANT 类型的数组：索引是 **从 0 开始的**（第一个元素的位置是 0），以兼容 Snowflake。

## 示例

### 示例 1：在标准数组中查找元素（索引从 1 开始）

```sql
SELECT ARRAY_INDEXOF([10, 20, 30, 20], 20);
```

结果：

```
2
```

### 示例 2：在 VARIANT 数组中查找元素（索引从 0 开始）

```sql
SELECT ARRAY_INDEXOF(PARSE_JSON('["apple", "banana", "orange"]'), 'banana');
```

结果：

```
1
```

### 示例 3：未找到元素

```sql
SELECT ARRAY_INDEXOF([1, 2, 3], 4);
```

结果：

```
0
```