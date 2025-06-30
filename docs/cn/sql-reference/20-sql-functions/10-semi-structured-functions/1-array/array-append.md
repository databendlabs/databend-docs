---
title: ARRAY_APPEND
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.762"/>

将一个元素追加到数组的末尾。

## 语法

```sql
ARRAY_APPEND(array, element)
```

## 参数

| 参数     | 描述                     |
|----------|--------------------------|
| array    | 要追加元素的源数组       |
| element  | 要追加到数组的元素       |

## 返回类型

返回追加元素后的数组。

## 说明

此函数适用于标准数组类型和变体数组类型。

## 示例

### 示例 1：追加到标准数组

```sql
SELECT ARRAY_APPEND([1, 2, 3], 4);
```

结果：

```
[1, 2, 3, 4]
```

### 示例 2：追加到变体数组

```sql
SELECT ARRAY_APPEND(PARSE_JSON('[1, 2, 3]'), 4);
```

结果：

```
[1, 2, 3, 4]
```

### 示例 3：追加不同数据类型

```sql
SELECT ARRAY_APPEND(['a', 'b'], 'c');
```

结果：

```
["a", "b", "c"]
```

## 相关函数

- [ARRAY_PREPEND](array-prepend)：在数组开头添加元素
- [ARRAY_CONCAT](array-concat)：连接两个数组