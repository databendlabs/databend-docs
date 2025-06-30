---
title: ARRAY_SLICE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.762"/>

使用起始和结束参数提取子数组。

## 语法

```sql
ARRAY_SLICE(array, start, end)
```

## 参数

| 参数 | 描述 |
|-----------|-------------|
| array     | 要提取切片的源数组。 |
| start     | 切片的起始位置（包含）。 |
| end       | 切片的结束位置（不包含）。 |

## 返回类型

数组（原始数组的切片）。

## 关于索引的重要说明

- 对于标准数组类型：索引是 **基于 1 的 (1-based)**（第一个元素的位置是 1）。
- 对于变体数组类型：索引是 **基于 0 的 (0-based)**（第一个元素的位置是 0），以兼容 Snowflake。

## 示例

### 示例 1：对标准数组进行切片（基于 1 的索引）

```sql
SELECT ARRAY_SLICE([10, 20, 30, 40, 50], 2, 4);
```

结果：

```
[20, 30]
```

### 示例 2：对变体数组进行切片（基于 0 的索引）

```sql
SELECT ARRAY_SLICE(PARSE_JSON('["apple", "banana", "orange", "grape", "kiwi"]'), 1, 3);
```

结果：

```
["banana", "orange"]
```

### 示例 3：越界切片

```sql
SELECT ARRAY_SLICE([1, 2, 3], 4, 6);
```

结果：

```
[]
```