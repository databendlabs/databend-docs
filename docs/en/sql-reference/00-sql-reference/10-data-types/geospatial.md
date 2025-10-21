---
title: Geospatial
---

Databend supports these geospatial data types for handling spatial data:

- **GEOMETRY**: Uses a planar coordinate system (Cartesian coordinates) suitable for 2D geometric objects. Coordinates are represented as (X, Y) pairs, with units determined by the associated spatial reference system (SRS). The default SRID is 0, but custom SRIDs can be specified. Ideal for small-scale measurements like city or provincial analyses, it offers high computational speed and low resource usage but may introduce significant errors over larger areas.

- **GEOGRAPHY**: Uses a geographic coordinate system (spherical coordinates) based on latitude (-90° to 90°) and longitude (-180° to 180°), adhering to WGS 84 (SRID 4326). Designed for global or large-scale spatial data, it provides accuracy over vast distances but with higher computational complexity and resource requirements. It can be converted to GEOMETRY when needed.

:::note
The GEOMETRY and GEOGRAPHY types are currently experimental features. To create tables using these types, execute `SET enable_geo_create_table = 1` to enable them first.
:::

## Supported Object Types

Databend supports a range of geospatial object types, enabling precise representation and analysis of spatial data for both planar (GEOMETRY) and spherical (GEOGRAPHY) coordinate systems.

| Object Type        | Description                                                                                                     | GEOMETRY Example                                                                                  | GEOGRAPHY Example                                                                                  |
|--------------------|-----------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| Point              | A zero-dimensional geometric object, representing a specific location or coordinate point.                      | POINT(10 20)                                                                                      | POINT(-122.4194 37.7749) (San Francisco coordinates)                                               |
| LineString         | A one-dimensional geometric object formed by a series of connected points, representing paths or line segments. | LINESTRING(10 20, 30 40, 50 60)                                                                   | LINESTRING(-122.4194 37.7749, -73.9352 40.7306) (San Francisco to New York)                        |
| Polygon            | A two-dimensional geometric object with an outer ring and optional inner rings, representing areas.             | POLYGON((10 20, 30 40, 50 60, 10 20))                                                             | POLYGON((-122.5 37.7, -122.4 37.8, -122.3 37.7, -122.5 37.7)) (A region in San Francisco)          |
| MultiPoint         | A collection of multiple zero-dimensional geometric objects.                                                    | MULTIPOINT((10 20), (30 40), (50 60))                                                             | MULTIPOINT((-122.4194 37.7749), (-73.9352 40.7306)) (Points in San Francisco and New York)         |
| MultiLineString    | A collection of multiple LineString objects.                                                                    | MULTILINESTRING((10 20, 30 40), (50 60, 70 80))                                                   | MULTILINESTRING((-122.5 37.7, -122.4 37.8), (-122.3 37.7, -122.2 37.8)) (Multiple paths in a city) |
| MultiPolygon       | A collection of multiple Polygon objects, representing multiple regions or areas.                               | MULTIPOLYGON(((10 20, 30 40, 50 60, 10 20)), ((15 25, 25 35, 35 45, 15 25)))                      | MULTIPOLYGON(((-122.5 37.7, -122.4 37.8, -122.3 37.7, -122.5 37.7))) (Multiple regions in a city)  |
| GeometryCollection | A collection of different types of geometric objects, such as points, lines, and polygons.                      | GEOMETRYCOLLECTION(POINT(10 20), LINESTRING(10 20, 30 40), POLYGON((10 20, 30 40, 50 60, 10 20))) | GEOMETRYCOLLECTION(POINT(-122.4194 37.7749), LINESTRING(-122.5 37.7, -122.4 37.8))                 |

## Supported Output Formats

Databend supports multiple geospatial output formats—[WKT (Well-Known Text)](https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry), EWKT (Extended Well-Known Text), [WKB (Well-Known Binary)](https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry#Well-known_binary), EWKB (Extended Well-Known Binary), and [GeoJSON](https://geojson.org/). EWKT and EWKB extend WKT and WKB by including an SRID (Spatial Reference System Identifier) to specify the coordinate reference system, e.g., `SRID=4326;POINT(-44.3 60.1)`. 

| Object Type        | WKT Example                                                                                         | GeoJSON Example                                                                                                   |
|--------------------|-----------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------|
| Point              | `POINT(10 10)`                                                                                      | `{"coordinates":[10,10],"type":"Point"}`                                                                          |
| LineString         | `LINESTRING(10 10, 20 30)`                                                                          | `{"coordinates":[[10,10],[20,30]],"type":"LineString"}`                                                           |
| Polygon            | `POLYGON((10 10, 15 16, 22 10, 30 32))`                                                             | `{"coordinates":[[[10,10],[15,16],[22,10],[30,32],[10,10]]],"type":"Polygon"}`                                    |
| MultiPoint         | `MULTIPOINT((10 20), (30 40), (50 60))`                                                             | `{"coordinates":[[10,20],[30,40],[50,60]],"type":"MultiPoint"}`                                                   |
| MultiLineString    | `MULTILINESTRING((10 20, 30 40), (50 60, 70 80))`                                                   | `{"coordinates":[[[10,20],[30,40]],[[50,60],[70,80]]],"type":"MultiLineString"}`                                  |
| MultiPolygon       | `MULTIPOLYGON(((10 20, 30 40, 50 60, 10 20)), ((15 25, 25 35, 35 45, 15 25)))`                      | `{"coordinates":[[[[10,20],[30,40],[50,60],[10,20]]],[[[15,25],[25,35],[35,45],[15,25]]]],"type":"MultiPolygon"}` |
| GeometryCollection | `GEOMETRYCOLLECTION(POINT(10 20), LINESTRING(10 20, 30 40), POLYGON((10 20, 30 40, 50 60, 10 20)))` | `{"coordinates":[[[10,20],[30,40],[50,60],[10,20]]],"type":"Polygon"}`                                            |

To switch the geospatial output format in Databend, configure the `SET geometry_output_format` setting with your desired format. For example, 

```sql
SET geometry_output_format = 'geojson';
```

## Functions

Explore the links below to discover all the available geospatial functions organized by category.

- [Geospatial Functions](../../20-sql-functions/09-geospatial-functions/index.md)

## Examples

```sql
-- Enable geospatial types
SET enable_geo_create_table=1;

-- Set the output format to WKT
SET geometry_output_format='wkt';


CREATE OR REPLACE TABLE test (id INT, geo GEOMETRY);
INSERT INTO test VALUES
    (1, 'POINT(66 12)'),
    (2, 'MULTIPOINT((45 21), (12 54))'),
    (3, 'LINESTRING(40 60, 50 50, 60 40)'),
    (4, 'MULTILINESTRING((1 1, 32 17), (33 12, 73 49, 87.1 6.1))'),
    (5, 'POLYGON((17 17, 17 30, 30 30, 30 17, 17 17))'),
    (6, 'MULTIPOLYGON(((-10 0,0 10,10 0,-10 0)),((-10 40,10 40,0 20,-10 40)))'),
    (7, 'GEOMETRYCOLLECTION(POLYGON((-10 0,0 10,10 0,-10 0)),LINESTRING(40 60, 50 50, 60 40), POINT(99 11))');

SELECT id, geo FROM test;
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│        id       │                                               geo                                               │
├─────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────┤
│               1 │ POINT(66 12)                                                                                    │
│               2 │ MULTIPOINT(45 21,12 54)                                                                         │
│               3 │ LINESTRING(40 60,50 50,60 40)                                                                   │
│               4 │ MULTILINESTRING((1 1,32 17),(33 12,73 49,87.1 6.1))                                             │
│               5 │ POLYGON((17 17,17 30,30 30,30 17,17 17))                                                        │
│               6 │ MULTIPOLYGON(((-10 0,0 10,10 0,-10 0)),((-10 40,10 40,0 20,-10 40)))                            │
│               7 │ GEOMETRYCOLLECTION(POLYGON((-10 0,0 10,10 0,-10 0)),LINESTRING(40 60,50 50,60 40),POINT(99 11)) │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

-- Convert to WKB format
SELECT id, st_aswkb(geo) FROM test WHERE id=1;
┌──────────────────────────────────────────────────────────────┐
│        id       │                st_aswkb(geo)               │
├─────────────────┼────────────────────────────────────────────┤
│               1 │ 010100000000000000008050400000000000002840 │
└──────────────────────────────────────────────────────────────┘

-- Convert to GeoJSON format
SELECT id, st_asgeojson(geo) FROM test WHERE id=1;
┌──────────────────────────────────────────────────────────┐
│        id       │            st_asgeojson(geo)           │
├─────────────────┼────────────────────────────────────────┤
│               1 │ {"coordinates":[66,12],"type":"Point"} │
└──────────────────────────────────────────────────────────┘

-- Get the X and Y coordinates of a Point
SELECT id, st_x(geo), st_y(geo) FROM test WHERE id=1;
┌─────────────────────────────────────────────────────────┐
│        id       │     st_x(geo)     │     st_y(geo)     │
├─────────────────┼───────────────────┼───────────────────┤
│               1 │                66 │                12 │
└─────────────────────────────────────────────────────────┘

-- Get the dimension of the data
SELECT id, st_dimension(geo) FROM test;
┌─────────────────────────────────────┐
│        id       │ st_dimension(geo) │
├─────────────────┼───────────────────┤
│               1 │                 0 │
│               2 │                 0 │
│               3 │                 1 │
│               4 │                 1 │
│               5 │                 2 │
│               6 │                 2 │
│               7 │                 2 │
└─────────────────────────────────────┘

-- Transform the spatial reference system from 4326 to 3857
SELECT id, st_transform(geo, 4326, 3857) FROM test;
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│        id       │                                                                                                           st_transform(geo, 4326, 3857)                                                                                                          │
├─────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│               1 │ POINT(7347086.392356 1345708.408409)                                                                                                                                                                                                             │
│               2 │ MULTIPOINT(5009377.085697 2391878.587944,1335833.889519 7170156.294)                                                                                                                                                                             │
│               3 │ LINESTRING(4452779.631731 8399737.889818,5565974.539664 6446275.841017,6679169.447596 4865942.279503)                                                                                                                                            │
│               4 │ MULTILINESTRING((111319.490793 111325.142866,3562223.705385 1920825.040377),(3673543.196178 1345708.408409,8126322.827909 6274861.394007,9695927.648094 680335.356476))                                                                          │
│               5 │ POLYGON((1892431.343486 1920825.040377,1892431.343486 3503549.843504,3339584.723798 3503549.843504,3339584.723798 1920825.040377,1892431.343486 1920825.040377))                                                                                 │
│               6 │ MULTIPOLYGON(((-1113194.907933 0,0 1118889.974858,1113194.907933 0,-1113194.907933 0)),((-1113194.907933 4865942.279503,1113194.907933 4865942.279503,0 2273030.926988,-1113194.907933 4865942.279503)))                                         │
│               7 │ GEOMETRYCOLLECTION(POLYGON((-1113194.907933 0,0 1118889.974858,1113194.907933 0,-1113194.907933 0)),LINESTRING(4452779.631731 8399737.889818,5565974.539664 6446275.841017,6679169.447596 4865942.279503),POINT(11020629.588534 1232106.801897)) │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```
