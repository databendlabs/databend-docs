---
title: ARRAY_FLATTEN
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="新增或更新于：v1.2.762"/>

将嵌套数组（Array）平铺为一维数组（Array）。

## 语法

```sql
ARRAY_FLATTEN(array)
```

## 参数

| 参数 | 说明 |
|-----------|-------------|
| array     | 要平铺的嵌套数组（Array）。 |

## 返回类型

数组（Array）（平铺后）。

## 注意事项

此函数适用于标准数组（Array）类型和变体（Variant）数组（Array）类型。

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