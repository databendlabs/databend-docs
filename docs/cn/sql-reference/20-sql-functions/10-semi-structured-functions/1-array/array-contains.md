---
title: ARRAY_CONTAINS
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.762"/>

若数组包含指定元素，则返回 true。

## 语法

```sql
ARRAY_CONTAINS(array, element)
```

## 参数

| 参数 | 说明 |
|-----------|-------------|
| array | 被搜索的数组 |
| element | 待查找的元素 |

## 返回类型

BOOLEAN

## 注意事项

此函数同时支持标准数组类型和 Variant 数组类型。

## 示例

### 示例 1：检查标准数组

```sql
SELECT ARRAY_CONTAINS([1, 2, 3], 2);
```

结果：

```
true
```

### 示例 2：检查 Variant 数组

```sql
SELECT ARRAY_CONTAINS(PARSE_JSON('["apple", "banana", "orange"]'), 'banana');
```

结果：

```
true
```

### 示例 3：未找到元素

```sql
SELECT ARRAY_CONTAINS([1, 2, 3], 4);
```

结果：

```
false
```