---
title: SQL Analytics
---

> **Scenario:** EverDrive Smart Vision analysts curate a shared set of drive sessions and key frames so every downstream workload can query the same IDs without copying data between systems.

This tutorial builds a miniature **EverDrive Smart Vision** dataset and shows how Databend’s single optimizer works across the rest of the guides. Every ID you create here (`SES-20240801-SEA01`, `FRAME-0001` …) reappears in the JSON, vector, geo, and ETL walkthroughs for a consistent autonomous-driving story.

## 1. Create Sample Tables
Two tables capture test sessions and the important frames extracted from dash-camera video.

```sql
CREATE OR REPLACE TABLE drive_sessions (
  session_id   VARCHAR,
  vehicle_id   VARCHAR,
  route_name   VARCHAR,
  start_time   TIMESTAMP,
  end_time     TIMESTAMP,
  weather      VARCHAR,
  camera_setup VARCHAR
);

CREATE OR REPLACE TABLE frame_events (
  frame_id     VARCHAR,
  session_id   VARCHAR,
  frame_index  INT,
  captured_at  TIMESTAMP,
  event_type   VARCHAR,
  risk_score   DOUBLE
);

INSERT INTO drive_sessions VALUES
  ('SES-20240801-SEA01', 'VEH-01', 'Seattle → Bellevue → Seattle', '2024-08-01 09:00', '2024-08-01 10:10', 'Sunny',     'Dual 1080p'),
  ('SES-20240802-SEA02', 'VEH-02', 'Downtown Night Loop',          '2024-08-02 20:15', '2024-08-02 21:05', 'Light Rain','Night Vision'),
  ('SES-20240803-SEA03', 'VEH-03', 'Harbor Industrial Route',      '2024-08-03 14:05', '2024-08-03 15:30', 'Overcast',  'Thermal + RGB');

INSERT INTO frame_events VALUES
  ('FRAME-0001', 'SES-20240801-SEA01', 120, '2024-08-01 09:32:15', 'SuddenBrake',          0.82),
  ('FRAME-0002', 'SES-20240801-SEA01', 342, '2024-08-01 09:48:03', 'CrosswalkPedestrian',  0.67),
  ('FRAME-0003', 'SES-20240802-SEA02',  88, '2024-08-02 20:29:41', 'NightLowVisibility',   0.59),
  ('FRAME-0004', 'SES-20240802-SEA02', 214, '2024-08-02 20:48:12', 'EmergencyVehicle',     0.73),
  ('FRAME-0005', 'SES-20240803-SEA03', 305, '2024-08-03 15:02:44', 'CyclistOvertake',      0.64);
```

> Need a refresher on table DDL? See [CREATE TABLE](/sql/sql-commands/ddl/table/ddl-create-table).

---

## 2. Filter Recent Sessions
Keep analytics focused on the most recent drives.

```sql
WITH recent_sessions AS (
  SELECT *
  FROM drive_sessions
  WHERE start_time >= DATEADD('day', -7, CURRENT_TIMESTAMP)
)
SELECT *
FROM recent_sessions
ORDER BY start_time DESC;
```

Filtering early keeps later joins and aggregations fast. Docs: [WHERE & CASE](/sql/sql-commands/query-syntax/query-select#where-clause).

---

## 3. JOIN
### INNER JOIN ... USING
Combine session metadata with frame-level events.

```sql
WITH recent_events AS (
  SELECT *
  FROM frame_events
  WHERE captured_at >= DATEADD('day', -7, CURRENT_TIMESTAMP)
)
SELECT e.frame_id,
       e.captured_at,
       e.event_type,
       e.risk_score,
       s.vehicle_id,
       s.route_name,
       s.weather
FROM recent_events e
JOIN drive_sessions s USING (session_id)
ORDER BY e.captured_at;
```

### NOT EXISTS (Anti Join)
Find events whose session metadata is missing.

```sql
SELECT frame_id
FROM frame_events e
WHERE NOT EXISTS (
  SELECT 1
  FROM drive_sessions s
  WHERE s.session_id = e.session_id
);
```

### LATERAL FLATTEN (JSON Unnest)
Combine events with detection objects stored inside JSON payloads.

```sql
SELECT e.frame_id,
       obj.value['type']::STRING AS object_type
FROM frame_events e
JOIN frame_payloads p USING (frame_id),
     LATERAL FLATTEN(p.payload['objects']) AS obj;
```

More patterns: [JOIN reference](/sql/sql-commands/query-syntax/query-join).

---

## 4. GROUP BY
### GROUP BY route_name, event_type
Standard `GROUP BY` to compare routes and event types.

```sql
WITH recent_events AS (
  SELECT *
  FROM frame_events
  WHERE captured_at >= DATEADD('week', -4, CURRENT_TIMESTAMP)
)
SELECT route_name,
       event_type,
       COUNT(*)              AS event_count,
       AVG(risk_score)       AS avg_risk
FROM recent_events
JOIN drive_sessions USING (session_id)
GROUP BY route_name, event_type
ORDER BY avg_risk DESC, event_count DESC;
```

### GROUP BY ROLLUP
Adds route subtotals plus a grand total.

```sql
SELECT route_name,
       event_type,
       COUNT(*) AS event_count,
       AVG(risk_score) AS avg_risk
FROM frame_events
JOIN drive_sessions USING (session_id)
GROUP BY ROLLUP(route_name, event_type)
ORDER BY route_name NULLS LAST, event_type;
```

### GROUP BY CUBE
Generates all combinations of route and event type.

```sql
SELECT route_name,
       event_type,
       COUNT(*) AS event_count,
       AVG(risk_score) AS avg_risk
FROM frame_events
JOIN drive_sessions USING (session_id)
GROUP BY CUBE(route_name, event_type)
ORDER BY route_name NULLS LAST, event_type;
```

---

## 5. WINDOW FUNCTION
### SUM(...) OVER (running total)
Track cumulative risk across each drive with a running `SUM`.

```sql
WITH session_event_scores AS (
  SELECT session_id,
         captured_at,
         risk_score
  FROM frame_events
)
SELECT session_id,
       captured_at,
       risk_score,
       SUM(risk_score) OVER (
         PARTITION BY session_id
         ORDER BY captured_at
         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
       ) AS cumulative_risk
FROM session_event_scores
ORDER BY session_id, captured_at;
```

### AVG(...) OVER (moving average)
Show a moving average of risk over the last three events:

```sql
WITH session_event_scores AS (
  SELECT session_id,
         captured_at,
         risk_score
  FROM frame_events
)
SELECT session_id,
       captured_at,
       risk_score,
       AVG(risk_score) OVER (
         PARTITION BY session_id
         ORDER BY captured_at
         ROWS BETWEEN 3 PRECEDING AND CURRENT ROW
       ) AS moving_avg_risk
FROM session_event_scores
ORDER BY session_id, captured_at;
```

Window functions let you express rolling totals or averages inline. Full list: [Window functions](/sql/sql-functions/window-functions).

---

## 6. Aggregating Index Acceleration
Cache heavy summaries with an [Aggregating Index](/guides/performance/aggregating-index) so dashboards stay snappy.

```sql
CREATE OR REPLACE AGGREGATING INDEX idx_route_event_summary ON frame_events
AS
SELECT session_id,
       event_type,
       COUNT(*)        AS event_count,
       AVG(risk_score) AS avg_risk
FROM frame_events
GROUP BY session_id, event_type;
```

Now run the same summary query as before—the optimizer will pull results from the index automatically:

```sql
SELECT s.route_name,
       e.event_type,
       COUNT(*)        AS event_count,
       AVG(e.risk_score) AS avg_risk
FROM frame_events e
JOIN drive_sessions s USING (session_id)
WHERE s.start_time >= DATEADD('week', -8, CURRENT_TIMESTAMP)
GROUP BY s.route_name, e.event_type
ORDER BY avg_risk DESC;
```

`EXPLAIN` the statement to see the `AggregatingIndex` node instead of a full scan. Databend keeps the index fresh as new frames arrive, delivering sub-second dashboards without extra ETL jobs.

---

## 7. Stored Procedure Automation
You can also wrap the reporting logic in a stored procedure so it runs exactly the way you expect during scheduled jobs.

```sql
CREATE OR REPLACE PROCEDURE generate_weekly_route_report(days_back INT)
RETURNS TABLE(route_name VARCHAR, event_count BIGINT, avg_risk DOUBLE)
LANGUAGE SQL
AS
$$
BEGIN
  RETURN TABLE (
    SELECT s.route_name,
           COUNT(*)              AS event_count,
           AVG(e.risk_score)     AS avg_risk
    FROM frame_events e
    JOIN drive_sessions s USING (session_id)
    WHERE e.captured_at >= DATEADD('day', -days_back, CURRENT_TIMESTAMP)
    GROUP BY s.route_name
  );
END;
$$;

CALL PROCEDURE generate_weekly_route_report(28);
```

Use the returned result set directly in notebooks, ETL tasks, or automated alerts. Learn more: [Stored procedure scripting](/sql/stored-procedure-scripting).

---

You now have a full loop: ingest session data, filter, join, aggregate, accelerate heavy queries, trend over time, and publish. Swap filters or joins to adapt the same recipe to other smart-driving KPIs like driver scoring, sensor degradation, or algorithm comparisons.
