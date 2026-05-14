---
title: ST_BUFFER
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.911"/>

返回一个 GEOMETRY，表示与输入几何体距离小于或等于指定距离的所有点。结果为 MultiPolygon 或 NULL。

## 语法

```sql
ST_BUFFER(<geometry>, <distance>)
```

## 参数

| 参数         | 描述                                                         |
|--------------|--------------------------------------------------------------|
| `<geometry>` | GEOMETRY 表达式。不支持 GeometryCollection。                 |
| `<distance>` | 缓冲距离，单位与输入几何体的坐标系一致。                     |

:::note
- 对于 Point、MultiPoint、LineString 和 MultiLineString：使用距离的绝对值（负距离与正距离行为相同）。
- 对于 Polygon 和 MultiPolygon：正距离膨胀，负距离收缩。
- 当结果为空时返回 NULL（例如对 Point 使用距离 0，或收缩多边形超过零面积）。
- 对于距离为 0 的 Polygon：返回原多边形包装为 MultiPolygon。
- 输出保留输入的 SRID。
:::

## 返回类型

Geometry（可为空）。

## 示例

```sql
-- 对点进行缓冲（产生近似圆形的多边形）
SELECT ST_BUFFER(TO_GEOMETRY('POINT(0 0)'), 1) IS NOT NULL;

┌────────┐
│ result │
├────────┤
│ true   │
└────────┘

-- 距离为零的多边形返回自身包装为 MultiPolygon
SELECT ST_ASWKT(
  ST_BUFFER(TO_GEOMETRY('POLYGON((0 0, 4 0, 4 4, 0 4, 0 0))'), 0)
);

┌─────────────────────────────────────────────────┐
│                     result                      │
├─────────────────────────────────────────────────┤
│ MULTIPOLYGON(((0 0,4 0,4 4,0 4,0 0)))          │
└─────────────────────────────────────────────────┘

-- 距离为零的点返回 NULL
SELECT ST_ASWKT(ST_BUFFER(TO_GEOMETRY('POINT(0 0)'), 0));

┌────────┐
│ result │
├────────┤
│ NULL   │
└────────┘

-- SRID 被保留
SELECT ST_SRID(ST_BUFFER(ST_GEOMETRYFROMWKT('POINT(0 0)', 4326), 1));

┌────────┐
│ result │
├────────┤
│ 4326   │
└────────┘
```
