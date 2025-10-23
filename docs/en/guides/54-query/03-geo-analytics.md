---
title: Geo Analytics
---

> **Scenario:** EverDrive Smart Vision logs GPS coordinates for each key frame so operations teams can map risky driving hot spots across the city.

Every frame is tagged with GPS coordinates so we can map risky situations across the city. This guide adds a geospatial table and demonstrates spatial filters, polygons, and H3 bucketing using the same EverDrive session IDs.

## 1. CREATE SAMPLE TABLE
Each record represents the ego vehicle at the moment a key frame was captured. Store coordinates as `GEOMETRY` so you can reuse functions like `ST_X`, `ST_Y`, and `HAVERSINE` shown throughout this workload.

```sql
CREATE OR REPLACE TABLE drive_geo (
  frame_id    VARCHAR,
  session_id  VARCHAR,
  location    GEOMETRY,
  speed_kmh   DOUBLE,
  heading_deg DOUBLE
);

INSERT INTO drive_geo VALUES
  ('FRAME-0001', 'SES-20240801-SEA01', TO_GEOMETRY('SRID=4326;POINT(-122.3321 47.6062)'), 28.0,  90),
  ('FRAME-0002', 'SES-20240801-SEA01', TO_GEOMETRY('SRID=4326;POINT(-122.3131 47.6105)'), 35.4, 120),
  ('FRAME-0003', 'SES-20240802-SEA02', TO_GEOMETRY('SRID=4326;POINT(-122.3419 47.6205)'), 18.5,  45),
  ('FRAME-0004', 'SES-20240802-SEA02', TO_GEOMETRY('SRID=4326;POINT(-122.3490 47.6138)'), 22.3,  60),
  ('FRAME-0005', 'SES-20240803-SEA03', TO_GEOMETRY('SRID=4326;POINT(-122.3610 47.6010)'), 30.1, 210);
```

Docs: [Geospatial data types](/sql/sql-reference/data-types/geospatial).

---

## 2. ST_DISTANCE Radius Filter
The `ST_DISTANCE` function measures the distance between geometries. Transform both the frame location and the hotspot into Web Mercator (SRID 3857) so the result is expressed in meters, then filter to 500 m.

```sql
SELECT g.frame_id,
       g.session_id,
       e.event_type,
       e.risk_score,
       ST_DISTANCE(
         ST_TRANSFORM(g.location, 3857),
         ST_TRANSFORM(TO_GEOMETRY('SRID=4326;POINT(-122.3350 47.6080)'), 3857)
       ) AS meters_from_hotspot
FROM drive_geo g
JOIN frame_events e USING (frame_id)
WHERE ST_DISTANCE(
        ST_TRANSFORM(g.location, 3857),
        ST_TRANSFORM(TO_GEOMETRY('SRID=4326;POINT(-122.3350 47.6080)'), 3857)
      ) <= 500
ORDER BY meters_from_hotspot;
```

Need the raw geometry for debugging? Add `ST_ASTEXT(g.location)` to the projection. Prefer direct great-circle math instead? Swap in the `HAVERSINE` function, which operates on `ST_X`/`ST_Y` coordinates.

---

## 3. ST_CONTAINS Polygon Filter
Check whether an event occurred inside a defined safety zone (for example, a school area).

```sql
WITH school_zone AS (
  SELECT TO_GEOMETRY('SRID=4326;POLYGON((
    -122.3415 47.6150,
    -122.3300 47.6150,
    -122.3300 47.6070,
    -122.3415 47.6070,
    -122.3415 47.6150
  ))') AS poly
)
SELECT g.frame_id,
       g.session_id,
       e.event_type
FROM drive_geo g
JOIN frame_events e USING (frame_id)
CROSS JOIN school_zone
WHERE ST_CONTAINS(poly, g.location);
```

---

## 4. GEO_TO_H3 Heatmap
Aggregate events by hexagonal cell to build route heatmaps.

```sql
SELECT GEO_TO_H3(ST_X(location), ST_Y(location), 8) AS h3_cell,
       COUNT(*) AS frame_count,
       AVG(e.risk_score) AS avg_risk
FROM drive_geo
JOIN frame_events e USING (frame_id)
GROUP BY h3_cell
ORDER BY avg_risk DESC;
```

Docs: [H3 functions](/sql/sql-functions/geospatial-functions#h3-indexing--conversion).

---

## 5. ST_DISTANCE + JSON QUERY
Combine spatial distance checks with rich detection metadata (from the JSON guide) to build precise alerts.

```sql
WITH near_intersection AS (
  SELECT frame_id
  FROM drive_geo
  WHERE ST_DISTANCE(
          ST_TRANSFORM(location, 3857),
          ST_TRANSFORM(TO_GEOMETRY('SRID=4326;POINT(-122.3410 47.6130)'), 3857)
        ) <= 200
)
SELECT n.frame_id,
       p.payload['objects'][0]['type']::STRING AS first_object,
       e.event_type,
       e.risk_score
FROM near_intersection n
JOIN frame_payloads p USING (frame_id)
JOIN frame_events  e USING (frame_id)
WHERE QUERY('payload.objects.type:pedestrian');
```

Spatial filters, JSON operators, and classic SQL all run in one statement.

---

## 6. CREATE VIEW Heatmap
Export hex-level summaries to visualization tools or map layers.

```sql
CREATE OR REPLACE VIEW v_route_heatmap AS (
  SELECT GEO_TO_H3(ST_X(location), ST_Y(location), 7) AS h3_cell,
         COUNT(*)                                      AS frames,
         AVG(e.risk_score)                             AS avg_risk
  FROM drive_geo
  JOIN frame_events e USING (frame_id)
  GROUP BY h3_cell
);
```

Downstream systems can query `v_route_heatmap` directly to render risk hot spots on maps without reprocessing raw telemetry.
