---
title: 地理分析
---

> **场景：** CityDrive 会为每个被标记的帧记录精准的 GPS 定位以及与信号灯的距离,运营人员可以纯 SQL 回答“事故发生在什么位置？”之类的问题。

`frame_geo_points` 与 `signal_contact_points` 同样复用本指南里的 `video_id` / `frame_id`,因此可以在不复制数据的情况下把 SQL 指标延伸到地图视图。

## 1. 创建位置表
如果你已完成 JSON 指南,这些表应该已经存在。下方片段包含表结构以及几条深圳示例数据。

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

文档：[地理空间数据类型](/sql/sql-reference/data-types/geospatial)。

---

## 2. 空间过滤
可计算帧与市中心坐标的距离,或检查它是否落在多边形内部。需要以米为单位时,把坐标投影到 SRID 3857。

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

调试时可以输出 `ST_ASTEXT(l.position_wgs84)`,若偏好直接使用球面距离,可改用 [`HAVERSINE`](/sql/sql-functions/geospatial-functions#trigonometric-distance-functions)。

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

## 3. 六边形聚合
把风险帧聚合进 H3 单元,用于仪表盘或热力图。

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

## 4. 交通信号上下文
连接 `signal_contact_points` 与 `frame_geo_points`,即可验证存量指标或把空间条件与 JSON 搜索联动。

```sql
SELECT t.node_id,
       t.video_id,
       t.frame_id,
       ST_DISTANCE(t.signal_position, t.frame_position) AS recomputed_distance,
       t.distance_m AS stored_distance,
       l.source_system
FROM signal_contact_points AS t
JOIN frame_geo_points AS l USING (frame_id)
WHERE t.distance_m < 0.03  -- 不同投影下约等于 30 米
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

这类模式可以先按地理范围筛选,再对剩余帧执行 JSON 搜索。

---

## 5. 发布热力视图
把空间摘要封装成视图,供 BI 或 GIS 工具直接查询。

```sql
CREATE OR REPLACE VIEW v_citydrive_geo_heatmap AS
SELECT GEO_TO_H3(ST_X(position_wgs84), ST_Y(position_wgs84), 7) AS h3_cell,
       COUNT(*)                              AS frames,
       AVG(f.risk_score)                     AS avg_risk
FROM frame_geo_points AS l
JOIN frame_events AS f USING (frame_id)
GROUP BY h3_cell;
```

同一批 `video_id` 现在既能支撑向量、文本,也能支撑空间查询,调查团队不再需要维护额外的管道。
