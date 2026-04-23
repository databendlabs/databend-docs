---
title: ST_YMIN
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.512"/>

返回指定 GEOMETRY 或 GEOGRAPHY 对象中所有点的最小纬度（Y 坐标）。

## 语法

```sql
ST_YMIN(<geometry_or_geography>)
```

## 参数

| 参数 | 描述 |
|--------------|------------------------------------------------------|
| `<geometry_or_geography>` | 参数必须是 GEOMETRY 或 GEOGRAPHY 类型的表达式。 |

## 返回类型

Double。

## 示例

### GEOMETRY 示例

```sql
SELECT
  ST_YMIN(
    TO_GEOMETRY(
      'GEOMETRYCOLLECTION(POINT(-180 -10),LINESTRING(-179 0, 179 30),POINT EMPTY)'
    )
  ) AS pipeline_ymin;

┌───────────────┐
│ pipeline_ymin │
├───────────────┤
│           -10 │
└───────────────┘

SELECT
  ST_YMIN(
    TO_GEOMETRY(
      'GEOMETRYCOLLECTION(POINT(180 0),LINESTRING(-60 -30, 60 30),POLYGON((40 40,20 45,45 30,40 40)))'
    )
  ) AS pipeline_ymin;

┌───────────────┐
│ pipeline_ymin │
├───────────────┤
│           -30 │
└───────────────┘
```

### GEOGRAPHY 示例

```sql
SELECT
  ST_YMIN(
    ST_GEOGFROMWKT(
      'LINESTRING(-179 10, 179 22)'
    )
  ) AS pipeline_ymin;

┌───────────────┐
│ pipeline_ymin │
├───────────────┤
│            10 │
└───────────────┘
```
