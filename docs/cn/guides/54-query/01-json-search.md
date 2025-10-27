---
title: JSON 与搜索
---

> **场景：** CityDrive 会为每个抽取出来的帧附带一份 JSON 元数据,并希望直接在 Databend 内用 Elasticsearch 风格的过滤语法完成检索,而不用把数据复制到别的系统。

Databend 可以在同一仓库里托管多模态信号：VARIANT 列支持倒排索引,位图表刻画标签覆盖率,向量索引用于相似度查询,原生 GEOMETRY 列提供空间过滤。

## 1. 创建元数据表
每个帧保存一份 JSON,有了共同的结构,任意查询都可以复用。

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

> 需要同时管理多模态数据（向量嵌入、GPS 轨迹、标签位图）？可以直接复用 [向量](./02-vector-db.md) 与 [地理](./03-geo-analytics.md) 指南里的建表语句,再同 JSON 结果拼接。

## 2. 使用 `QUERY()` 的检索模式
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

### 权重（Boosting）
```sql
SELECT doc_id,
       SCORE() AS relevance
FROM frame_metadata_catalog
WHERE QUERY('meta_json.scene.weather_code:rain AND (meta_json.media_meta.tagging.labels:hard_brake^2 OR meta_json.media_meta.tagging.labels:swerve)')
ORDER BY relevance DESC
LIMIT 8;
```

`QUERY()` 遵循 Elasticsearch 的语义（布尔逻辑、范围、权重、列表等）,`SCORE()` 则暴露检索相关性,方便在 SQL 里直接排序。完整算子列表见：[搜索函数](/sql/sql-functions/search-functions)。
