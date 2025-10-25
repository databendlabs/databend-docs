---
title: SQL Analytics
---

> **Scenario:** CityDrive stages every dash-cam run into shared relational tables so analysts can filter, join, and aggregate the same `video_id` / `frame_id` pairs for all downstream workloads.

This walkthrough models the relational side of that catalog and highlights practical SQL building blocks. The sample IDs here appear again in the JSON, vector, geo, and ETL guides.

## 1. Create the Base Tables
`citydrive_videos` stores clip metadata, while `frame_events` records the interesting frames pulled from each clip.

```sql
CREATE OR REPLACE TABLE citydrive_videos (
    video_id       STRING,
    vehicle_id     STRING,
    capture_date   DATE,
    route_name     STRING,
    weather        STRING,
    camera_source  STRING,
    duration_sec   INT
);

CREATE OR REPLACE TABLE frame_events (
    frame_id     STRING,
    video_id     STRING,
    frame_index  INT,
    collected_at TIMESTAMP,
    event_tag    STRING,
    risk_score   DOUBLE,
    speed_kmh    DOUBLE
);

INSERT INTO citydrive_videos VALUES
  ('VID-20250101-001', 'VEH-21', '2025-01-01', 'Downtown Loop',       'Rain',     'roof_cam', 3580),
  ('VID-20250101-002', 'VEH-05', '2025-01-01', 'Port Perimeter',      'Overcast', 'front_cam',4020),
  ('VID-20250102-001', 'VEH-21', '2025-01-02', 'Airport Connector',   'Clear',    'front_cam',3655),
  ('VID-20250103-001', 'VEH-11', '2025-01-03', 'CBD Night Sweep',     'LightFog', 'rear_cam', 3310);

INSERT INTO frame_events VALUES
  ('FRAME-0101', 'VID-20250101-001', 125, '2025-01-01 08:15:21', 'hard_brake',      0.81, 32.4),
  ('FRAME-0102', 'VID-20250101-001', 416, '2025-01-01 08:33:54', 'pedestrian',      0.67, 24.8),
  ('FRAME-0201', 'VID-20250101-002', 298, '2025-01-01 11:12:02', 'lane_merge',      0.74, 48.1),
  ('FRAME-0301', 'VID-20250102-001', 188, '2025-01-02 09:44:18', 'hard_brake',      0.59, 52.6),
  ('FRAME-0401', 'VID-20250103-001', 522, '2025-01-03 21:18:07', 'night_lowlight',  0.63, 38.9);
```

Docs: [CREATE TABLE](/sql/sql-commands/ddl/table/ddl-create-table), [INSERT](/sql/sql-commands/ddl/table/ddl-insert-into).

---

## 2. Filter the Working Set
Keep investigations focused on fresh drives.

```sql
WITH recent_videos AS (
    SELECT *
    FROM citydrive_videos
    WHERE capture_date >= DATEADD('day', -3, TODAY())
)
SELECT v.video_id,
       v.route_name,
       v.weather,
       COUNT(f.frame_id) AS flagged_frames
FROM recent_videos v
LEFT JOIN frame_events f USING (video_id)
GROUP BY v.video_id, v.route_name, v.weather
ORDER BY flagged_frames DESC;
```

Docs: [DATEADD](/sql/sql-functions/expressions/dateadd), [GROUP BY](/sql/sql-commands/query-syntax/query-select#group-by-clause).

---

## 3. JOIN Patterns
### INNER JOIN for frame context
```sql
SELECT f.frame_id,
       f.event_tag,
       f.risk_score,
       v.route_name,
       v.camera_source
FROM frame_events AS f
JOIN citydrive_videos AS v USING (video_id)
ORDER BY f.collected_at;
```

### Anti join QA
```sql
SELECT frame_id
FROM frame_events f
WHERE NOT EXISTS (
    SELECT 1
    FROM citydrive_videos v
    WHERE v.video_id = f.video_id
);
```

### LATERAL FLATTEN for nested detections
```sql
SELECT f.frame_id,
       obj.value['type']::STRING AS detected_type,
       obj.value['confidence']::DOUBLE AS confidence
FROM frame_events AS f
JOIN frame_payloads AS p ON f.frame_id = p.frame_id,
     LATERAL FLATTEN(input => p.payload['objects']) AS obj
WHERE f.event_tag = 'pedestrian'
ORDER BY confidence DESC;
```

Docs: [JOIN](/sql/sql-commands/query-syntax/query-join), [FLATTEN](/sql/sql-functions/json-functions/json-functions#flatten).

---

## 4. Aggregations for Fleet KPIs
### Behaviour by route
```sql
SELECT v.route_name,
       f.event_tag,
       COUNT(*) AS occurrences,
       AVG(f.risk_score) AS avg_risk
FROM frame_events f
JOIN citydrive_videos v USING (video_id)
GROUP BY v.route_name, f.event_tag
ORDER BY avg_risk DESC, occurrences DESC;
```

### ROLLUP totals
```sql
SELECT v.route_name,
       f.event_tag,
       COUNT(*) AS occurrences
FROM frame_events f
JOIN citydrive_videos v USING (video_id)
GROUP BY ROLLUP(v.route_name, f.event_tag)
ORDER BY v.route_name NULLS LAST, f.event_tag;
```

### CUBE for route × weather coverage
```sql
SELECT v.route_name,
       v.weather,
       COUNT(DISTINCT v.video_id) AS videos
FROM citydrive_videos v
GROUP BY CUBE(v.route_name, v.weather)
ORDER BY v.route_name NULLS LAST, v.weather NULLS LAST;
```

---

## 5. Window Functions
### Running risk per video
```sql
WITH ordered_events AS (
    SELECT video_id, collected_at, risk_score
    FROM frame_events
)
SELECT video_id,
       collected_at,
       risk_score,
       SUM(risk_score) OVER (
         PARTITION BY video_id
         ORDER BY collected_at
         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
       ) AS cumulative_risk
FROM ordered_events
ORDER BY video_id, collected_at;
```

### Rolling average over recent frames
```sql
SELECT video_id,
       frame_id,
       frame_index,
       risk_score,
       AVG(risk_score) OVER (
         PARTITION BY video_id
         ORDER BY frame_index
         ROWS BETWEEN 3 PRECEDING AND CURRENT ROW
       ) AS rolling_avg_risk
FROM frame_events
ORDER BY video_id, frame_index;
```

Docs: [Window functions](/sql/sql-functions/window-functions).

---

## 6. Aggregating Index Boost
Persist frequently used summaries for dashboards.

```sql
CREATE OR REPLACE AGGREGATING INDEX idx_video_event_summary
AS
SELECT video_id,
       event_tag,
       COUNT(*)        AS event_count,
       AVG(risk_score) AS avg_risk
FROM frame_events
GROUP BY video_id, event_tag;
```

When analysts rerun a familiar KPI, the optimizer serves it from the index:

```sql
SELECT v.route_name,
       e.event_tag,
       COUNT(*)        AS event_count,
       AVG(e.risk_score) AS avg_risk
FROM frame_events e
JOIN citydrive_videos v USING (video_id)
WHERE v.capture_date >= DATEADD('day', -14, TODAY())
GROUP BY v.route_name, e.event_tag
ORDER BY avg_risk DESC;
```

Docs: [Aggregating Index](/guides/performance/aggregating-index) and [EXPLAIN](/sql/sql-commands/ddl/explain).

---

## 7. Stored Procedure Automation
Wrap the logic so scheduled jobs always produce the same report.

```sql
CREATE OR REPLACE PROCEDURE citydrive_route_report(days_back UINT8)
RETURNS TABLE(route_name STRING, event_tag STRING, event_count BIGINT, avg_risk DOUBLE)
LANGUAGE SQL
AS
$$
BEGIN
  RETURN TABLE (
    SELECT v.route_name,
           e.event_tag,
           COUNT(*)          AS event_count,
           AVG(e.risk_score) AS avg_risk
    FROM frame_events e
    JOIN citydrive_videos v USING (video_id)
    WHERE v.capture_date >= DATEADD('day', -:days_back, TODAY())
    GROUP BY v.route_name, e.event_tag
  );
END;
$$;

CALL PROCEDURE citydrive_route_report(30);
```

Stored procedures can be triggered manually, via [TASKS](/guides/load-data/continuous-data-pipelines/task), or from orchestration tools.

---

With these tables and patterns in place, the rest of the CityDrive guides can reference the exact same `video_id` keys—`frame_metadata_catalog` for JSON search, frame embeddings for similarity, GPS locations for geo queries, and a single ETL path to keep them synchronized.
