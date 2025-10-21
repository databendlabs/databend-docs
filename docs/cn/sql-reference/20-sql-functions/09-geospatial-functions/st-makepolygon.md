---
title: ST_MAKEPOLYGON
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.413"/>

构造一个表示无孔多边形（Polygon）的几何（GEOMETRY）对象。该函数使用指定的线串（LineString）作为外环。

## 语法

```sql
ST_MAKEPOLYGON(<geometry>)
```

## 别名

- [ST_POLYGON](st-polygon.md)

## 参数

| 参数         | 描述                               |
|--------------|------------------------------------|
| `<geometry>` | 参数必须是几何（GEOMETRY）类型的表达式。 |

## 返回类型

几何（Geometry）。

## 示例

```sql
SELECT
  ST_MAKEPOLYGON(
    ST_GEOMETRYFROMWKT(
      'LINESTRING(0.0 0.0, 1.0 0.0, 1.0 2.0, 0.0 2.0, 0.0 0.0)'
    )
  ) AS pipeline_polygon;

┌────────────────────────────────┐
│        pipeline_polygon        │
├────────────────────────────────┤
│ POLYGON((0 0,1 0,1 2,0 2,0 0)) │
└────────────────────────────────┘
```