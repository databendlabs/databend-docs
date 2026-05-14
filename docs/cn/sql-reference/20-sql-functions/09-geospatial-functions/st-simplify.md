---
title: ST_SIMPLIFY
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.911"/>

返回 GEOMETRY 对象的简化版本，移除与结果边距离在指定容差范围内的顶点。使用 Ramer-Douglas-Peucker 算法。

## 语法

```sql
ST_SIMPLIFY(<geometry>, <tolerance>)
```

## 参数

| 参数          | 描述                                                                 |
|---------------|----------------------------------------------------------------------|
| `<geometry>`  | GEOMETRY 表达式。适用于 LineString、MultiLineString、Polygon 和 MultiPolygon。对 Point 和 MultiPoint 无效果。 |
| `<tolerance>` | 顶点移除的最大距离容差。                                             |

:::note
- 不支持 GeometryCollection。
:::

## 返回类型

Geometry。

## 示例

```sql
SELECT ST_ASWKT(
  ST_SIMPLIFY(
    TO_GEOMETRY('LINESTRING(0 0, 1 0, 1 1, 2 1)'), 0.5
  )
) AS simplified;

┌──────────────────────┐
│      simplified      │
├──────────────────────┤
│ LINESTRING(0 0,2 1)  │
└──────────────────────┘

SELECT ST_ASWKT(
  ST_SIMPLIFY(
    TO_GEOMETRY('LINESTRING(1100 1100, 2500 2100, 3100 3100, 4900 1100, 3100 1900)'), 500
  )
) AS simplified;

┌──────────────────────────────────────────────────────┐
│                      simplified                      │
├──────────────────────────────────────────────────────┤
│ LINESTRING(1100 1100,3100 3100,4900 1100,3100 1900)  │
└──────────────────────────────────────────────────────┘

SELECT ST_ASWKT(
  ST_SIMPLIFY(
    TO_GEOMETRY('POLYGON((0 0, 1 0, 1 1, 0.5 0.5, 0 1, 0 0))'), 0.6
  )
) AS simplified;

┌──────────────────────────────────┐
│            simplified            │
├──────────────────────────────────┤
│ POLYGON((0 0,1 0,1 1,0 1,0 0))  │
└──────────────────────────────────┘
```
