---
title: ST_CONTAINS
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.564"/>

如果第二个 GEOMETRY 对象完全在第一个 GEOMETRY 对象内，则返回 TRUE。

## 语法

```sql
ST_CONTAINS(<geometry1>, <geometry2>)
```

## 参数

| 参数          | 描述                                                                                       |
|---------------|--------------------------------------------------------------------------------------------|
| `<geometry1>` | 该参数必须是 GEOMETRY 类型的表达式，且不是 GeometryCollection。                                 |
| `<geometry2>` | 该参数必须是 GEOMETRY 类型的表达式，且不是 GeometryCollection。                                 |

:::note
- 如果两个输入的 GEOMETRY 对象具有不同的 SRID，则该函数会报告错误。
:::

## 返回类型

Boolean。

## 示例

```sql
SELECT ST_CONTAINS(TO_GEOMETRY('POLYGON((-2 0, 0 2, 2 0, -2 0))'), TO_GEOMETRY('POLYGON((-1 0, 0 1, 1 0, -1 0))')) AS contains

┌──────────┐
│ contains │
├──────────┤
│ true     │
└──────────┘

SELECT ST_CONTAINS(TO_GEOMETRY('POLYGON((-2 0, 0 2, 2 0, -2 0))'), TO_GEOMETRY('LINESTRING(-1 1, 0 2, 1 1)')) AS contains

┌──────────┐
│ contains │
├──────────┤
│ false    │
└──────────┘

SELECT ST_CONTAINS(TO_GEOMETRY('POLYGON((-2 0, 0 2, 2 0, -2 0))'), TO_GEOMETRY('LINESTRING(-2 0, 0 0, 0 1)')) AS contains

┌──────────┐
│ contains │
├──────────┤
│ true     │
└──────────┘

```