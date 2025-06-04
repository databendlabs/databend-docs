---
title: H3 Functions
---

This section provides reference information for the H3 functions in Databend. H3 is a geospatial indexing system that partitions the world into hexagonal cells, enabling efficient spatial analysis and operations.

## Coordinate Conversion

| Function | Description | Example |
|----------|-------------|--------|
| [GEO_TO_H3](geo-to-h3) | Converts longitude/latitude to H3 index | `GEO_TO_H3(37.7950, 55.7129, 15)` → `644325524701193974` |
| [H3_TO_GEO](h3-to-geo) | Converts H3 index to longitude/latitude | `H3_TO_GEO(644325524701193974)` → `[37.7950, 55.7129]` |
| [H3_TO_STRING](h3-to-string) | Converts H3 index to string representation | `H3_TO_STRING(644325524701193974)` → `'8f2830828052d25'` |
| [STRING_TO_H3](string-to-h3) | Converts string representation to H3 index | `STRING_TO_H3('8f2830828052d25')` → `644325524701193974` |
| [GEOHASH_ENCODE](geohash-encode) | Encodes longitude/latitude to geohash string | `GEOHASH_ENCODE(37.7950, 55.7129, 12)` → `'ucfv0nzpt3s7'` |
| [GEOHASH_DECODE](geohash-decode) | Decodes geohash string to longitude/latitude | `GEOHASH_DECODE('ucfv0nzpt3s7')` → `[37.7950, 55.7129]` |

## Hexagon Properties

| Function | Description | Example |
|----------|-------------|--------|
| [H3_GET_RESOLUTION](h3-get-resolution) | Returns the resolution of an H3 index | `H3_GET_RESOLUTION(644325524701193974)` → `15` |
| [H3_GET_BASE_CELL](h3-get-base-cell) | Returns the base cell number of an H3 index | `H3_GET_BASE_CELL(644325524701193974)` → `14` |
| [H3_IS_VALID](h3-is-valid) | Checks if an H3 index is valid | `H3_IS_VALID(644325524701193974)` → `TRUE` |
| [H3_IS_PENTAGON](h3-is-pentagon) | Checks if an H3 index is a pentagon | `H3_IS_PENTAGON(644325524701193974)` → `FALSE` |
| [H3_IS_RES_CLASS_III](h3-is-res-class-iii) | Checks if an H3 index is in resolution class III | `H3_IS_RES_CLASS_III(644325524701193974)` → `FALSE` |
| [H3_GET_FACES](h3-get-faces) | Returns the icosahedron faces intersected by an H3 cell | `H3_GET_FACES(644325524701193974)` → `[7]` |
| [H3_TO_PARENT](h3-to-parent) | Returns the parent of an H3 index at a specified resolution | `H3_TO_PARENT(644325524701193974, 10)` → `622236721289822207` |
| [H3_TO_CHILDREN](h3-to-children) | Returns the children of an H3 index at a specified resolution | `H3_TO_CHILDREN(622236721289822207, 11)` → `[...]` |
| [H3_TO_CENTER_CHILD](h3-to-center-child) | Returns the center child of an H3 index at a specified resolution | `H3_TO_CENTER_CHILD(622236721289822207, 11)` → `625561602857582591` |

## Area and Boundary

| Function | Description | Example |
|----------|-------------|--------|
| [H3_CELL_AREA_M2](h3-cell-area-m2) | Returns the area of an H3 cell in square meters | `H3_CELL_AREA_M2(644325524701193974)` → `0.8953` |
| [H3_CELL_AREA_RADS2](h3-cell-area-rads2) | Returns the area of an H3 cell in square radians | `H3_CELL_AREA_RADS2(644325524701193974)` → `2.2e-14` |
| [H3_HEX_AREA_KM2](h3-hex-area-km2) | Returns the average hexagon area in square kilometers at a resolution | `H3_HEX_AREA_KM2(10)` → `0.0152` |
| [H3_HEX_AREA_M2](h3-hex-area-m2) | Returns the average hexagon area in square meters at a resolution | `H3_HEX_AREA_M2(10)` → `15200` |
| [H3_TO_GEO_BOUNDARY](h3-to-geo-boundary) | Returns the boundary of an H3 cell as an array of coordinates | `H3_TO_GEO_BOUNDARY(644325524701193974)` → `[[lon1,lat1], [lon2,lat2], ...]` |
| [H3_NUM_HEXAGONS](h3-num-hexagons) | Returns the number of hexagons at a resolution | `H3_NUM_HEXAGONS(2)` → `5882` |

## Hexagon Relationships

| Function | Description | Example |
|----------|-------------|--------|
| [H3_DISTANCE](h3-distance) | Returns the grid distance between two H3 indexes | `H3_DISTANCE(599119489002373119, 599119491149856767)` → `1` |
| [H3_INDEXES_ARE_NEIGHBORS](h3-indexes-are-neighbors) | Checks if two H3 indexes are neighbors | `H3_INDEXES_ARE_NEIGHBORS(599119489002373119, 599119491149856767)` → `TRUE` |
| [H3_K_RING](h3-k-ring) | Returns all H3 indexes within k distance of the origin | `H3_K_RING(599119489002373119, 1)` → `[599119489002373119, 599119491149856767, ...]` |
| [H3_HEX_RING](h3-hex-ring) | Returns all H3 indexes at exactly k distance from the origin | `H3_HEX_RING(599119489002373119, 1)` → `[599119491149856767, ...]` |

## Edge Functions

| Function | Description | Example |
|----------|-------------|--------|
| [H3_GET_UNIDIRECTIONAL_EDGE](h3-get-unidirectional-edge) | Returns the edge index between two adjacent H3 indexes | `H3_GET_UNIDIRECTIONAL_EDGE(from_h3, to_h3)` → `edge_index` |
| [H3_UNIDIRECTIONAL_EDGE_IS_VALID](h3-unidirectional-edge-is-valid) | Checks if an H3 edge index is valid | `H3_UNIDIRECTIONAL_EDGE_IS_VALID(edge_index)` → `TRUE` |
| [H3_GET_ORIGIN_INDEX_FROM_UNIDIRECTIONAL_EDGE](h3-get-origin-index-from-unidirectional-edge) | Returns the origin H3 index from an edge | `H3_GET_ORIGIN_INDEX_FROM_UNIDIRECTIONAL_EDGE(edge_index)` → `from_h3` |
| [H3_GET_DESTINATION_INDEX_FROM_UNIDIRECTIONAL_EDGE](h3-get-destination-index-from-unidirectional-edge) | Returns the destination H3 index from an edge | `H3_GET_DESTINATION_INDEX_FROM_UNIDIRECTIONAL_EDGE(edge_index)` → `to_h3` |
| [H3_GET_INDEXES_FROM_UNIDIRECTIONAL_EDGE](h3-get-indexes-from-unidirectional-edge) | Returns both origin and destination H3 indexes from an edge | `H3_GET_INDEXES_FROM_UNIDIRECTIONAL_EDGE(edge_index)` → `[from_h3, to_h3]` |
| [H3_GET_UNIDIRECTIONAL_EDGES_FROM_HEXAGON](h3-get-unidirectional-edges-from-hexagon) | Returns all edges originating from an H3 index | `H3_GET_UNIDIRECTIONAL_EDGES_FROM_HEXAGON(h3_index)` → `[edge1, edge2, ...]` |
| [H3_GET_UNIDIRECTIONAL_EDGE_BOUNDARY](h3-get-unidirectional-edge-boundary) | Returns the boundary of an H3 edge | `H3_GET_UNIDIRECTIONAL_EDGE_BOUNDARY(edge_index)` → `[[lon1,lat1], [lon2,lat2]]` |

## Measurement

| Function | Description | Example |
|----------|-------------|--------|
| [H3_EDGE_LENGTH_KM](h3-edge-length-km) | Returns the average edge length in kilometers at a resolution | `H3_EDGE_LENGTH_KM(10)` → `0.065` |
| [H3_EDGE_LENGTH_M](h3-edge-length-m) | Returns the average edge length in meters at a resolution | `H3_EDGE_LENGTH_M(10)` → `65.91` |
| [H3_EXACT_EDGE_LENGTH_KM](h3-exact-edge-length-km) | Returns the exact edge length in kilometers | `H3_EXACT_EDGE_LENGTH_KM(edge_index)` → `0.066` |
| [H3_EXACT_EDGE_LENGTH_M](h3-exact-edge-length-m) | Returns the exact edge length in meters | `H3_EXACT_EDGE_LENGTH_M(edge_index)` → `66.12` |
| [H3_EXACT_EDGE_LENGTH_RADS](h3-exact-edge-length-rads) | Returns the exact edge length in radians | `H3_EXACT_EDGE_LENGTH_RADS(edge_index)` → `0.00001` |
| [H3_EDGE_ANGLE](h3-edge-angle) | Returns the angle in radians between two edges | `H3_EDGE_ANGLE(edge1, edge2)` → `1.047` |

## General Utility

| Function | Description | Example |
|----------|-------------|--------|
| [POINT_IN_POLYGON](point-in-polygon) | Checks if a point is inside a polygon | `POINT_IN_POLYGON([lon, lat], [[p1_lon, p1_lat], [p2_lon, p2_lat], ...])` → `TRUE` |
| [H3_LINE](h3-line) | Returns H3 indexes in a line between two H3 indexes | `H3_LINE(from_h3, to_h3)` → `[from_h3, ..., to_h3]` |