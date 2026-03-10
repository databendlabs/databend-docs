---
title: ARRAY_FLATTEN
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.762"/>

将嵌套数组平铺为一维数组。

## 语法

```sql
ARRAY_FLATTEN(array)
```

## 参数

| 参数 | 描述 |
|-----------|-------------|
| array     | 要平铺的嵌套数组。 |

## 返回类型

数组（平铺后）。

## 说明

此函数适用于标准数组类型和变体数组 (Variant Array) 类型。

## 示例

### 示例 1：平铺嵌套数组

```sql
SELECT ARRAY_FLATTEN([[1, 2], [3, 4]]);
```

结果：

```
[1, 2, 3, 4]
```

### 示例 2：平铺变体数组

```sql
SELECT ARRAY_FLATTEN(PARSE_JSON('[["a", "b"], ["c", "d"]]'));
```

结果：

```
["a", "b", "c", "d"]
```