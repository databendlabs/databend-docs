---
title: 地理分析
---

> **场景：** CityDrive 为每个标记帧记录了精确的 GPS 定位以及与交通信号灯的距离。运营团队可以完全通过 SQL 来回答“事件发生在哪里？”这类问题。

`frame_geo_points` 和 `signal_contact_points` 表与本指南其他部分一样，共用 `video_id`/`frame_id` 键。这意味着您无需复制数据，即可将分析视角从 SQL 指标切换到地图视图。

## 1. 创建位置表
如果您已经完成了 JSON 指南的操作，这些表可能已经存在。下方的代码展示了表结构以及几条深圳地区的示例数据。

```sql
CREATE OR REPLACE TABLE frame_geo_points (
    video_id   STRING,
    frame_id   STRING,
    position_wgs84 GEOMETRY,
    solution_grade INT,
    source_system STRING,
    created_at TIMESTAMP
);

INSERT INTO frame_geo_points VALUES
  ('VID-20250101-001','FRAME-0101',TO_GEOMETRY('SRID=4326;POINT(114.0579123456789 22.543123456789)'),104,'fusion_gnss','2025-01-01 08:15:21'),
  ('VID-20250101-001','FRAME-0102',TO_GEOMETRY('SRID=4326;POINT(114.0610987654321 22.546098765432)'),104,'fusion_gnss','2025-01-01 08:33:54'),
  ('VID-20250101-002','FRAME-0201',TO_GEOMETRY('SRID=4326;POINT(114.104012345678 22.559456789012)'),104,'fusion_gnss','2025-01-01 11:12:02'),
  ('VID-20250102-001','FRAME-0301',TO_GEOMETRY('SRID=4326;POINT(114.082265432109 22.53687654321)'),104,'fusion_gnss','2025-01-02 09:44:18'),
  ('VID-20250103-001','FRAME-0401',TO_GEOMETRY('SRID=4326;POINT(114.119501234567 22.544365432101)'),104,'fusion_gnss','2025-01-03 21:18:07');

CREATE OR REPLACE TABLE signal_contact_points (
    node_id     STRING,
    signal_position GEOMETRY,
    video_id    STRING,
    frame_id    STRING,
    frame_position GEOMETRY,
    distance_m  DOUBLE,
    created_at  TIMESTAMP
);

INSERT INTO signal_contact_points VALUES
  ('SIG-0001', TO_GEOMETRY('SRID=4326;POINT(114.058500123456 22.543800654321)'), 'VID-20250101-001', 'FRAME-0101', TO_GEOMETRY('SRID=4326;POINT(114.0579123456789 22.543123456789)'), 0.012345, '2025-01-01 08:15:30'),
  ('SIG-0002', TO_GEOMETRY('SRID=4326;POINT(114.118900987654 22.544800123456)'), 'VID-20250103-001', 'FRAME-0401', TO_GEOMETRY('SRID=4326;POINT(114.119501234567 22.544365432101)'), 0.008765, '2025-01-03 21:18:20');

-- 下方查询会连接到的帧事件与 JSON 表（与 SQL/搜索指南里一致）。
CREATE OR REPLACE TABLE frame_events (
    frame_id     STRING,
    video_id     STRING,
    frame_index  INT,
    collected_at TIMESTAMP,
    event_tag    STRING,
    risk_score   DOUBLE,
    speed_kmh    DOUBLE
);

INSERT INTO frame_events VALUES
  ('FRAME-0101', 'VID-20250101-001', 125, '2025-01-01 08:15:21', 'hard_brake',      0.81, 32.4),
  ('FRAME-0102', 'VID-20250101-001', 416, '2025-01-01 08:33:54', 'pedestrian',      0.67, 24.8),
  ('FRAME-0201', 'VID-20250101-002', 298, '2025-01-01 11:12:02', 'lane_merge',      0.74, 48.1),
  ('FRAME-0301', 'VID-20250102-001', 188, '2025-01-02 09:44:18', 'hard_brake',      0.59, 52.6),
  ('FRAME-0401', 'VID-20250103-001', 522, '2025-01-03 21:18:07', 'night_lowlight',  0.63, 38.9),
  ('FRAME-0501', 'VID-MISSING-001', 10, '2025-01-04 10:00:00', 'sensor_fault',     0.25, 15.0);

CREATE OR REPLACE TABLE frame_metadata_catalog (
    doc_id      STRING,
    meta_json   VARIANT,
    captured_at TIMESTAMP,
    INVERTED INDEX idx_meta_json (meta_json)
);

INSERT INTO frame_metadata_catalog VALUES
  ('FRAME-0101', PARSE_JSON('{"scene":{"weather_code":"rain","lighting":"day"},"camera":{"sensor_view":"roof"},"vehicle":{"speed_kmh":32.4},"detections":{"objects":[{"type":"vehicle","confidence":0.88},{"type":"brake_light","confidence":0.64}]},"media_meta":{"tagging":{"labels":["hard_brake","rain","downtown_loop"]}}}'), '2025-01-01 08:15:21'),
  ('FRAME-0102', PARSE_JSON('{"scene":{"weather_code":"rain","lighting":"day"},"camera":{"sensor_view":"roof"},"vehicle":{"speed_kmh":24.8},"detections":{"objects":[{"type":"pedestrian","confidence":0.92},{"type":"bike","confidence":0.35}]},"media_meta":{"tagging":{"labels":["pedestrian","swerve","crosswalk"]}}}'), '2025-01-01 08:33:54'),
  ('FRAME-0201', PARSE_JSON('{"scene":{"weather_code":"overcast","lighting":"day"},"camera":{"sensor_view":"front"},"vehicle":{"speed_kmh":48.1},"detections":{"objects":[{"type":"lane_merge","confidence":0.74},{"type":"vehicle","confidence":0.41}]},"media_meta":{"tagging":{"labels":["lane_merge","urban"]}}}'), '2025-01-01 11:12:02'),
  ('FRAME-0301', PARSE_JSON('{"scene":{"weather_code":"clear","lighting":"day"},"camera":{"sensor_view":"front"},"vehicle":{"speed_kmh":52.6},"detections":{"objects":[{"type":"vehicle","confidence":0.82},{"type":"hard_brake","confidence":0.59}]},"media_meta":{"tagging":{"labels":["hard_brake","highway"]}}}'), '2025-01-02 09:44:18'),
  ('FRAME-0401', PARSE_JSON('{"scene":{"weather_code":"lightfog","lighting":"night"},"camera":{"sensor_view":"rear"},"vehicle":{"speed_kmh":38.9},"detections":{"objects":[{"type":"traffic_light","confidence":0.78},{"type":"vehicle","confidence":0.36}]},"media_meta":{"tagging":{"labels":["night_lowlight","traffic_light"]}}}'), '2025-01-03 21:18:07');
```

文档：[地理空间数据类型](/sql/sql-reference/data-types/geospatial)。

---

## 2. 空间过滤
计算每一帧与市中心关键坐标的距离，或者检查它是否落在某个多边形区域内。当需要以米为单位计算距离时，请将坐标转换为 SRID 3857 投影。

```sql
SELECT l.frame_id,
       l.video_id,
       f.event_tag,
       ST_DISTANCE(
         ST_TRANSFORM(l.position_wgs84, 3857),
         ST_TRANSFORM(TO_GEOMETRY('SRID=4326;POINT(114.0600 22.5450)'), 3857)
       ) AS meters_from_hq
FROM frame_geo_points AS l
JOIN frame_events AS f USING (frame_id)
WHERE ST_DISTANCE(
        ST_TRANSFORM(l.position_wgs84, 3857),
        ST_TRANSFORM(TO_GEOMETRY('SRID=4326;POINT(114.0600 22.5450)'), 3857)
      ) <= 400
ORDER BY meters_from_hq;
```

示例输出：

```
frame_id  | video_id         | event_tag  | meters_from_hq
FRAME-0102| VID-20250101-001 | pedestrian | 180.277138577
FRAME-0101| VID-20250101-001 | hard_brake | 324.291965923
```

提示：调试时可以使用 `ST_ASTEXT(l.geom)` 查看几何文本；如果更偏好大圆距离计算，可以使用 [`HAVERSINE`](/sql/sql-functions/geospatial-functions#trigonometric-distance-functions)。

```sql
WITH school_zone AS (
    SELECT TO_GEOMETRY('SRID=4326;POLYGON((
        114.0505 22.5500,
        114.0630 22.5500,
        114.0630 22.5420,
        114.0505 22.5420,
        114.0505 22.5500
    ))') AS poly
)
SELECT l.frame_id,
       l.video_id,
       f.event_tag
FROM frame_geo_points AS l
JOIN frame_events AS f USING (frame_id)
CROSS JOIN school_zone
WHERE ST_CONTAINS(poly, l.position_wgs84);
```

示例输出：

```
frame_id  | video_id         | event_tag
FRAME-0101| VID-20250101-001 | hard_brake
FRAME-0102| VID-20250101-001 | pedestrian
```

---

## 3. 六边形网格聚合
将风险帧聚合到六边形网格（H3）中，以便在仪表盘上进行展示。

```sql
SELECT GEO_TO_H3(ST_X(position_wgs84), ST_Y(position_wgs84), 8) AS h3_cell,
       COUNT(*) AS frame_count,
       AVG(f.risk_score) AS avg_risk
FROM frame_geo_points AS l
JOIN frame_events AS f USING (frame_id)
GROUP BY h3_cell
ORDER BY avg_risk DESC;
```

示例输出：

```
h3_cell         | frame_count | avg_risk
613635011200942079| 1          | 0.81
613635011532292095| 1          | 0.74
613635011238690815| 1          | 0.67
613635015391051775| 1          | 0.63
613635011309993983| 1          | 0.59
```

文档：[H3 函数](/sql/sql-functions/geospatial-functions#h3-indexing--conversion)。

---

## 4. 交通环境上下文
将 `signal_contact_points` 与 `frame_geo_points` 进行连接，以验证存储的指标，或者将空间查询条件与 JSON 搜索相结合。

```sql
SELECT t.node_id,
       t.video_id,
       t.frame_id,
       ST_DISTANCE(t.signal_position, t.frame_position) AS recomputed_distance,
       t.distance_m AS stored_distance,
       l.source_system
FROM signal_contact_points AS t
JOIN frame_geo_points AS l USING (frame_id)
WHERE t.distance_m < 0.03  -- 约小于 30 米，具体取决于 SRID
ORDER BY t.distance_m;
```

示例输出：

```
node_id | video_id         | frame_id  | recomputed_distance | stored_distance | source_system
SIG-0002| VID-20250103-001 | FRAME-0401| 0.000741116         | 0.008765        | fusion_gnss
SIG-0001| VID-20250101-001 | FRAME-0101| 0.000896705         | 0.012345        | fusion_gnss
```

```sql
WITH near_junction AS (
    SELECT frame_id
    FROM frame_geo_points
    WHERE ST_DISTANCE(
            ST_TRANSFORM(position_wgs84, 3857),
            ST_TRANSFORM(TO_GEOMETRY('SRID=4326;POINT(114.0830 22.5370)'), 3857)
          ) <= 200
)
SELECT f.frame_id,
       f.event_tag,
       meta.meta_json['media_meta']['tagging']['labels'] AS labels
FROM near_junction nj
JOIN frame_events AS f USING (frame_id)
JOIN frame_metadata_catalog AS meta
  ON meta.doc_id = nj.frame_id
WHERE QUERY('meta_json.media_meta.tagging.labels:hard_brake');
```

示例输出：

```
frame_id  | event_tag   | labels
FRAME-0301| hard_brake  | ["hard_brake","highway"]
```

这种模式允许您先通过地理范围进行过滤，然后再对筛选出的帧应用 JSON 搜索。

---

## 5. 发布热力图视图
将地理热力图封装为视图，供 BI 或 GIS 工具直接查询，避免重复运行繁重的 SQL 计算。

```sql
CREATE OR REPLACE VIEW v_citydrive_geo_heatmap AS
SELECT GEO_TO_H3(ST_X(position_wgs84), ST_Y(position_wgs84), 7) AS h3_cell,
       COUNT(*)                              AS frames,
       AVG(f.risk_score)                     AS avg_risk
FROM frame_geo_points AS l
JOIN frame_events AS f USING (frame_id)
GROUP BY h3_cell;
```

示例输出：

```
h3_cell         | frames | avg_risk
609131411584057343| 1    | 0.81
609131411919601663| 1    | 0.74
609131411617611775| 1    | 0.67
609131415778361343| 1    | 0.63
609131411684720639| 1    | 0.59
```

现在，Databend 可以基于完全相同的 `video_id` 同时提供向量、文本和空间查询服务，调查团队再也不需要费力地协调多个独立的数据管道了。
