---
title: JSON & Search
---

> **Scenario:** EverDrive Smart Vision’s perception services emit JSON payloads for every observed frame, and safety analysts need to search detections without moving the data out of Databend.

EverDrive’s perception pipeline emits JSON payloads that we query with Elasticsearch-style syntax. By storing payloads as VARIANT and declaring an inverted index during table creation, Databend lets you run Lucene `QUERY` filters directly on the data.

## 1. CREATE SAMPLE TABLE
Each frame carries structured metadata from perception models (bounding boxes, velocities, classifications).

```sql
CREATE OR REPLACE TABLE frame_payloads (
  frame_id   VARCHAR,
  run_stage  VARCHAR,
  payload    VARIANT,
  logged_at  TIMESTAMP,
  INVERTED INDEX idx_frame_payloads(payload)
);

INSERT INTO frame_payloads VALUES
  ('FRAME-0001', 'detection', PARSE_JSON('{
    "objects": [
      {"type":"vehicle","bbox":[545,220,630,380],"confidence":0.94},
      {"type":"pedestrian","bbox":[710,200,765,350],"confidence":0.88}
    ],
    "ego": {"speed_kmh": 32.5, "accel": -2.1}
  }'), '2024-08-01 09:32:16'),
  ('FRAME-0002', 'detection', PARSE_JSON('{
    "objects": [
      {"type":"pedestrian","bbox":[620,210,670,360],"confidence":0.91}
    ],
    "scene": {"lighting":"daytime","weather":"sunny"}
  }'), '2024-08-01 09:48:04'),
  ('FRAME-0003', 'tracking', PARSE_JSON('{
    "objects": [
      {"type":"vehicle","speed_kmh": 18.0,"distance_m": 6.2},
      {"type":"emergency_vehicle","sirens":true}
    ],
    "scene": {"lighting":"night","visibility":"low"}
  }'), '2024-08-02 20:29:42');
```

## 2. SELECT JSON Paths
Peek into the payload to confirm the structure.

```sql
SELECT frame_id,
       payload['objects'][0]['type']::STRING      AS first_object,
       payload['ego']['speed_kmh']::DOUBLE        AS ego_speed,
       payload['scene']['lighting']::STRING       AS lighting
FROM frame_payloads
ORDER BY logged_at;
```

Casting with `::STRING` / `::DOUBLE` exposes JSON values to regular SQL filters. Databend also supports Elasticsearch-style search on top of this data via the `QUERY` function—reference variant fields by prefixing them with the column name (for example `payload.objects.type`). More tips: [Semi-structured data](/guides/load-data/load-semistructured/load-ndjson).

---

## 3. Elasticsearch-style Search
`QUERY` uses Elasticsearch/Lucene syntax, so you can combine boolean logic, ranges, boosts, and lists. Below are a few patterns on the EverDrive payloads:

### Array Match
Find frames that detected a pedestrian:

```sql
SELECT frame_id
FROM frame_payloads
WHERE QUERY('payload.objects.type:pedestrian')
ORDER BY logged_at DESC
LIMIT 10;
```

### Boolean AND
Vehicle travelling faster than 30 km/h **and** a pedestrian detected:

```sql
SELECT frame_id,
       payload['ego']['speed_kmh']::DOUBLE AS ego_speed
FROM frame_payloads
WHERE QUERY('payload.objects.type:pedestrian AND payload.ego.speed_kmh:[30 TO *]')
ORDER BY ego_speed DESC;
```

### Boolean OR / List
Night drives encountering either an emergency vehicle or a cyclist:

```sql
SELECT frame_id
FROM frame_payloads
WHERE QUERY('payload.scene.lighting:night AND payload.objects.type:(emergency_vehicle OR cyclist)');
```

### Numeric Ranges
Speed between 10–25 km/h (inclusive) or strictly between 25–40 km/h:

```sql
SELECT frame_id,
       payload['ego']['speed_kmh'] AS speed
FROM frame_payloads
WHERE QUERY('payload.ego.speed_kmh:[10 TO 25] OR payload.ego.speed_kmh:{25 TO 40}')
ORDER BY speed;
```

### Boosting
Prioritise frames where both a pedestrian and a vehicle appear, but emphasise the pedestrian term:

```sql
SELECT frame_id,
       SCORE() AS relevance
FROM frame_payloads
WHERE QUERY('payload.objects.type:pedestrian^2 AND payload.objects.type:vehicle')
ORDER BY relevance DESC
LIMIT 10;
```

See [Search functions](/sql/sql-functions/search-functions) for complete Elasticsearch syntax supported by `QUERY`, `SCORE()`, and related helpers.

---

## 4. Cross-Reference Frame Events
Join query results back to the frame-level risk scores created in the analytics guide.

```sql
WITH risky_frames AS (
  SELECT frame_id,
         payload['ego']['speed_kmh']::DOUBLE AS ego_speed
  FROM frame_payloads
  WHERE QUERY('payload.objects.type:pedestrian AND payload.ego.speed_kmh:[30 TO *]')
)
SELECT r.frame_id,
       e.event_type,
       e.risk_score,
       r.ego_speed
FROM risky_frames r
JOIN frame_events e USING (frame_id)
ORDER BY e.risk_score DESC;
```

Because `frame_id` is shared across tables, you jump from raw payloads to curated analytics instantly.
