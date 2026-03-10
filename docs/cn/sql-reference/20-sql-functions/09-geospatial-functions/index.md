---
title: 地理空间函数
---

Databend 内置两套互补的地理空间能力：PostGIS 风格的几何（Geometry）函数，用于构建与分析形状；以及 H3 实用工具，用于全球六边形索引。下表按任务对函数进行分组，方便您快速定位所需工具，布局方式与 Snowflake 文档类似。

## 几何构造函数

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [ST_MAKEGEOMPOINT](st-makegeompoint.md) / [ST_GEOM_POINT](st-geom-point.md) | 构造 Point（点）几何体 | `ST_MAKEGEOMPOINT(-122.35, 37.55)` → `POINT(-122.35 37.55)` |
| [ST_MAKELINE](st-makeline.md) / [ST_MAKE_LINE](st-make-line.md) | 由若干 Point 创建 LineString（线串） | `ST_MAKELINE(ST_MAKEGEOMPOINT(-122.35, 37.55), ST_MAKEGEOMPOINT(-122.40, 37.60))` → `LINESTRING(-122.35 37.55, -122.40 37.60)` |
| [ST_MAKEPOLYGON](st-makepolygon.md) | 由闭合 LineString 创建 Polygon（多边形） | `ST_MAKEPOLYGON(ST_MAKELINE(...))` → `POLYGON(...)` |
| [ST_POLYGON](st-polygon.md) | 由坐标环创建 Polygon | `ST_POLYGON(...)` → `POLYGON(...)` |

## 几何转换

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [ST_GEOMETRYFROMTEXT](st-geometryfromtext.md) / [ST_GEOMFROMTEXT](st-geomfromtext.md) | 将 WKT 转换为几何体 | `ST_GEOMETRYFROMTEXT('POINT(-122.35 37.55)')` → `POINT(-122.35 37.55)` |
| [ST_GEOMETRYFROMWKB](st-geometryfromwkb.md) / [ST_GEOMFROMWKB](st-geomfromwkb.md) | 将 WKB 转换为几何体 | `ST_GEOMETRYFROMWKB(...)` → `POINT(...)` |
| [ST_GEOMETRYFROMEWKT](st-geometryfromewkt.md) / [ST_GEOMFROMEWKT](st-geomfromewkt.md) | 将 EWKT 转换为几何体 | `ST_GEOMETRYFROMEWKT('SRID=4326;POINT(-122.35 37.55)')` → `POINT(-122.35 37.55)` |
| [ST_GEOMETRYFROMEWKB](st-geometryfromewkb.md) / [ST_GEOMFROMEWKB](st-geomfromewkb.md) | 将 EWKB 转换为几何体 | `ST_GEOMETRYFROMEWKB(...)` → `POINT(...)` |
| [ST_GEOMFROMGEOHASH](st-geomfromgeohash.md) | 将 GeoHash 转换为几何体 | `ST_GEOMFROMGEOHASH('9q8yyk8')` → `POLYGON(...)` |
| [ST_GEOMPOINTFROMGEOHASH](st-geompointfromgeohash.md) | 将 GeoHash 转换为 Point 几何体 | `ST_GEOMPOINTFROMGEOHASH('9q8yyk8')` → `POINT(...)` |
| [TO_GEOMETRY](to-geometry.md) | 解析多种格式为几何体 | `TO_GEOMETRY('POINT(-122.35 37.55)')` → `POINT(-122.35 37.55)` |

## 几何输出

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [ST_ASTEXT](st-astext.md) | 将几何体转换为 WKT | `ST_ASTEXT(ST_MAKEGEOMPOINT(-122.35, 37.55))` → `'POINT(-122.35 37.55)'` |
| [ST_ASWKT](st-aswkt.md) | 将几何体转换为 WKT | `ST_ASWKT(ST_MAKEGEOMPOINT(-122.35, 37.55))` → `'POINT(-122.35 37.55)'` |
| [ST_ASBINARY](st-asbinary.md) / [ST_ASWKB](st-aswkb.md) | 将几何体转换为 WKB | `ST_ASBINARY(ST_MAKEGEOMPOINT(-122.35, 37.55))` → `WKB representation` |
| [ST_ASEWKT](st-asewkt.md) | 将几何体转换为 EWKT | `ST_ASEWKT(ST_MAKEGEOMPOINT(-122.35, 37.55))` → `'SRID=4326;POINT(-122.35 37.55)'` |
| [ST_ASEWKB](st-asewkb.md) | 将几何体转换为 EWKB | `ST_ASEWKB(ST_MAKEGEOMPOINT(-122.35, 37.55))` → `EWKB representation` |
| [ST_ASGEOJSON](st-asgeojson.md) | 将几何体转换为 GeoJSON | `ST_ASGEOJSON(ST_MAKEGEOMPOINT(-122.35, 37.55))` → `'{"type":"Point","coordinates":[-122.35,37.55]}'` |
| [ST_GEOHASH](st-geohash.md) | 将几何体转换为 GeoHash | `ST_GEOHASH(ST_MAKEGEOMPOINT(-122.35, 37.55), 7)` → `'9q8yyk8'` |
| [TO_STRING](to-string.md) | 将几何体转换为字符串 | `TO_STRING(ST_MAKEGEOMPOINT(-122.35, 37.55))` → `'POINT(-122.35 37.55)'` |

## 几何访问器与属性

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [ST_DIMENSION](st-dimension.md) | 返回拓扑维度 | `ST_DIMENSION(ST_MAKEGEOMPOINT(-122.35, 37.55))` → `0` |
| [ST_SRID](st-srid.md) | 返回几何体的 SRID | `ST_SRID(ST_MAKEGEOMPOINT(-122.35, 37.55))` → `4326` |
| [ST_SETSRID](st-setsrid.md) | 为几何体设置 SRID | `ST_SETSRID(ST_MAKEGEOMPOINT(-122.35, 37.55), 3857)` → `POINT(-122.35 37.55)` |
| [ST_TRANSFORM](st-transform.md) | 将几何体转换到新的 SRID | `ST_TRANSFORM(ST_MAKEGEOMPOINT(-122.35, 37.55), 3857)` → `POINT(-13618288.8 4552395.0)` |
| [ST_NPOINTS](st-npoints.md) / [ST_NUMPOINTS](st-numpoints.md) | 统计几何体中的点数 | `ST_NPOINTS(ST_MAKELINE(...))` → `2` |
| [ST_POINTN](st-pointn.md) | 返回 LineString 中的指定点 | `ST_POINTN(ST_MAKELINE(...), 1)` → `POINT(-122.35 37.55)` |
| [ST_STARTPOINT](st-startpoint.md) | 返回 LineString 的起点 | `ST_STARTPOINT(ST_MAKELINE(...))` → `POINT(-122.35 37.55)` |
| [ST_ENDPOINT](st-endpoint.md) | 返回 LineString 的终点 | `ST_ENDPOINT(ST_MAKELINE(...))` → `POINT(-122.40 37.60)` |
| [ST_LENGTH](st-length.md) | 测量 LineString 的长度 | `ST_LENGTH(ST_MAKELINE(...))` → `5.57` |
| [ST_X](st-x.md) / [ST_Y](st-y.md) | 返回 Point 的 X 或 Y 坐标 | `ST_X(ST_MAKEGEOMPOINT(-122.35, 37.55))` → `-122.35` |
| [ST_XMIN](st-xmin.md) / [ST_XMAX](st-xmax.md) | 返回最小/最大 X 坐标 | `ST_XMIN(ST_MAKELINE(...))` → `-122.40` |
| [ST_YMIN](st-ymin.md) / [ST_YMAX](st-ymax.md) | 返回最小/最大 Y 坐标 | `ST_YMAX(ST_MAKELINE(...))` → `37.60` |

## 空间关系

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [ST_CONTAINS](st-contains.md) | 测试一个几何体是否包含另一个几何体 | `ST_CONTAINS(ST_MAKEPOLYGON(...), ST_MAKEGEOMPOINT(...))` → `TRUE` |
| [POINT_IN_POLYGON](point-in-polygon.md) | 检查点是否位于多边形内部 | `POINT_IN_POLYGON([lon, lat], [[p1_lon, p1_lat], ...])` → `TRUE` |

## 距离与测量

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [ST_DISTANCE](st-distance.md) | 测量几何体之间的距离 | `ST_DISTANCE(ST_MAKEGEOMPOINT(-122.35, 37.55), ST_MAKEGEOMPOINT(-122.40, 37.60))` → `5.57` |
| [HAVERSINE](haversine.md) | 计算坐标间的大圆距离 | `HAVERSINE(37.55, -122.35, 37.60, -122.40)` → `6.12` |

## H3 索引与转换

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [GEO_TO_H3](geo-to-h3.md) | 将经度/纬度转换为 H3 索引 | `GEO_TO_H3(37.7950, 55.7129, 15)` → `644325524701193974` |
| [H3_TO_GEO](h3-to-geo.md) | 将 H3 索引转换为经度/纬度 | `H3_TO_GEO(644325524701193974)` → `[37.7950, 55.7129]` |
| [H3_TO_STRING](h3-to-string.md) | 将 H3 索引转换为字符串形式 | `H3_TO_STRING(644325524701193974)` → `'8f2830828052d25'` |
| [STRING_TO_H3](string-to-h3.md) | 将 H3 字符串转换为索引 | `STRING_TO_H3('8f2830828052d25')` → `644325524701193974` |
| [GEOHASH_ENCODE](geohash-encode.md) | 将经度/纬度编码为 GeoHash | `GEOHASH_ENCODE(37.7950, 55.7129, 12)` → `'ucfv0nzpt3s7'` |
| [GEOHASH_DECODE](geohash-decode.md) | 将 GeoHash 解码为经度/纬度 | `GEOHASH_DECODE('ucfv0nzpt3s7')` → `[37.7950, 55.7129]` |

## H3 单元格属性

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [H3_GET_RESOLUTION](h3-get-resolution.md) | 返回 H3 索引的分辨率 | `H3_GET_RESOLUTION(644325524701193974)` → `15` |
| [H3_GET_BASE_CELL](h3-get-base-cell.md) | 返回基础单元格编号 | `H3_GET_BASE_CELL(644325524701193974)` → `14` |
| [H3_IS_VALID](h3-is-valid.md) | 检查 H3 索引是否有效 | `H3_IS_VALID(644325524701193974)` → `TRUE` |
| [H3_IS_PENTAGON](h3-is-pentagon.md) | 检查 H3 索引是否为五边形 | `H3_IS_PENTAGON(644325524701193974)` → `FALSE` |
| [H3_IS_RES_CLASS_III](h3-is-res-class-iii.md) | 检查 H3 索引是否为 III 类 | `H3_IS_RES_CLASS_III(644325524701193974)` → `FALSE` |
| [H3_GET_FACES](h3-get-faces.md) | 返回相交的二十面体面 | `H3_GET_FACES(644325524701193974)` → `[7]` |
| [H3_TO_PARENT](h3-to-parent.md) | 返回低一级分辨率的父索引 | `H3_TO_PARENT(644325524701193974, 10)` → `622236721289822207` |
| [H3_TO_CHILDREN](h3-to-children.md) | 返回高一级分辨率的子索引 | `H3_TO_CHILDREN(622236721289822207, 11)` → `[...]` |
| [H3_TO_CENTER_CHILD](h3-to-center-child.md) | 返回指定分辨率的中心子索引 | `H3_TO_CENTER_CHILD(622236721289822207, 11)` → `625561602857582591` |
| [H3_CELL_AREA_M2](h3-cell-area-m2.md) | 返回单元格面积（平方米） | `H3_CELL_AREA_M2(644325524701193974)` → `0.8953` |
| [H3_CELL_AREA_RADS2](h3-cell-area-rads2.md) | 返回单元格面积（平方弧度） | `H3_CELL_AREA_RADS2(644325524701193974)` → `2.2e-14` |
| [H3_HEX_AREA_KM2](h3-hex-area-km2.md) | 返回平均六边形面积（平方千米） | `H3_HEX_AREA_KM2(10)` → `0.0152` |
| [H3_HEX_AREA_M2](h3-hex-area-m2.md) | 返回平均六边形面积（平方米） | `H3_HEX_AREA_M2(10)` → `15200` |
| [H3_TO_GEO_BOUNDARY](h3-to-geo-boundary.md) | 返回单元格边界 | `H3_TO_GEO_BOUNDARY(644325524701193974)` → `[[lon1,lat1], ...]` |
| [H3_NUM_HEXAGONS](h3-num-hexagons.md) | 返回指定分辨率下的六边形数量 | `H3_NUM_HEXAGONS(2)` → `5882` |

## H3 邻域

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [H3_DISTANCE](h3-distance.md) | 返回两个索引之间的网格距离 | `H3_DISTANCE(599119489002373119, 599119491149856767)` → `1` |
| [H3_INDEXES_ARE_NEIGHBORS](h3-indexes-are-neighbors.md) | 测试两个索引是否相邻 | `H3_INDEXES_ARE_NEIGHBORS(599119489002373119, 599119491149856767)` → `TRUE` |
| [H3_K_RING](h3-k-ring.md) | 返回 k 距离内的所有索引 | `H3_K_RING(599119489002373119, 1)` → `[599119489002373119, ...]` |
| [H3_HEX_RING](h3-hex-ring.md) | 返回恰好 k 步距离的索引 | `H3_HEX_RING(599119489002373119, 1)` → `[599119491149856767, ...]` |
| [H3_LINE](h3-line.md) | 返回路径上的索引 | `H3_LINE(from_h3, to_h3)` → `[from_h3, ..., to_h3]` |

## H3 边操作

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [H3_GET_UNIDIRECTIONAL_EDGE](h3-get-unidirectional-edge.md) | 返回两个相邻单元格之间的边 | `H3_GET_UNIDIRECTIONAL_EDGE(from_h3, to_h3)` → `edge_index` |
| [H3_UNIDIRECTIONAL_EDGE_IS_VALID](h3-unidirectional-edge-is-valid.md) | 检查边索引是否有效 | `H3_UNIDIRECTIONAL_EDGE_IS_VALID(edge_index)` → `TRUE` |
| [H3_GET_ORIGIN_INDEX_FROM_UNIDIRECTIONAL_EDGE](h3-get-origin-index-from-unidirectional-edge.md) | 从边返回起始单元格 | `H3_GET_ORIGIN_INDEX_FROM_UNIDIRECTIONAL_EDGE(edge_index)` → `from_h3` |
| [H3_GET_DESTINATION_INDEX_FROM_UNIDIRECTIONAL_EDGE](h3-get-destination-index-from-unidirectional-edge.md) | 从边返回目标单元格 | `H3_GET_DESTINATION_INDEX_FROM_UNIDIRECTIONAL_EDGE(edge_index)` → `to_h3` |
| [H3_GET_INDEXES_FROM_UNIDIRECTIONAL_EDGE](h3-get-indexes-from-unidirectional-edge.md) | 返回边对应的两个单元格 | `H3_GET_INDEXES_FROM_UNIDIRECTIONAL_EDGE(edge_index)` → `[from_h3, to_h3]` |
| [H3_GET_UNIDIRECTIONAL_EDGES_FROM_HEXAGON](h3-get-unidirectional-edges-from-hexagon.md) | 列出从单元格出发的所有边 | `H3_GET_UNIDIRECTIONAL_EDGES_FROM_HEXAGON(h3_index)` → `[edge1, edge2, ...]` |
| [H3_GET_UNIDIRECTIONAL_EDGE_BOUNDARY](h3-get-unidirectional-edge-boundary.md) | 返回边的边界 | `H3_GET_UNIDIRECTIONAL_EDGE_BOUNDARY(edge_index)` → `[[lon1,lat1], [lon2,lat2]]` |

## H3 测量与角度

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [H3_EDGE_LENGTH_KM](h3-edge-length-km.md) | 返回平均边长（千米） | `H3_EDGE_LENGTH_KM(10)` → `0.065` |
| [H3_EDGE_LENGTH_M](h3-edge-length-m.md) | 返回平均边长（米） | `H3_EDGE_LENGTH_M(10)` → `65.91` |
| [H3_EXACT_EDGE_LENGTH_KM](h3-exact-edge-length-km.md) | 返回精确边长（千米） | `H3_EXACT_EDGE_LENGTH_KM(edge_index)` → `0.066` |
| [H3_EXACT_EDGE_LENGTH_M](h3-exact-edge-length-m.md) | 返回精确边长（米） | `H3_EXACT_EDGE_LENGTH_M(edge_index)` → `66.12` |
| [H3_EXACT_EDGE_LENGTH_RADS](h3-exact-edge-length-rads.md) | 返回精确边长（弧度） | `H3_EXACT_EDGE_LENGTH_RADS(edge_index)` → `0.00001` |
| [H3_EDGE_ANGLE](h3-edge-angle.md) | 返回两条边之间的夹角（弧度） | `H3_EDGE_ANGLE(edge1, edge2)` → `1.047` |