---
title: ST_MAKEPOLYGON
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.413"/>

构造一个 GEOMETRY 对象，表示没有孔的 Polygon。该函数使用指定的 LineString 作为外环。

## 语法

```sql
ST_MAKEPOLYGON(<geometry>)
```

## 别名

- [ST_POLYGON](st-polygon.md)

## 参数

| 参数         | 描述                                               |
|--------------|----------------------------------------------------|
| `<geometry>` | 该参数必须是 GEOMETRY 类型的表达式。                 |

## 返回类型

Geometry.

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