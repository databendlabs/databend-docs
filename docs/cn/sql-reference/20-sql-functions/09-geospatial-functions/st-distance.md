---
title: ST_DISTANCE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.555"/>

返回两个对象之间的最小距离。对于 GEOMETRY 输入，使用[欧几里得距离](https://en.wikipedia.org/wiki/Euclidean_distance)。对于 GEOGRAPHY 输入，使用[哈弗辛距离](https://en.wikipedia.org/wiki/Haversine_formula)。

## 语法

```sql
ST_DISTANCE(<geometry_or_geography1>, <geometry_or_geography2>)
```

## 参数

| 参数 | 描述 |
|---------------|-------------------------------------------------------------------------------|
| `<geometry_or_geography1>` | 参数必须是 GEOMETRY 或 GEOGRAPHY 类型的表达式，并且必须包含一个点（Point）。 |
| `<geometry_or_geography2>` | 参数必须是 GEOMETRY 或 GEOGRAPHY 类型的表达式，并且必须包含一个点（Point）。 |

:::note
- 如果一个或多个输入点为 NULL，则返回 NULL。
- 如果两个输入的 GEOMETRY 或 GEOGRAPHY 对象具有不同的 SRID，则函数会报告错误。
:::

## 返回类型

Double。

## 示例

### GEOMETRY 示例

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

### GEOGRAPHY 示例

```sql
SELECT
  ST_DISTANCE(
    ST_GEOGFROMWKT('POINT(0 0)'),
    ST_GEOGFROMWKT('POINT(1 0)')
  ) AS distance

╭──────────────────╮
│     distance     │
├──────────────────┤
│ 111195.080233533 │
╰──────────────────╯
```
