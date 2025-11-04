---
title: Vector Search
---

> **Scenario:** CityDrive keeps per-frame embeddings in Databend so semantic similarity search (“find frames that look like this”) runs alongside traditional SQL analytics—no extra vector service required.

The `frame_embeddings` table shares the same `frame_id` keys as `frame_events`, `frame_metadata_catalog`, and `frame_geo_points`, which keeps semantic search and classic SQL glued together.

## 1. Prepare the Embedding Table
Production models tend to emit 512–1536 dimensions. The example below uses 512 so you can copy it straight into a demo cluster without changing the DDL.

```sql
CREATE OR REPLACE TABLE frame_embeddings (
    frame_id      STRING,
    video_id      STRING,
    sensor_view   STRING,
    embedding     VECTOR(512),
    encoder_build STRING,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    VECTOR INDEX idx_frame_embeddings(embedding) distance='cosine'
);

INSERT INTO frame_embeddings VALUES
  ('FRAME-0101', 'VID-20250101-001', 'roof_cam', RANDOM_VECTOR(512), 'clip-lite-v1', DEFAULT),
  ('FRAME-0102', 'VID-20250101-001', 'roof_cam', RANDOM_VECTOR(512), 'clip-lite-v1', DEFAULT),
  ('FRAME-0201', 'VID-20250101-002', 'front_cam',RANDOM_VECTOR(512), 'night-fusion-v2', DEFAULT),
  ('FRAME-0401', 'VID-20250103-001', 'rear_cam', RANDOM_VECTOR(512), 'night-fusion-v2', DEFAULT);
```

Docs: [Vector type](/sql/sql-reference/data-types/vector) and [Vector index](/sql/sql-reference/data-types/vector#vector-indexing).

---

## 2. Run Cosine Search
Pull the embedding from one frame and let the HNSW index return the closest neighbours.

```sql
WITH query_embedding AS (
    SELECT embedding
    FROM frame_embeddings
    WHERE frame_id = 'FRAME-0101'
)
SELECT e.frame_id,
       e.video_id,
       COSINE_DISTANCE(e.embedding, q.embedding) AS distance
FROM frame_embeddings AS e
CROSS JOIN query_embedding AS q
ORDER BY distance
LIMIT 3;
```

Lower distance = more similar. The `VECTOR INDEX` keeps latency low even with millions of frames.

Add traditional predicates (route, video, sensor view) before or after the vector comparison to narrow the candidate set.

```sql
WITH query_embedding AS (
    SELECT embedding
    FROM frame_embeddings
    WHERE frame_id = 'FRAME-0201'
)
SELECT e.frame_id,
       e.sensor_view,
       COSINE_DISTANCE(e.embedding, q.embedding) AS distance
FROM frame_embeddings AS e
CROSS JOIN query_embedding AS q
WHERE e.sensor_view = 'rear_cam'
ORDER BY distance
LIMIT 5;
```

The optimizer still uses the vector index while honoring the `sensor_view` filter.

---

## 3. Enrich Similar Frames
Materialize the top matches, then enrich them with `frame_events` for downstream analytics.

```sql
WITH query_embedding AS (
       SELECT embedding
       FROM frame_embeddings
       WHERE frame_id = 'FRAME-0102'
     ),
     similar_frames AS (
       SELECT frame_id,
              video_id,
              COSINE_DISTANCE(e.embedding, q.embedding) AS distance
       FROM frame_embeddings e
       CROSS JOIN query_embedding q
       ORDER BY distance
       LIMIT 5
     )
SELECT sf.frame_id,
       sf.video_id,
       fe.event_tag,
       fe.risk_score,
       sf.distance
FROM similar_frames sf
LEFT JOIN frame_events fe USING (frame_id)
ORDER BY sf.distance;
```

Because the embeddings live next to relational tables, you can pivot from “frames that look alike” to “frames that also had `hard_brake` tags, specific weather, or JSON detections” without exporting data to another service.
