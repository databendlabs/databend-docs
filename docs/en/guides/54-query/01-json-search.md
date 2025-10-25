---
title: JSON & Search
---

> **Scenario:** CityDrive attaches a metadata JSON payload to every extracted frame and needs Elasticsearch-style filtering on that JSON without copying it out of Databend.

Databend keeps these heterogeneous signals in one warehouse. Inverted indexes power Elasticsearch-style search on VARIANT columns, bitmap tables summarize label coverage, vector indexes answer similarity lookups, and native GEOMETRY columns support spatial filters.

## 1. Create the Metadata Table
Store one JSON payload per frame so every search runs against the same structure.

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

> Need multimodal data (vector embeddings, GPS trails, tag bitmaps)? Grab the schemas from the [Vector](./02-vector-db.md) and [Geo](./03-geo-analytics.md) guides so you can combine them with the search results shown here.

## 2. Search Patterns with `QUERY()`
### Array Match
```sql
SELECT doc_id,
       captured_at,
       meta_json['detections'] AS detections
FROM frame_metadata_catalog
WHERE QUERY('meta_json.detections.objects.type:pedestrian')
ORDER BY captured_at DESC
LIMIT 5;
```

### Boolean AND
```sql
SELECT doc_id, captured_at
FROM frame_metadata_catalog
WHERE QUERY('meta_json.scene.weather_code:rain
             AND meta_json.camera.sensor_view:roof')
ORDER BY captured_at;
```

### Boolean OR / List
```sql
SELECT doc_id,
       meta_json['media_meta']['tagging']['labels'] AS labels
FROM frame_metadata_catalog
WHERE QUERY('meta_json.media_meta.tagging.labels:(hard_brake OR swerve OR lane_merge)')
ORDER BY captured_at DESC
LIMIT 10;
```

### Numeric Ranges
```sql
SELECT doc_id,
       meta_json['vehicle']['speed_kmh']::DOUBLE AS speed
FROM frame_metadata_catalog
WHERE QUERY('meta_json.vehicle.speed_kmh:{30 TO 80}')
ORDER BY speed DESC
LIMIT 10;
```

### Boosting
```sql
SELECT doc_id,
       SCORE() AS relevance
FROM frame_metadata_catalog
WHERE QUERY('meta_json.scene.weather_code:rain AND (meta_json.media_meta.tagging.labels:hard_brake^2 OR meta_json.media_meta.tagging.labels:swerve)')
ORDER BY relevance DESC
LIMIT 8;
```

`QUERY()` follows Elasticsearch semantics (boolean logic, ranges, boosts, lists). `SCORE()` exposes the Elasticsearch relevance so you can re-rank results inside SQL. See [Search functions](/sql/sql-functions/search-functions) for the full operator list.
