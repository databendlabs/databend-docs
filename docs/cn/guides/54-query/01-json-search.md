---
title: JSON 与搜索
---

> **场景：** CityDrive 会为每个提取的视频帧关联一份 JSON 元数据。我们需要直接在 Databend 中使用类似 Elasticsearch 的语法对这些 JSON 进行检索，避免将数据复制到外部系统。

Databend 将这些多模态信号统一存储在一个数仓中。通过倒排索引，我们可以在 VARIANT 列上实现 ES 风格的搜索；利用位图索引（Bitmap）加速标签筛选；使用向量索引处理相似度查询；同时借助原生的 GEOMETRY 列支持地理空间过滤。

## 1. 创建元数据表
为每一帧存储一份 JSON 数据，确保所有查询都基于统一的结构进行。

```sql
CREATE DATABASE IF NOT EXISTS video_unified_demo;
USE video_unified_demo;

CREATE OR REPLACE TABLE frame_metadata_catalog (
    doc_id      STRING,
    meta_json   VARIANT,
    captured_at TIMESTAMP,
    INVERTED INDEX idx_meta_json (meta_json)
);

-- 下方查询示例用到的样本行。
INSERT INTO frame_metadata_catalog VALUES
  ('FRAME-0101', PARSE_JSON('{"scene":{"weather_code":"rain","lighting":"day"},"camera":{"sensor_view":"roof"},"vehicle":{"speed_kmh":32.4},"detections":{"objects":[{"type":"vehicle","confidence":0.88},{"type":"brake_light","confidence":0.64}]},"media_meta":{"tagging":{"labels":["hard_brake","rain","downtown_loop"]}}}'), '2025-01-01 08:15:21'),
  ('FRAME-0102', PARSE_JSON('{"scene":{"weather_code":"rain","lighting":"day"},"camera":{"sensor_view":"roof"},"vehicle":{"speed_kmh":24.8},"detections":{"objects":[{"type":"pedestrian","confidence":0.92},{"type":"bike","confidence":0.35}]},"media_meta":{"tagging":{"labels":["pedestrian","swerve","crosswalk"]}}}'), '2025-01-01 08:33:54'),
  ('FRAME-0201', PARSE_JSON('{"scene":{"weather_code":"overcast","lighting":"day"},"camera":{"sensor_view":"front"},"vehicle":{"speed_kmh":48.1},"detections":{"objects":[{"type":"lane_merge","confidence":0.74},{"type":"vehicle","confidence":0.41}]},"media_meta":{"tagging":{"labels":["lane_merge","urban"]}}}'), '2025-01-01 11:12:02'),
  ('FRAME-0301', PARSE_JSON('{"scene":{"weather_code":"clear","lighting":"day"},"camera":{"sensor_view":"front"},"vehicle":{"speed_kmh":52.6},"detections":{"objects":[{"type":"vehicle","confidence":0.82},{"type":"hard_brake","confidence":0.59}]},"media_meta":{"tagging":{"labels":["hard_brake","highway"]}}}'), '2025-01-02 09:44:18'),
  ('FRAME-0401', PARSE_JSON('{"scene":{"weather_code":"lightfog","lighting":"night"},"camera":{"sensor_view":"rear"},"vehicle":{"speed_kmh":38.9},"detections":{"objects":[{"type":"traffic_light","confidence":0.78},{"type":"vehicle","confidence":0.36}]},"media_meta":{"tagging":{"labels":["night_lowlight","traffic_light"]}}}'), '2025-01-03 21:18:07');
```

> 需要多模态数据（如向量嵌入、GPS 轨迹、标签位图）？可以参考 [向量](./02-vector-db.md) 和 [地理](./03-geo-analytics.md) 指南中的表结构，将它们与这里的搜索结果关联起来。

## 2. 使用 `QUERY()` 进行检索
### 数组匹配
```sql
SELECT doc_id,
       captured_at,
       meta_json['detections'] AS detections
FROM frame_metadata_catalog
WHERE QUERY('meta_json.detections.objects.type:pedestrian')
ORDER BY captured_at DESC
LIMIT 5;
```

示例输出：

```
doc_id     | captured_at          | detections
FRAME-0102 | 2025-01-01 08:33:54 | {"objects":[{"confidence":0.92,"type":"pedestrian"},{"confidence":0.35,"type":"bike"}]}
```

### 布尔与 (AND)
```sql
SELECT doc_id, captured_at
FROM frame_metadata_catalog
WHERE QUERY('meta_json.scene.weather_code:rain
             AND meta_json.camera.sensor_view:roof')
ORDER BY captured_at;
```

示例输出：

```
doc_id     | captured_at
FRAME-0101 | 2025-01-01 08:15:21
FRAME-0102 | 2025-01-01 08:33:54
```

### 布尔或 (OR) / 列表匹配
```sql
SELECT doc_id,
       meta_json['media_meta']['tagging']['labels'] AS labels
FROM frame_metadata_catalog
WHERE QUERY('meta_json.media_meta.tagging.labels:(hard_brake OR swerve OR lane_merge)')
ORDER BY captured_at DESC
LIMIT 10;
```

示例输出：

```
doc_id     | labels
FRAME-0301 | ["hard_brake","highway"]
FRAME-0201 | ["lane_merge","urban"]
FRAME-0102 | ["pedestrian","swerve","crosswalk"]
FRAME-0101 | ["hard_brake","rain","downtown_loop"]
```

### 数值范围
```sql
SELECT doc_id,
       meta_json['vehicle']['speed_kmh']::DOUBLE AS speed
FROM frame_metadata_catalog
WHERE QUERY('meta_json.vehicle.speed_kmh:{30 TO 80}')
ORDER BY speed DESC
LIMIT 10;
```

示例输出：

```
doc_id     | speed
FRAME-0301 | 52.6
FRAME-0201 | 48.1
FRAME-0401 | 38.9
FRAME-0101 | 32.4
```

### 权重提升 (Boosting)
```sql
SELECT doc_id,
       SCORE() AS relevance
FROM frame_metadata_catalog
WHERE QUERY('meta_json.scene.weather_code:rain AND (meta_json.media_meta.tagging.labels:hard_brake^2 OR meta_json.media_meta.tagging.labels:swerve)')
ORDER BY relevance DESC
LIMIT 8;
```

示例输出：

```
doc_id     | relevance
FRAME-0101 | 7.0161
FRAME-0102 | 3.6252
```

`QUERY()` 支持 Elasticsearch 的语义（包括布尔逻辑、范围查询、权重提升、列表匹配等）。`SCORE()` 函数则返回相关性评分，方便直接在 SQL 中对结果进行重排序。完整的算子列表请参考：[搜索函数](/sql/sql-functions/search-functions)。
