---
title: ARRAYS_ZIP
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.690"/>

将多个数组合并为一个元组数组。

## 语法

```sql
ARRAYS_ZIP( <array1> [, ...] )
```

## 参数

| 参数      | 说明               |
|-----------|--------------------|
| `<arrayN>` | 输入的数组（ARRAY） |

:::note
- 每个数组的长度必须相同。
:::

## 返回类型

Array(Tuple) (Array of Tuples)。

## 示例

```sql
SELECT ARRAYS_ZIP([1, 2, 3], ['a', 'b', 'c']);
┌────────────────────────────────────────┐
│ arrays_zip([1, 2, 3], ['a', 'b', 'c']) │
├────────────────────────────────────────┤
│ [(1,'a'),(2,'b'),(3,'c')]              │
└────────────────────────────────────────┘
```