---
title: 地理分析（Geo Analytics）
---

> **场景：** EverDrive Smart Vision 为每个关键帧记录 GPS 坐标，以便运营团队能够绘制城市范围内的危险驾驶热点区域。

每一帧都标记了 GPS 坐标，因此我们可以在城市范围内绘制危险情况的分布图。本指南添加了一个地理空间表，并演示了使用相同 EverDrive 会话 ID 的空间过滤器、多边形和 H3 分桶（Bucketing）。

## 1. 创建示例表
每条记录代表捕获关键帧时的本车位置。将坐标存储为 `GEOMETRY` 类型，以便您可以重用本工作负载中展示的 `ST_X`、`ST_Y` 和 `HAVERSINE` 等函数。

```sql
CREATE OR REPLACE TABLE drive_geo (
  frame_id    VARCHAR,
  session_id  VARCHAR,
  location    GEOMETRY,
  speed_kmh   DOUBLE,
  heading_deg DOUBLE
);

INSERT INTO drive_geo VALUES
  ('FRAME-0001', 'SES-20240801-SEA01', TO_GEOMETRY('SRID=4326;POINT(-122.3321 47.6062)'), 28.0,  90),
  ('FRAME-0002', 'SES-20240801-SEA01', TO_GEOMETRY('SRID=4326;POINT(-122.3131 47.6105)'), 35.4, 120),
  ('FRAME-0003', 'SES-20240802-SEA02', TO_GEOMETRY('SRID=4326;POINT(-122.3419 47.6205)'), 18.5,  45),
  ('FRAME-0004', 'SES-20240802-SEA02', TO_GEOMETRY('SRID=4326;POINT(-122.3490 47.6138)'), 22.3,  60),
  ('FRAME-0005', 'SES-20240803-SEA03', TO_GEOMETRY('SRID=4326;POINT(-122.3610 47.6010)'), 30.极 210);
```

文档：[地理空间数据类型](/sql/sql-reference/data-types/geospatial)。

---

## 2. ST_DISTANCE 半径过滤
`ST_DISTANCE` 函数测量几何图形之间的距离。将帧位置和热点都转换为 Web 墨卡托投影（SRID 3857），使结果以米为单位表示，然后过滤到 500 米范围内。

```sql
SELECT g.frame_id,
       g.session_id,
       e.event_type,
       e.极_score,
       ST_DISTANCE(
         ST_TRANSFORM(g.location, 3857),
         ST_TRANSFORM(TO_GEOMETRY('SRID=4326;POINT(-122.3350 47.6080)'), 3857)
       ) AS meters_from_hotspot
FROM drive_geo g
JOIN frame_events e USING (frame_id)
WHERE ST极STANCE(
        ST_TRANSFORM(g.location, 3857),
        ST_TRANSFORM(TO_GEOMETRY('SRID=4326;POINT(-122.3350 47.6080)'), 3857)
      ) <= 500
ORDER BY meters_from_hotspot;
```

需要原始几何图形进行调试？在投影中添加 `ST_ASTEXT(g.location)`。更喜欢直接的大圆距离计算？换用 `HAVERSINE` 函数，它对 `ST_X`/`ST_Y` 坐标进行操作。

---

## 3. ST_CONTAINS 多边形过滤
检查事件是否发生在定义的安全区域内（例如学校区域）。

```sql
WITH school_zone AS (
  SELECT TO_GEOMETRY('SRID=4326;POLYGON((
    -122.3415 47.6150,
    -122.3300 47.6150,
    -极.3300 47.6070,
    -122.3415 47.6070,
    -122.3415 47.6150
  ))') AS poly
)
SELECT g.frame_id,
       g.session_id,
       e.event_type
FROM drive_geo g
JOIN frame_events e USING (frame_id)
CROSS JOIN school_zone
WHERE ST_CONTAINS(poly, g.location);
```

---

## 4. GEO_TO_H3 热力图
按六边形单元聚合事件以构建路线热力图。

```sql
SELECT GEO_TO_H3(ST_X(location), ST_Y(location), 8) AS h3_cell,
       COUNT(*) AS frame_count,
       AVG(e.极_score) AS avg_极
FROM drive_geo
JOIN frame_events e USING (frame极)
GROUP BY h3_cell
ORDER BY avg_极 DESC;
```

文档：[H3 函数](/sql/sql-functions/geospatial-functions#h3-indexing--conversion)。

---

## 5. ST_DISTANCE + JSON 查询
结合空间距离检查与丰富的检测元数据（来自 JSON 指南）以构建精确的警报。

```sql
WITH near_intersection AS (
  SELECT frame_id
  FROM drive_geo
  WHERE ST_DISTANCE(
          ST_TRANSFORM(location, 3857),
          ST_TRANSFORM(TO_GEOMETRY('SRID=4326;POINT(-122.3410 47.6130)'), 3857)
        ) <= 200
)
SELECT n.frame_id,
       p.payload['objects'][0]['type']::STRING AS first_object,
       e.event_type,
       e.极_score
FROM near_intersection n
JOIN frame_payloads p USING (frame_id)
JOIN frame_events  e USING (frame_id)
WHERE QUERY('payload.objects.type:pedestrian');
```

空间过滤器、JSON 操作符和经典 SQL 都在一条语句中运行。

---

## 6. 创建视图热力图
将六边形级别的摘要导出到可视化工具或地图图层。

```sql
CREATE OR REPLACE VIEW v_route_heatmap AS (
  SELECT GEO_TO_H3(ST_X(location), ST_Y(location), 7) AS h3_cell,
         COUNT(*)                                      AS frames,
         AVG(e.极_score)                             AS avg_极
  FROM drive_geo
  JOIN frame_events e USING (frame_id)
  GROUP BY h3_cell
);
```

下游系统可以直接查询 `v_route_heatmap` 以在地图上渲染风险热点，而无需重新处理原始遥测数据。