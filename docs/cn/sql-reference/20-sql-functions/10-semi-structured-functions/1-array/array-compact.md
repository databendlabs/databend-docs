---
title: ARRAY_COMPACT
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.762"/>

从数组中移除所有 NULL 值。

## 语法

```sql
ARRAY_COMPACT(array)
```

## 参数

| 参数 | 说明 |
|-----------|-------------|
| array     | 要从中移除 NULL 值的数组。 |

## 返回类型

不含 NULL 值的数组。

## 说明

此函数适用于标准数组类型和 VARIANT 数组类型。

## 示例

### 示例 1：从标准数组中移除 NULL

```sql
SELECT ARRAY_COMPACT([1, NULL, 2, NULL, 3]);
```

结果：

```
[1, 2, 3]
```

### 示例 2：从 VARIANT 数组中移除 NULL

```sql
SELECT ARRAY_COMPACT(PARSE_JSON('["apple", null, "banana", null, "orange"]'));
```

结果：

```
["apple", "banana", "orange"]
```

### 示例 3：不含 NULL 的数组

```sql
SELECT ARRAY_COMPACT([1, 2, 3]);
```

结果：

```
[1, 2, 3]
```