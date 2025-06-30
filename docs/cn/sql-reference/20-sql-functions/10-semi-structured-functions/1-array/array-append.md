---
title: ARRAY_APPEND
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.762"/>

向数组末尾追加一个元素。

## 语法

```sql
ARRAY_APPEND(array, element)
```

## 参数

| 参数 | 说明 |
|-----------|-------------|
| array     | 将要追加元素的源数组。 |
| element   | 要追加到数组的元素。 |

## 返回类型

包含追加元素的数组。

## 注意事项

此函数适用于标准数组类型和可变数组 (Variant Array) 类型。

## 示例

### 示例 1：向标准数组追加元素

```sql
SELECT ARRAY_APPEND([1, 2, 3], 4);
```

结果：

```
[1, 2, 3, 4]
```

### 示例 2：向可变数组追加元素

```sql
SELECT ARRAY_APPEND(PARSE_JSON('[1, 2, 3]'), 4);
```

结果：

```
[1, 2, 3, 4]
```

### 示例 3：追加不同数据类型的元素

```sql
SELECT ARRAY_APPEND(['a', 'b'], 'c');
```

结果：

```
["a", "b", "c"]
```

## 相关函数

- [ARRAY_PREPEND](array-prepend): 在数组开头添加一个元素
- [ARRAY_CONCAT](array-concat): 连接两个数组