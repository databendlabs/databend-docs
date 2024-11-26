---
title: Geospatial
---

Databend supports these geospatial data types for handling spatial data:

- **GEOMETRY**: Uses a planar coordinate system (Cartesian coordinates) suitable for 2D geometric objects. Coordinates are represented as (X, Y) pairs, with units determined by the associated spatial reference system (SRS). The default SRID is 0, but custom SRIDs can be specified. Ideal for small-scale measurements like city or provincial analyses, it offers high computational speed and low resource usage but may introduce significant errors over larger areas.

- **GEOGRAPHY**: Uses a geographic coordinate system (spherical coordinates) based on latitude (-90° to 90°) and longitude (-180° to 180°), adhering to WGS 84 (SRID 4326). Designed for global or large-scale spatial data, it provides accuracy over vast distances but with higher computational complexity and resource requirements. It can be converted to GEOMETRY when needed.

:::note
The GEOMETRY and GEOGRAPHY types are currently experimental features. To create tables using these types, execute `SET enable_geo_create_table = 1` to enable them first.
:::

## Supported Geospatial Object Types

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

## Supported Geospatial Output Formats

Databend supports three geospatial output formats—[WKT (Well-Known Text)](https://www.ogc.org/standards/sfa), [WKB (Well-Known Binary)](https://www.ogc.org/standards/sfa), and [GeoJSON](https://geojson.org/)—enabling compatibility with a wide range of geospatial applications and tools.

| Object Type        | WKT Example                                                                                         | GeoJSON Example                                                                                                   |
|--------------------|-----------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------|
| Point              | `POINT(10 10)`                                                                                      | `{"coordinates":[10,10],"type":"Point"}`                                                                          |
| LineString         | `LINESTRING(10 10, 20 30)`                                                                          | `{"coordinates":[[10,10],[20,30]],"type":"LineString"}`                                                           |
| Polygon            | `POLYGON((10 10, 15 16, 22 10, 30 32))`                                                             | `{"coordinates":[[[10,10],[15,16],[22,10],[30,32],[10,10]]],"type":"Polygon"}`                                    |
| MultiPoint         | `MULTIPOINT((10 20), (30 40), (50 60))`                                                             | `{"coordinates":[[10,20],[30,40],[50,60]],"type":"MultiPoint"}`                                                   |
| MultiLineString    | `MULTILINESTRING((10 20, 30 40), (50 60, 70 80))`                                                   | `{"coordinates":[[[10,20],[30,40]],[[50,60],[70,80]]],"type":"MultiLineString"}`                                  |
| MultiPolygon       | `MULTIPOLYGON(((10 20, 30 40, 50 60, 10 20)), ((15 25, 25 35, 35 45, 15 25)))`                      | `{"coordinates":[[[[10,20],[30,40],[50,60],[10,20]]],[[[15,25],[25,35],[35,45],[15,25]]]],"type":"MultiPolygon"}` |
| GeometryCollection | `GEOMETRYCOLLECTION(POINT(10 20), LINESTRING(10 20, 30 40), POLYGON((10 20, 30 40, 50 60, 10 20)))` | `{"coordinates":[[[10,20],[30,40],[50,60],[10,20]]],"type":"Polygon"}`                                            |

To switch the geospatial output format in Databend, configure the `SET geometry_output_format` setting with your desired format: `wkt`, `wkb`, or `geojson`. For example, 

```sql
SET geometry_output_format = 'geojson';
```
