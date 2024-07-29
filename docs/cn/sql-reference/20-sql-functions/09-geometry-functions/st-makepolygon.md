---
title: ST_MAKEPOLYGON
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新：v1.2.413"/>

构造一个表示无孔多边形的GEOMETRY对象。该函数使用指定的LineString作为外部环。

## 语法

```sql
ST_MAKEPOLYGON(<geometry>)
```

## 别名

- [ST_POLYGON](st-polygon.md)

## 参数

| 参数         | 描述                                             |
|--------------|--------------------------------------------------|
| `<geometry>` | 参数必须是一个GEOMETRY类型的表达式。             |

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