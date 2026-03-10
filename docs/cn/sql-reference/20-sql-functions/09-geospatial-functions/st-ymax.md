---
title: ST_YMAX
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.512"/>

返回指定 GEOMETRY 对象中所有点的最大纬度（Y 坐标）。

## 语法

```sql
ST_YMAX(<geometry>)
```

## 参数

| 参数         | 描述                               |
|--------------|------------------------------------|
| `<geometry>` | 参数必须是 GEOMETRY 类型的表达式。 |

## 返回类型

Double。

## 示例

```sql
SELECT
  ST_YMAX(
    TO_GEOMETRY(
      'GEOMETRYCOLLECTION(POINT(180 50),LINESTRING(10 10,20 20,10 40),POINT EMPTY)'
    )
  ) AS pipeline_ymax;

┌───────────────┐
│ pipeline_ymax │
├───────────────┤
│            50 │
└───────────────┘

SELECT
  ST_YMAX(
    TO_GEOMETRY(
      'GEOMETRYCOLLECTION(POINT(40 10),LINESTRING(10 10,20 20,10 40),POLYGON((40 40,20 45,45 30,40 40)))'
    )
  ) AS pipeline_ymax;

┌───────────────┐
│ pipeline_ymax │
├───────────────┤
│            45 │
└───────────────┘
```