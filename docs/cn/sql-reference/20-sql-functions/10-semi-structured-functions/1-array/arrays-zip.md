---
title: ARRAYS_ZIP
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.690"/>

将多个数组（Array）合并为一个由元组（Tuple）构成的数组（Array）。

## 语法

```sql
ARRAYS_ZIP( <array1> [, ...] )
```

## 参数

| 参数      | 说明               |
|-----------|--------------------|
| `<arrayN>` | 输入的数组（ARRAY）。 |

:::note
- 每个数组的长度必须相同。
:::

## 返回类型

元组数组（Array(Tuple)）。

## 示例

```sql
SELECT ARRAYS_ZIP([1, 2, 3], ['a', 'b', 'c']);
┌────────────────────────────────────────┐
│ arrays_zip([1, 2, 3], ['a', 'b', 'c']) │
├────────────────────────────────────────┤
│ [(1,'a'),(2,'b'),(3,'c')]              │
└────────────────────────────────────────┘
```