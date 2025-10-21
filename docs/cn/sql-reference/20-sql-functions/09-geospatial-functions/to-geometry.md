---
title: TO_GEOMETRY
title_includes: TRY_TO_GEOMETRY
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.431"/>

解析输入并返回 GEOMETRY 类型的值。

`TRY_TO_GEOMETRY` 在解析出错时返回 NULL。

## 语法

```sql
TO_GEOMETRY(<string>, [<srid>])
TO_GEOMETRY(<binary>, [<srid>])
TO_GEOMETRY(<variant>, [<srid>])
TRY_TO_GEOMETRY(<string>, [<srid>])
TRY_TO_GEOMETRY(<binary>, [<srid>])
TRY_TO_GEOMETRY(<variant>, [<srid>])
```

## 参数

| 参数 | 说明 |
|-------------|-----------------------------------------------------------------------------------------------------------|
| `<string>` | 字符串表达式，需为 WKT、EWKT、十六进制 WKB 或 EWKB、GeoJSON 格式。 |
| `<binary>` | 二进制表达式，需为 WKB 或 EWKB 格式。 |
| `<variant>` | JSON 对象，需为 GeoJSON 格式。 |
| `<srid>` | 要使用的 SRID 整数值。 |

## 返回类型

Geometry。

## 示例

```sql
SELECT
  TO_GEOMETRY(
    'POINT(1820.12 890.56)'
  ) AS pipeline_geometry;

┌───────────────────────┐
│   pipeline_geometry   │
├───────────────────────┤
│ POINT(1820.12 890.56) │
└───────────────────────┘

SELECT
  TO_GEOMETRY(
    '0101000020797f000066666666a9cb17411f85ebc19e325641', 4326
  ) AS pipeline_geometry;

┌───────────────────────────────────────┐
│           pipeline_geometry           │
├───────────────────────────────────────┤
│ SRID=4326;POINT(389866.35 5819003.03) │
└───────────────────────────────────────┘

SELECT
  TO_GEOMETRY(
    FROM_HEX('0101000020797f000066666666a9cb17411f85ebc19e325641'), 4326
  ) AS pipeline_geometry;

┌───────────────────────────────────────┐
│           pipeline_geometry           │
├───────────────────────────────────────┤
│ SRID=4326;POINT(389866.35 5819003.03) │
└───────────────────────────────────────┘

SELECT
  TO_GEOMETRY(
    '{"coordinates":[[389866,5819003],[390000,5830000]],"type":"LineString"}'
  ) AS pipeline_geometry;

┌───────────────────────────────────────────┐
│             pipeline_geometry             │
├───────────────────────────────────────────┤
│ LINESTRING(389866 5819003,390000 5830000) │
└───────────────────────────────────────────┘

SELECT
  TO_GEOMETRY(
    PARSE_JSON('{"coordinates":[[389866,5819003],[390000,5830000]],"type":"LineString"}')
  ) AS pipeline_geometry;

┌───────────────────────────────────────────┐
│             pipeline_geometry             │
├───────────────────────────────────────────┤
│ LINESTRING(389866 5819003,390000 5830000) │
└───────────────────────────────────────────┘
```