---
title: ST_XMIN
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.512"/>

返回指定 GEOMETRY 对象中包含的所有点的最小经度（X 坐标）。

## 语法

```sql
ST_XMIN(<geometry>)
```

## 参数

| 参数         | 描述                                               |
|--------------|---------------------------------------------------|
| `<geometry>` | 该参数必须是 GEOMETRY 类型的表达式。                |

## 返回类型

Double。

## 示例

```sql
SELECT
  ST_XMIN(
    TO_GEOMETRY(
      'GEOMETRYCOLLECTION(POINT(180 10),LINESTRING(20 10,30 20,40 40),POINT EMPTY)'
    )
  ) AS pipeline_xmin;

┌───────────────┐
│ pipeline_xmin │
├───────────────┤
│            20 │
└───────────────┘

SELECT
  ST_XMIN(
    TO_GEOMETRY(
      'GEOMETRYCOLLECTION(POINT(40 10),LINESTRING(20 10,30 20,10 40),POLYGON((40 40,20 45,45 30,40 40)))'
    )
  ) AS pipeline_xmin;

┌───────────────┐
│ pipeline_xmin │
├───────────────┤
│            10 │
└───────────────┘
```