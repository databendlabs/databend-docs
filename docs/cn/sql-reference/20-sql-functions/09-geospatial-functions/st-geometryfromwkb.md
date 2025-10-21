---
title: ST_GEOMETRYFROMWKB
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.395"/>

解析 [WKB(well-known-binary)](https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry#Well-known_binary) 或 [EWKB(extended well-known-binary)](https://postgis.net/docs/ST_GeomFromEWKB.html) 输入，并返回 GEOMETRY 类型的值。

## 语法

```sql
ST_GEOMETRYFROMWKB(<string>, [<srid>])
ST_GEOMETRYFROMWKB(<binary>, [<srid>])
```

## 别名

- [ST_GEOMFROMWKB](st-geomfromwkb.md)
- [ST_GEOMETRYFROMEWKB](st-geometryfromewkb.md)
- [ST_GEOMFROMEWKB](st-geomfromewkb.md)

## 参数

| 参数 | 说明 |
|-------------|--------------------------------------------------------------------------------|
| `<string>` | 参数必须是十六进制格式的 WKB 或 EWKB 字符串表达式。 |
| `<binary>` | 参数必须是 WKB 或 EWKB 格式的二进制表达式。 |
| `<srid>` | 要使用的 SRID 整数值。 |

## 返回类型

Geometry。

## 示例

```sql
SELECT
  ST_GEOMETRYFROMWKB(
    '0101000020797f000066666666a9cb17411f85ebc19e325641'
  ) AS pipeline_geometry;

┌────────────────────────────────────────┐
│            pipeline_geometry           │
├────────────────────────────────────────┤
│ SRID=32633;POINT(389866.35 5819003.03) │
└────────────────────────────────────────┘

SELECT
  ST_GEOMETRYFROMWKB(
    FROM_HEX('0101000020797f000066666666a9cb17411f85ebc19e325641'), 4326
  ) AS pipeline_geometry;

┌───────────────────────────────────────┐
│           pipeline_geometry           │
├───────────────────────────────────────┤
│ SRID=4326;POINT(389866.35 5819003.03) │
└───────────────────────────────────────┘
```