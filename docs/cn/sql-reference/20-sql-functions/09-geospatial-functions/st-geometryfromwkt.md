---
title: ST_GEOMETRYFROMWKT
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.347"/>

解析 [WKT（Well-Known Text）](https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry) 或 [EWKT（Extended Well-Known Text）](https://postgis.net/docs/ST_GeomFromEWKT.html) 输入，并返回 GEOMETRY 类型的值。

## 语法

```sql
ST_GEOMETRYFROMWKT(<string>, [<srid>])
```

## 别名

- [ST_GEOMFROMWKT](st-geomfromwkt.md)
- [ST_GEOMETRYFROMEWKT](st-geometryfromewkt.md)
- [ST_GEOMFROMEWKT](st-geomfromewkt.md)
- [ST_GEOMFROMTEXT](st-geomfromtext.md)
- [ST_GEOMETRYFROMTEXT](st-geometryfromtext.md)

## 参数

| 参数 | 描述 |
|---|---|
| `<string>` | 参数必须是 WKT 或 EWKT 格式的字符串表达式。 |
| `<srid>` | 要使用的 SRID 的整数值。 |

## 返回类型

Geometry。

## 示例

```sql
SELECT
  ST_GEOMETRYFROMWKT(
    'POINT(1820.12 890.56)'
  ) AS pipeline_geometry;

┌───────────────────────┐
│   pipeline_geometry   │
├───────────────────────┤
│ POINT(1820.12 890.56) │
└───────────────────────┘

SELECT
  ST_GEOMETRYFROMWKT(
    'POINT(1820.12 890.56)', 4326
  ) AS pipeline_geometry;

┌─────────────────────────────────┐
│        pipeline_geometry        │
│             Geometry            │
├─────────────────────────────────┤
│ SRID=4326;POINT(1820.12 890.56) │
└─────────────────────────────────┘
```