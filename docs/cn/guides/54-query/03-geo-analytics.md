---
title: 地理空间分析
---

> **场景：** CityDrive 为每个被标记的帧记录精确的 GPS 定位与交通信号距离，运营团队仅凭 SQL 即可回答“事件发生在何处”。

`frame_geo_points` 与 `signal_contact_points` 沿用本指南统一的 `video_id`/`frame_id` 键，无需复制数据即可从 SQL 指标直接切换到地图。

## 1. 创建位置表
若已按 JSON 指南操作，这些表已存在。下方代码展示其结构及部分深圳示例数据。

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
  ('VID-20250101-001','FRAME-0101',TO_GEOMETRY('SRID=4326;POINT(114.0579 22.5431)'),104,'fusion_gnss','2025-01-01 08:15:21'),
  ('VID-20250101-001','FRAME-0102',TO_GEOMETRY('SRID=4326;POINT(114.0610 22.5460)'),104,'fusion_gnss','2025-01-01 08:33:54'),
  ('VID-20250101-002','FRAME-0201',TO_GEOMETRY('SRID=4326;POINT(114.1040 22.5594)'),104,'fusion_gnss','2025-01-01 11:12:02'),
  ('VID-20250102-001','FRAME-0301',TO_GEOMETRY('SRID=4326;POINT(114.0822 22.5368)'),104,'fusion_gnss','2025-01-02 09:44:18'),
  ('VID-20250103-001','FRAME-0401',TO_GEOMETRY('SRID=4326;POINT(114.1195 22.5443)'),104,'fusion_gnss','2025-01-03 21:18:07');

CREATE OR REPLACE TABLE signal_contact_points (
    node_id     STRING,
    signal_position GEOMETRY,
    video_id    STRING,
    frame_id    STRING,
    frame_position GEOMETRY,
    distance_m  DOUBLE,
    created_at  TIMESTAMP
);
```

文档：[地理空间类型](/sql/sql-reference/data-types/geospatial)。

---

## 2. 空间过滤
计算每帧与市中心关键坐标的距离，或判断其是否落在某多边形内；需要米级精度时转换至 SRID 3857。

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

提示：调试时可加 `ST_ASTEXT(l.geom)`，或改用 [`HAVERSINE`](/sql/sql-functions/geospatial-functions#trigonometric-distance-functions) 计算大圆距离。

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

---

## 3. Hex 聚合
将风险帧聚合到六边形网格，便于仪表盘展示。

```sql
SELECT GEO_TO_H3(ST_X(position_wgs84), ST_Y(position_wgs84), 8) AS h3_cell,
       COUNT(*) AS frame_count,
       AVG(f.risk_score) AS avg_risk
FROM frame_geo_points AS l
JOIN frame_events AS f USING (frame_id)
GROUP BY h3_cell
ORDER BY avg_risk DESC;
```

文档：[H3 函数](/sql/sql-functions/geospatial-functions#h3-indexing--conversion)。

---

## 4. 交通上下文
关联 `signal_contact_points` 与 `frame_geo_points` 以验证存储指标，或将空间谓词与 JSON 搜索结合使用。

```sql
SELECT t.node_id,
       t.video_id,
       t.frame_id,
       ST_DISTANCE(t.signal_position, t.frame_position) AS recomputed_distance,
       t.distance_m AS stored_distance,
       l.source_system
FROM signal_contact_points AS t
JOIN frame_geo_points AS l USING (frame_id)
WHERE t.distance_m < 0.03  -- 约 < 30 米，视 SRID 而定
ORDER BY t.distance_m;
```

```sql
WITH near_junction AS (
    SELECT frame_id
    FROM frame_geo_points
    WHERE ST_DISTANCE(
            ST_TRANSFORM(position_wgs84, 3857),
            ST_TRANSFORM(TO_GEOMETRY('SRID=4326;POINT(114.0700 22.5400)'), 3857)
          ) <= 150
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

该模式先按地理位置过滤，再对剩余帧执行 JSON 搜索。

---

## 5. 发布热力图视图
将地理热力图暴露给 BI 或 GIS 工具，无需重新执行繁重 SQL。

```sql
CREATE OR REPLACE VIEW v_citydrive_geo_heatmap AS
SELECT GEO_TO_H3(ST_X(position_wgs84), ST_Y(position_wgs84), 7) AS h3_cell,
       COUNT(*)                              AS frames,
       AVG(f.risk_score)                     AS avg_risk
FROM frame_geo_points AS l
JOIN frame_events AS f USING (frame_id)
GROUP BY h3_cell;
```

Databend 现可基于同一 `video_id` 同时提供向量、文本与空间查询，调查团队无需再协调多条流水线。