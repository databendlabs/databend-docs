---
title: H3 函数
---

本节提供 Databend 中 H3 函数的参考信息。H3 是一种地理空间索引系统，通过将地球划分为六边形单元，支持高效的空间分析与操作。

## 坐标转换

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [GEO_TO_H3](geo-to-h3) | 将经纬度转换为 H3 索引 | `GEO_TO_H3(37.7950, 55.7129, 15)` → `644325524701193974` |
| [H3_TO_GEO](h3-to-geo) | 将 H3 索引转换为经纬度 | `H3_TO_GEO(644325524701193974)` → `[37.7950, 55.7129]` |
| [H3_TO_STRING](h3-to-string) | 将 H3 索引转换为字符串表示 | `H3_TO_STRING(644325524701193974)` → `'8f2830828052d25'` |
| [STRING_TO_H3](string-to-h3) | 将字符串表示转换为 H3 索引 | `STRING_TO_H3('8f2830828052d25')` → `644325524701193974` |
| [GEOHASH_ENCODE](geohash-encode) | 将经纬度编码为 geohash 字符串 | `GEOHASH_ENCODE(37.7950, 55.7129, 12)` → `'ucfv0nzpt3s7'` |
| [GEOHASH_DECODE](geohash-decode) | 将 geohash 字符串解码为经纬度 | `GEOHASH_DECODE('ucfv0nzpt3s7')` → `[37.7950, 55.7129]` |

## 六边形属性

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [H3_GET_RESOLUTION](h3-get-resolution) | 返回 H3 索引的分辨率 | `H3_GET_RESOLUTION(644325524701193974)` → `15` |
| [H3_GET_BASE_CELL](h3-get-base-cell) | 返回 H3 索引的基础单元编号 | `H3_GET_BASE_CELL(644325524701193974)` → `14` |
| [H3_IS_VALID](h3-is-valid) | 检查 H3 索引是否有效 | `H3_IS_VALID(644325524701193974)` → `TRUE` |
| [H3_IS_PENTAGON](h3-is-pentagon) | 检查 H3 索引是否为五边形 | `H3_IS_PENTAGON(644325524701193974)` → `FALSE` |
| [H3_IS_RES_CLASS_III](h3-is-res-class-iii) | 检查 H3 索引是否属于 III 类分辨率 | `H3_IS_RES_CLASS_III(644325524701193974)` → `FALSE` |
| [H3_GET_FACES](h3-get-faces) | 返回 H3 单元相交的二十面体面 | `H3_GET_FACES(644325524701193974)` → `[7]` |
| [H3_TO_PARENT](h3-to-parent) | 返回指定分辨率下 H3 索引的父级索引 | `H3_TO_PARENT(644325524701193974, 10)` → `622236721289822207` |
| [H3_TO_CHILDREN](h3-to-children) | 返回指定分辨率下 H3 索引的子级索引 | `H3_TO_CHILDREN(622236721289822207, 11)` → `[...]` |
| [H3_TO_CENTER_CHILD](h3-to-center-child) | 返回指定分辨率下 H3 索引的中心子级索引 | `H3_TO_CENTER_CHILD(622236721289822207, 11)` → `625561602857582591` |

## 面积与边界

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [H3_CELL_AREA_M2](h3-cell-area-m2) | 返回 H3 单元面积（平方米） | `H3_CELL_AREA_M2(644325524701193974)` → `0.8953` |
| [H3_CELL_AREA_RADS2](h3-cell-area-rads2) | 返回 H3 单元面积（平方弧度） | `H3_CELL_AREA_RADS2(644325524701193974)` → `2.2e-14` |
| [H3_HEX_AREA_KM2](h3-hex-area-km2) | 返回指定分辨率的六边形平均面积（平方公里） | `H3_HEX_AREA_KM2(10)` → `0.0152` |
| [H3_HEX_AREA_M2](h3-hex-area-m2) | 返回指定分辨率的六边形平均面积（平方米） | `H3_HEX_AREA_M2(10)` → `15200` |
| [H3_TO_GEO_BOUNDARY](h3-to-geo-boundary) | 返回 H3 单元的边界坐标数组 | `H3_TO_GEO_BOUNDARY(644325524701193974)` → `[[lon1,lat1], [lon2,lat2], ...]` |
| [H3_NUM_HEXAGONS](h3-num-hexagons) | 返回指定分辨率的六边形数量 | `H3_NUM_HEXAGONS(2)` → `5882` |

## 六边形关系

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [H3_DISTANCE](h3-distance) | 返回两个 H3 索引的网格距离 | `H3_DISTANCE(599119489002373119, 599119491149856767)` → `1` |
| [H3_INDEXES_ARE_NEIGHBORS](h3-indexes-are-neighbors) | 检查两个 H3 索引是否相邻 | `H3_INDEXES_ARE_NEIGHBORS(599119489002373119, 599119491149856767)` → `TRUE` |
| [H3_K_RING](h3-k-ring) | 返回原点 k 阶邻域内的所有 H3 索引 | `H3_K_RING(599119489002373119, 1)` → `[599119489002373119, 599119491149856767, ...]` |
| [H3_HEX_RING](h3-hex-ring) | 返回距离原点精确 k 阶的所有 H3 索引 | `H3_HEX_RING(599119489002373119, 1)` → `[599119491149856767, ...]` |

## 边函数

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [H3_GET_UNIDIRECTIONAL_EDGE](h3-get-unidirectional-edge) | 返回相邻 H3 索引间的单向边索引 | `H3_GET_UNIDIRECTIONAL_EDGE(from_h3, to_h3)` → `edge_index` |
| [H3_UNIDIRECTIONAL_EDGE_IS_VALID](h3-unidirectional-edge-is-valid) | 检查 H3 边索引是否有效 | `H3_UNIDIRECTIONAL_EDGE_IS_VALID(edge_index)` → `TRUE` |
| [H3_GET_ORIGIN_INDEX_FROM_UNIDIRECTIONAL_EDGE](h3-get-origin-index-from-unidirectional-edge) | 从边索引获取起点 H3 索引 | `H3_GET_ORIGIN_INDEX_FROM_UNIDIRECTIONAL_EDGE(edge_index)` → `from_h3` |
| [H3_GET_DESTINATION_INDEX_FROM_UNIDIRECTIONAL_EDGE](h3-get-destination-index-from-unidirectional-edge) | 从边索引获取终点 H3 索引 | `H3_GET_DESTINATION_INDEX_FROM_UNIDIRECTIONAL_EDGE(edge_index)` → `to_h3` |
| [H3_GET_INDEXES_FROM_UNIDIRECTIONAL_EDGE](h3-get-indexes-from-unidirectional-edge) | 从边索引获取起点与终点 H3 索引 | `H3_GET_INDEXES_FROM_UNIDIRECTIONAL_EDGE(edge_index)` → `[from_h3, to_h3]` |
| [H3_GET_UNIDIRECTIONAL_EDGES_FROM_HEXAGON](h3-get-unidirectional-edges-from-hexagon) | 返回 H3 索引发出的所有单向边 | `H3_GET_UNIDIRECTIONAL_EDGES_FROM_HEXAGON(h3_index)` → `[edge1, edge2, ...]` |
| [H3_GET_UNIDIRECTIONAL_EDGE_BOUNDARY](h3-get-unidirectional-edge-boundary) | 返回 H3 边的边界坐标 | `H3_GET_UNIDIRECTIONAL_EDGE_BOUNDARY(edge_index)` → `[[lon1,lat1], [lon2,lat2]]` |

## 测量

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [H3_EDGE_LENGTH_KM](h3-edge-length-km) | 返回指定分辨率的平均边长（千米） | `H3_EDGE_LENGTH_KM(10)` → `0.065` |
| [H3_EDGE_LENGTH_M](h3-edge-length-m) | 返回指定分辨率的平均边长（米） | `H3_EDGE_LENGTH_M(10)` → `65.91` |
| [H3_EXACT_EDGE_LENGTH_KM](h3-exact-edge-length-km) | 返回精确边长（千米） | `H3_EXACT_EDGE_LENGTH_KM(edge_index)` → `0.066` |
| [H3_EXACT_EDGE_LENGTH_M](h3-exact-edge-length-m) | 返回精确边长（米） | `H3_EXACT_EDGE_LENGTH_M(edge_index)` → `66.12` |
| [H3_EXACT_EDGE_LENGTH_RADS](h3-exact-edge-length-rads) | 返回精确边长（弧度） | `H3_EXACT_EDGE_LENGTH_RADS(edge_index)` → `0.00001` |
| [H3_EDGE_ANGLE](h3-edge-angle) | 返回两条边的夹角（弧度） | `H3_EDGE_ANGLE(edge1, edge2)` → `1.047` |

## 通用工具

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [POINT_IN_POLYGON](point-in-polygon) | 检查点是否在多边形内 | `POINT_IN_POLYGON([lon, lat], [[p1_lon, p1_lat], [p2_lon, p2_lat], ...])` → `TRUE` |
| [H3_LINE](h3-line) | 返回两个 H3 索引间连线路径的索引 | `H3_LINE(from_h3, to_h3)` → `[from_h3, ..., to_h3]` |