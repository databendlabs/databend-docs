---
title: ST_MAKEPOLYGON
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.413"/>

构造一个无孔的 GEOMETRY 或 GEOGRAPHY 多边形。函数使用指定的 LineString 作为外环。

## 语法

```sql
ST_MAKEPOLYGON(<geometry_or_geography>)
```

## 别名

- [ST_POLYGON](st-polygon.md)

## 参数

| 参数 | 描述 |
|--------------|------------------------------------------------------|
| `<geometry_or_geography>` | 参数必须是 GEOMETRY 或 GEOGRAPHY 类型的表达式。 |

## 返回类型

Geometry。

## 示例

### GEOMETRY 示例

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

### GEOGRAPHY 示例

```sql
SELECT
  ST_MAKEPOLYGON(
    ST_GEOGFROMWKT(
      'LINESTRING(0.0 0.0, 1.0 0.0, 1.0 2.0, 0.0 2.0, 0.0 0.0)'
    )
  ) AS pipeline_polygon;

╭────────────────────────────────╮
│        pipeline_polygon        │
├────────────────────────────────┤
│ POLYGON((0 0,1 0,1 2,0 2,0 0)) │
╰────────────────────────────────╯
```
