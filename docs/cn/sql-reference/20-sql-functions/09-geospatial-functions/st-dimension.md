---
title: ST_DIMENSION
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.442"/>

返回几何对象的维度。GEOMETRY 对象的维度如下：

| 地理空间对象类型       | 维度  |
|------------------------|-------|
| Point / MultiPoint     | 0     |
| LineString / MultiLineString | 1     |
| Polygon / MultiPolygon | 2     |

## 语法

```sql
ST_DIMENSION(<geometry>)
```

## 参数

| 参数         | 描述                                   |
|--------------|----------------------------------------|
| `<geometry>` | 参数必须是 GEOMETRY 类型的表达式。     |

## 返回类型

UInt8。

## 示例

```sql
SELECT
  ST_DIMENSION(
    ST_GEOMETRYFROMWKT(
      'POINT(-122.306100 37.554162)'
    )
  ) AS pipeline_dimension;

┌────────────────────┐
│ pipeline_dimension │
├────────────────────┤
│                  0 │
└────────────────────┘

SELECT
  ST_DIMENSION(
    ST_GEOMETRYFROMWKT(
      'LINESTRING(-124.20 42.00, -120.01 41.99)'
    )
  ) AS pipeline_dimension;

┌────────────────────┐
│ pipeline_dimension │
├────────────────────┤
│                  1 │
└────────────────────┘

SELECT
  ST_DIMENSION(
    ST_GEOMETRYFROMWKT(
      'POLYGON((-124.20 42.00, -120.01 41.99, -121.1 42.01, -124.20 42.00))'
    )
  ) AS pipeline_dimension;

┌────────────────────┐
│ pipeline_dimension │
├────────────────────┤
│                  2 │
└────────────────────┘
```