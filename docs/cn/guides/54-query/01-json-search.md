---
title: JSON 与搜索（Search）
---

> **场景：** CityDrive 为每个提取的帧附加一个元数据 JSON 负载，并需要在 Databend 内部对该 JSON 进行 Elasticsearch 风格的过滤，而无需将其复制出去。

Databend 将这些异构信号保存在同一数据仓库（Data Warehouse）中。倒排索引（Inverted Index）为 VARIANT 列提供 Elasticsearch 风格的搜索，位图表（Bitmap Table）汇总标签覆盖情况，向量索引（Vector Index）支持相似性查询，原生 GEOMETRY 列支持空间过滤。

## 1. 创建元数据表
为每帧存储一个 JSON 负载，使每次搜索都针对相同结构执行。

```sql
CREATE DATABASE IF NOT EXISTS video_unified_demo;
USE video_unified_demo;

CREATE OR REPLACE TABLE frame_metadata_catalog (
    doc_id      STRING,
    meta_json   VARIANT,
    captured_at TIMESTAMP,
    INVERTED INDEX idx_meta_json (meta_json)
) CLUSTER BY (captured_at);
```

> 需要多模态数据（向量嵌入、GPS 轨迹、标签位图）？从 [向量（Vector）](./02-vector-db.md) 和 [地理空间（Geo）](./03-geo-analytics.md) 指南中获取 schema，即可与本文展示的搜索结果结合使用。

## 2. 使用 `QUERY()` 的搜索模式
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

### 布尔 AND
```sql
SELECT doc_id, captured_at
FROM frame_metadata_catalog
WHERE QUERY('meta_json.scene.weather_code:rain
             AND meta_json.camera.sensor_view:roof')
ORDER BY captured_at;
```

### 布尔 OR / 列表
```sql
SELECT doc_id,
       meta_json['media_meta']['tagging']['labels'] AS labels
FROM frame_metadata_catalog
WHERE QUERY('meta_json.media_meta.tagging.labels:(hard_brake OR swerve OR lane_merge)')
ORDER BY captured_at DESC
LIMIT 10;
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

### 权重提升（Boosting）
```sql
SELECT doc_id,
       SCORE() AS relevance
FROM frame_metadata_catalog
WHERE QUERY('meta_json.scene.weather_code:rain AND (meta_json.media_meta.tagging.labels:hard_brake^2 OR meta_json.media_meta.tagging.labels:swerve)')
ORDER BY relevance DESC
LIMIT 8;
```

`QUERY()` 遵循 Elasticsearch 语义（布尔逻辑、范围、权重提升、列表）。`SCORE()` 暴露 Elasticsearch 的相关性，可在 SQL 内对结果重新排序。完整运算符列表见 [搜索函数](/sql/sql-functions/search-functions)。