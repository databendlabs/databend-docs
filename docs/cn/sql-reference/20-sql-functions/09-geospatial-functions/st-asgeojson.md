---
title: ST_ASGEOJSON
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.427"/>

将 GEOMETRY 对象转换为 [GeoJSON](https://geojson.org/) 表示形式。

## 语法

```sql
ST_ASGEOJSON(<geometry>)
```

## 参数

| 参数         | 描述                                       |
|--------------|--------------------------------------------|
| `<geometry>` | 参数必须是 GEOMETRY 类型的表达式。         |

## 返回类型

Variant。

## 示例

```sql
SELECT
  ST_ASGEOJSON(
    ST_GEOMETRYFROMWKT(
      'SRID=4326;LINESTRING(400000 6000000, 401000 6010000)'
    )
  ) AS pipeline_geojson;

┌─────────────────────────────────────────────────────────────────────────┐
│                             pipeline_geojson                            │
├─────────────────────────────────────────────────────────────────────────┤
│ {"coordinates":[[400000,6000000],[401000,6010000]],"type":"LineString"} │
└─────────────────────────────────────────────────────────────────────────┘
```