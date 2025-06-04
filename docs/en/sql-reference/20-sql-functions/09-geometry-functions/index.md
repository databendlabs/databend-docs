---
title: Geometry Functions
---

This page provides a comprehensive overview of Geometry functions in Databend, organized by functionality for easy reference.

## Geometry Creation Functions

| Function | Description | Example |
|----------|-------------|--------|
| [ST_MAKEGEOMPOINT](st-makegeompoint.md) / [ST_GEOM_POINT](st-geom-point.md) | Constructs a Point geometry | `ST_MAKEGEOMPOINT(-122.35, 37.55)` → `POINT(-122.35 37.55)` |
| [ST_MAKELINE](st-makeline.md) / [ST_MAKE_LINE](st-make-line.md) | Creates a LineString from Points | `ST_MAKELINE(ST_MAKEGEOMPOINT(-122.35, 37.55), ST_MAKEGEOMPOINT(-122.40, 37.60))` → `LINESTRING(-122.35 37.55, -122.40 37.60)` |
| [ST_MAKEPOLYGON](st-makepolygon.md) | Creates a Polygon from a LineString | `ST_MAKEPOLYGON(ST_MAKELINE(...))` → `POLYGON(...)` |
| [ST_POLYGON](st-polygon.md) | Creates a Polygon | `ST_POLYGON(...)` → `POLYGON(...)` |

## Geometry Conversion Functions

| Function | Description | Example |
|----------|-------------|--------|
| [ST_GEOMETRYFROMTEXT](st-geometryfromtext.md) / [ST_GEOMFROMTEXT](st-geomfromtext.md) | Converts WKT to geometry | `ST_GEOMETRYFROMTEXT('POINT(-122.35 37.55)')` → `POINT(-122.35 37.55)` |
| [ST_GEOMETRYFROMWKB](st-geometryfromwkb.md) / [ST_GEOMFROMWKB](st-geomfromwkb.md) | Converts WKB to geometry | `ST_GEOMETRYFROMWKB(...)` → `POINT(...)` |
| [ST_GEOMETRYFROMEWKT](st-geometryfromewkt.md) / [ST_GEOMFROMEWKT](st-geomfromewkt.md) | Converts EWKT to geometry | `ST_GEOMETRYFROMEWKT('SRID=4326;POINT(-122.35 37.55)')` → `POINT(-122.35 37.55)` |
| [ST_GEOMETRYFROMEWKB](st-geometryfromewkb.md) / [ST_GEOMFROMEWKB](st-geomfromewkb.md) | Converts EWKB to geometry | `ST_GEOMETRYFROMEWKB(...)` → `POINT(...)` |
| [ST_GEOMFROMGEOHASH](st-geomfromgeohash.md) | Converts GeoHash to geometry | `ST_GEOMFROMGEOHASH('9q8yyk8')` → `POLYGON(...)` |
| [ST_GEOMPOINTFROMGEOHASH](st-geompointfromgeohash.md) | Converts GeoHash to Point | `ST_GEOMPOINTFROMGEOHASH('9q8yyk8')` → `POINT(...)` |
| [TO_GEOMETRY](to-geometry.md) | Converts various formats to geometry | `TO_GEOMETRY('POINT(-122.35 37.55)')` → `POINT(-122.35 37.55)` |

## Geometry Output Functions

| Function | Description | Example |
|----------|-------------|--------|
| [ST_ASTEXT](st-astext.md) | Converts geometry to WKT | `ST_ASTEXT(ST_MAKEGEOMPOINT(-122.35, 37.55))` → `'POINT(-122.35 37.55)'` |
| [ST_ASWKT](st-aswkt.md) | Converts geometry to WKT | `ST_ASWKT(ST_MAKEGEOMPOINT(-122.35, 37.55))` → `'POINT(-122.35 37.55)'` |
| [ST_ASBINARY](st-asbinary.md) / [ST_ASWKB](st-aswkb.md) | Converts geometry to WKB | `ST_ASBINARY(ST_MAKEGEOMPOINT(-122.35, 37.55))` → `WKB representation` |
| [ST_ASEWKT](st-asewkt.md) | Converts geometry to EWKT | `ST_ASEWKT(ST_MAKEGEOMPOINT(-122.35, 37.55))` → `'SRID=4326;POINT(-122.35 37.55)'` |
| [ST_ASEWKB](st-asewkb.md) | Converts geometry to EWKB | `ST_ASEWKB(ST_MAKEGEOMPOINT(-122.35, 37.55))` → `EWKB representation` |
| [ST_ASGEOJSON](st-asgeojson.md) | Converts geometry to GeoJSON | `ST_ASGEOJSON(ST_MAKEGEOMPOINT(-122.35, 37.55))` → `'{"type":"Point","coordinates":[-122.35,37.55]}'` |
| [ST_GEOHASH](st-geohash.md) | Converts geometry to GeoHash | `ST_GEOHASH(ST_MAKEGEOMPOINT(-122.35, 37.55), 7)` → `'9q8yyk8'` |
| [TO_STRING](to-string.md) | Converts geometry to string | `TO_STRING(ST_MAKEGEOMPOINT(-122.35, 37.55))` → `'POINT(-122.35 37.55)'` |

## Geometry Properties

| Function | Description | Example |
|----------|-------------|--------|
| [ST_DIMENSION](st-dimension.md) | Returns the dimension of a geometry | `ST_DIMENSION(ST_MAKEGEOMPOINT(-122.35, 37.55))` → `0` |
| [ST_SRID](st-srid.md) | Returns the SRID of a geometry | `ST_SRID(ST_MAKEGEOMPOINT(-122.35, 37.55))` → `4326` |
| [ST_NPOINTS](st-npoints.md) / [ST_NUMPOINTS](st-numpoints.md) | Returns the number of points in a geometry | `ST_NPOINTS(ST_MAKELINE(...))` → `2` |
| [ST_X](st-x.md) | Returns the X coordinate of a Point | `ST_X(ST_MAKEGEOMPOINT(-122.35, 37.55))` → `-122.35` |
| [ST_Y](st-y.md) | Returns the Y coordinate of a Point | `ST_Y(ST_MAKEGEOMPOINT(-122.35, 37.55))` → `37.55` |
| [ST_XMIN](st-xmin.md) | Returns the minimum X coordinate | `ST_XMIN(ST_MAKELINE(...))` → `-122.40` |
| [ST_XMAX](st-xmax.md) | Returns the maximum X coordinate | `ST_XMAX(ST_MAKELINE(...))` → `-122.35` |
| [ST_YMIN](st-ymin.md) | Returns the minimum Y coordinate | `ST_YMIN(ST_MAKELINE(...))` → `37.55` |
| [ST_YMAX](st-ymax.md) | Returns the maximum Y coordinate | `ST_YMAX(ST_MAKELINE(...))` → `37.60` |
| [ST_LENGTH](st-length.md) | Returns the length of a LineString | `ST_LENGTH(ST_MAKELINE(...))` → `5.57` |

## Geometry Accessors

| Function | Description | Example |
|----------|-------------|--------|
| [ST_POINTN](st-pointn.md) | Returns a specific Point from a LineString | `ST_POINTN(ST_MAKELINE(...), 1)` → `POINT(-122.35 37.55)` |
| [ST_STARTPOINT](st-startpoint.md) | Returns the first Point of a LineString | `ST_STARTPOINT(ST_MAKELINE(...))` → `POINT(-122.35 37.55)` |
| [ST_ENDPOINT](st-endpoint.md) | Returns the last Point of a LineString | `ST_ENDPOINT(ST_MAKELINE(...))` → `POINT(-122.40 37.60)` |

## Spatial Operations

| Function | Description | Example |
|----------|-------------|--------|
| [ST_DISTANCE](st-distance.md) | Returns the distance between two geometries | `ST_DISTANCE(ST_MAKEGEOMPOINT(-122.35, 37.55), ST_MAKEGEOMPOINT(-122.40, 37.60))` → `5.57` |
| [HAVERSINE](haversine.md) | Returns the great-circle distance between two points | `HAVERSINE(37.55, -122.35, 37.60, -122.40)` → `6.12` |
| [ST_CONTAINS](st-contains.md) | Checks if one geometry contains another | `ST_CONTAINS(ST_MAKEPOLYGON(...), ST_MAKEGEOMPOINT(...))` → `TRUE` |
| [ST_TRANSFORM](st-transform.md) | Transforms geometry from one SRID to another | `ST_TRANSFORM(ST_MAKEGEOMPOINT(-122.35, 37.55), 3857)` → `POINT(-13618288.8 4552395.0)` |
| [ST_SETSRID](st-setsrid.md) | Sets the SRID of a geometry | `ST_SETSRID(ST_MAKEGEOMPOINT(-122.35, 37.55), 3857)` → `POINT(-122.35 37.55)` |