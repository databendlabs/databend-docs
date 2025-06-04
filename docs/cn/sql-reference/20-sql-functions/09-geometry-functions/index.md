---
title: 几何函数（Geometry Functions）
---

本页面全面概述了 Databend 中的几何函数（Geometry Functions），按功能分类以便参考。

## 几何创建函数

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [ST_MAKEGEOMPOINT](st-makegeompoint.md) / [ST_GEOM_POINT](st-geom-point.md) | 构造点几何体 | `ST_MAKEGEOMPOINT(-122.35, 37.55)` → `POINT(-122.35 37.55)` |
| [ST_MAKELINE](st-makeline.md) / [ST_MAKE_LINE](st-make-line.md) | 基于点创建线字符串 | `ST_MAKELINE(ST_MAKEGEOMPOINT(-122.35, 37.55), ST_MAKEGEOMPOINT(-122.40, 37.60))` → `LINESTRING(-122.35 37.55, -122.40 37.60)` |
| [ST_MAKEPOLYGON](st-makepolygon.md) | 基于线字符串创建多边形 | `ST_MAKEPOLYGON(ST_MAKELINE(...))` → `POLYGON(...)` |
| [ST_POLYGON](st-polygon.md) | 创建多边形 | `ST_POLYGON(...)` → `POLYGON(...)` |

## 几何转换函数

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [ST_GEOMETRYFROMTEXT](st-geometryfromtext.md) / [ST_GEOMFROMTEXT](st-geomfromtext.md) | 将 WKT 转换为几何体 | `ST_GEOMETRYFROMTEXT('POINT(-122.35 37.55)')` → `POINT(-122.35 37.55)` |
| [ST_GEOMETRYFROMWKB](st-geometryfromwkb.md) / [ST_GEOMFROMWKB](st-geomfromwkb.md) | 将 WKB 转换为几何体 | `ST_GEOMETRYFROMWKB(...)` → `POINT(...)` |
| [ST_GEOMETRYFROMEWKT](st-geometryfromewkt.md) / [ST_GEOMFROMEWKT](st-geomfromewkt.md) | 将 EWKT 转换为几何体 | `ST_GEOMETRYFROMEWKT('SRID=4326;POINT(-122.35 37.55)')` → `POINT(-122.35 37.55)` |
| [ST_GEOMETRYFROMEWKB](st-geometryfromewkb.md) / [ST_GEOMFROMEWKB](st-geomfromewkb.md) | 将 EWKB 转换为几何体 | `ST_GEOMETRYFROMEWKB(...)` → `POINT(...)` |
| [ST_GEOMFROMGEOHASH](st-geomfromgeohash.md) | 将 GeoHash 转换为几何体 | `ST_GEOMFROMGEOHASH('9q8yyk8')` → `POLYGON(...)` |
| [ST_GEOMPOINTFROMGEOHASH](st-geompointfromgeohash.md) | 将 GeoHash 转换为点 | `ST_GEOMPOINTFROMGEOHASH('9q8yyk8')` → `POINT(...)` |
| [TO_GEOMETRY](to-geometry.md) | 将多种格式转换为几何体 | `TO_GEOMETRY('POINT(-122.35 37.55)')` → `POINT(-122.35 37.55)` |

## 几何输出函数

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [ST_ASTEXT](st-astext.md) | 将几何体转换为 WKT | `ST_ASTEXT(ST_MAKEGEOMPOINT(-122.35, 37.55))` → `'POINT(-122.35 37.55)'` |
| [ST_ASWKT](st-aswkt.md) | 将几何体转换为 WKT | `ST_ASWKT(ST_MAKEGEOMPOINT(-122.35, 37.55))` → `'POINT(-122.35 37.55)'` |
| [ST_ASBINARY](st-asbinary.md) / [ST_ASWKB](st-aswkb.md) | 将几何体转换为 WKB | `ST_ASBINARY(ST_MAKEGEOMPOINT(-122.35, 37.55))` → `WKB representation` |
| [ST_ASEWKT](st-asewkt.md) | 将几何体转换为 EWKT | `ST_ASEWKT(ST_MAKEGEOMPOINT(-122.35, 37.55))` → `'SRID=4326;POINT(-122.35 37.55)'` |
| [ST_ASEWKB](st-asewkb.md) | 将几何体转换为 EWKB | `ST_ASEWKB(ST_MAKEGEOMPOINT(-122.35, 37.55))` → `EWKB representation` |
| [ST_ASGEOJSON](st-asgeojson.md) | 将几何体转换为 GeoJSON | `ST_ASGEOJSON(ST_MAKEGEOMPOINT(-122.35, 37.55))` → `'{"type":"Point","coordinates":[-122.35,37.55]}'` |
| [ST_GEOHASH](st-geohash.md) | 将几何体转换为 GeoHash | `ST_GEOHASH(ST_MAKEGEOMPOINT(-122.35, 37.55), 7)` → `'9q8yyk8'` |
| [TO_STRING](to-string.md) | 将几何体转换为字符串 | `TO_STRING(ST_MAKEGEOMPOINT(-122.35, 37.55))` → `'POINT(-122.35 37.55)'` |

## 几何属性

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [ST_DIMENSION](st-dimension.md) | 返回几何体的维度 | `ST_DIMENSION(ST_MAKEGEOMPOINT(-122.35, 37.55))` → `0` |
| [ST_SRID](st-srid.md) | 返回几何体的 SRID | `ST_SRID(ST_MAKEGEOMPOINT(-122.35, 37.55))` → `4326` |
| [ST_NPOINTS](st-npoints.md) / [ST_NUMPOINTS](st-numpoints.md) | 返回几何体中的点数 | `ST_NPOINTS(ST_MAKELINE(...))` → `2` |
| [ST_X](st-x.md) | 返回点的 X 坐标 | `ST_X(ST_MAKEGEOMPOINT(-122.35, 37.55))` → `-122.35` |
| [ST_Y](st-y.md) | 返回点的 Y 坐标 | `ST_Y(ST_MAKEGEOMPOINT(-122.35, 37.55))` → `37.55` |
| [ST_XMIN](st-xmin.md) | 返回最小 X 坐标 | `ST_XMIN(ST_MAKELINE(...))` → `-122.40` |
| [ST_XMAX](st-xmax.md) | 返回最大 X 坐标 | `ST_XMAX(ST_MAKELINE(...))` → `-122.35` |
| [ST_YMIN](st-ymin.md) | 返回最小 Y 坐标 | `ST_YMIN(ST_MAKELINE(...))` → `37.55` |
| [ST_YMAX](st-ymax.md) | 返回最大 Y 坐标 | `ST_YMAX(ST_MAKELINE(...))` → `37.60` |
| [ST_LENGTH](st-length.md) | 返回线字符串的长度 | `ST_LENGTH(ST_MAKELINE(...))` → `5.57` |

## 几何访问器

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [ST_POINTN](st-pointn.md) | 从线字符串返回指定点 | `ST_POINTN(ST_MAKELINE(...), 1)` → `POINT(-122.35 37.55)` |
| [ST_STARTPOINT](st-startpoint.md) | 返回线字符串的起点 | `ST_STARTPOINT(ST_MAKELINE(...))` → `POINT(-122.35 37.55)` |
| [ST_ENDPOINT](st-endpoint.md) | 返回线字符串的终点 | `ST_ENDPOINT(ST_MAKELINE(...))` → `POINT(-122.40 37.60)` |

## 空间操作

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [ST_DISTANCE](st-distance.md) | 返回两个几何体间的距离 | `ST_DISTANCE(ST_MAKEGEOMPOINT(-122.35, 37.55), ST_MAKEGEOMPOINT(-122.40, 37.60))` → `5.57` |
| [HAVERSINE](haversine.md) | 返回两点间的大圆距离 | `HAVERSINE(37.55, -122.35, 37.60, -122.40)` → `6.12` |
| [ST_CONTAINS](st-contains.md) | 判断几何体是否包含另一几何体 | `ST_CONTAINS(ST_MAKEPOLYGON(...), ST_MAKEGEOMPOINT(...))` → `TRUE` |
| [ST_TRANSFORM](st-transform.md) | 将几何体从某 SRID 转换至另一 SRID | `ST_TRANSFORM(ST_MAKEGEOMPOINT(-122.35, 37.55), 3857)` → `POINT(-13618288.8 4552395.0)` |
| [ST_SETSRID](st-setsrid.md) | 设置几何体的 SRID | `ST_SETSRID(ST_MAKEGEOMPOINT(-122.35, 37.55), 3857)` → `POINT(-122.35 37.55)` |