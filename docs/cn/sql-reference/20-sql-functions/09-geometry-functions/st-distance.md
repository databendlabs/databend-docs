---
title: ST_DISTANCE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新：v1.2.555"/>

返回两个 GEOMETRY 对象之间的最小 [欧几里得距离](https://en.wikipedia.org/wiki/Euclidean_distance)。

## 语法

```sql
ST_DISTANCE(<geometry1>, <geometry2>)
```

## 参数

| 参数          | 描述                                                                          |
|---------------|-------------------------------------------------------------------------------|
| `<geometry1>` | 参数必须是 GEOMETRY 类型的表达式，并且必须包含一个点。                        |
| `<geometry2>` | 参数必须是 GEOMETRY 类型的表达式，并且必须包含一个点。                        |

:::note
- 如果一个或多个输入点为 NULL，则返回 NULL。
- 如果两个输入的 GEOMETRY 对象具有不同的 SRID，则函数会报告错误。
:::

## 返回类型

Double。

## 示例

```sql
SELECT
  ST_DISTANCE(
    TO_GEOMETRY('POINT(0 0)'),
    TO_GEOMETRY('POINT(1 1)')
  ) AS distance

┌─────────────┐
│   distance  │
├─────────────┤
│ 1.414213562 │
└─────────────┘
```