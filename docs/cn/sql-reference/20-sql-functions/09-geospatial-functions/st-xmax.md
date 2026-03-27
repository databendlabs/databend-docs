---
title: ST_XMAX
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.458"/>

返回指定 GEOMETRY 或 GEOGRAPHY 对象中所有点的最大经度（X 坐标）。

## 语法

```sql
ST_XMAX(<geometry_or_geography>)
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
  ST_XMAX(
    TO_GEOMETRY(
      'GEOMETRYCOLLECTION(POINT(40 10),LINESTRING(10 10,20 20,10 40),POINT EMPTY)'
    )
  ) AS pipeline_xmax;

┌───────────────┐
│ pipeline_xmax │
├───────────────┤
│            40 │
└───────────────┘

SELECT
  ST_XMAX(
    TO_GEOMETRY(
      'GEOMETRYCOLLECTION(POINT(40 10),LINESTRING(10 10,20 20,10 40),POLYGON((40 40,20 45,45 30,40 40)))'
    )
  ) AS pipeline_xmax;

┌───────────────┐
│ pipeline_xmax │
├───────────────┤
│            45 │
└───────────────┘
```

### GEOGRAPHY 示例

```sql
SELECT
  ST_XMAX(
    ST_GEOGFROMWKT(
      'LINESTRING(-179 0, 179 0)'
    )
  ) AS pipeline_xmax;

┌───────────────┐
│ pipeline_xmax │
├───────────────┤
│           179 │
└───────────────┘
```
