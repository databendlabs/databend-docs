---
title: Vector Search
---

> **Scenario:** EverDrive Smart Vision attaches compact vision embeddings to risky frames so investigation teams can surface similar situations directly inside Databend.

Every extracted frame also has a vision embedding so perception engineers can discover similar scenarios. This guide shows how to insert those vectors and perform semantic search on top of the same EverDrive IDs.

## 1. CREATE SAMPLE TABLE
We store a compact example using four-dimensional vectors for readability. In production you might keep 512- or 1536-dim embeddings from CLIP or a self-supervised model.

```sql
CREATE OR REPLACE TABLE frame_embeddings (
  frame_id      VARCHAR,
  session_id    VARCHAR,
  embedding     VECTOR(4),
  model_version VARCHAR,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  VECTOR INDEX idx_frame_embeddings(embedding) distance='cosine'
);

INSERT INTO frame_embeddings VALUES
  ('FRAME-0001', 'SES-20240801-SEA01', [0.18, 0.42, 0.07, 0.12]::VECTOR(4), 'clip-mini-v1', DEFAULT),
  ('FRAME-0002', 'SES-20240801-SEA01', [0.20, 0.38, 0.12, 0.18]::VECTOR(4), 'clip-mini-v1', DEFAULT),
  ('FRAME-0003', 'SES-20240802-SEA02', [0.62, 0.55, 0.58, 0.61]::VECTOR(4), 'night-fusion-v2', DEFAULT),
  ('FRAME-0004', 'SES-20240802-SEA02', [0.57, 0.49, 0.52, 0.55]::VECTOR(4), 'night-fusion-v2', DEFAULT);
```

Docs: [Vector data type](/sql/sql-reference/data-types/vector) and [Vector index](/sql/sql-reference/data-types/vector#vector-indexing).

---

## 2. COSINE_DISTANCE Search
Search for the frames most similar to `FRAME-0001`.

```sql
WITH query_embedding AS (
  SELECT embedding
  FROM frame_embeddings
  WHERE frame_id = 'FRAME-0001'
  LIMIT 1
)
SELECT e.frame_id,
       e.session_id,
       cosine_distance(e.embedding, q.embedding) AS distance
FROM frame_embeddings e
CROSS JOIN query_embedding q
ORDER BY distance
LIMIT 3;
```

The cosine distance calculation uses the HNSW index we created earlier, returning the closest frames first.

---

## 3. WHERE Filter + Similarity
Combine similarity search with traditional predicates to narrow the results.

```sql
WITH query_embedding AS (
  SELECT embedding
  FROM frame_embeddings
  WHERE frame_id = 'FRAME-0003'
  LIMIT 1
)
SELECT e.frame_id,
       cosine_distance(e.embedding, q.embedding) AS distance
FROM frame_embeddings e
CROSS JOIN query_embedding q
WHERE e.session_id = 'SES-20240802-SEA02'
ORDER BY distance;
```

---

## 4. JOIN Semantic + Risk Metadata
Join the semantic results back to risk scores or detection payloads for richer investigation.

```sql
WITH query_embedding AS (
       SELECT embedding FROM frame_embeddings WHERE frame_id = 'FRAME-0001' LIMIT 1
     ),
     similar_frames AS (
     SELECT frame_id,
             cosine_distance(e.embedding, q.embedding) AS distance
       FROM frame_embeddings e
       CROSS JOIN query_embedding q
       ORDER BY distance
       LIMIT 5
     )
SELECT sf.frame_id,
       fe.event_type,
       fe.risk_score,
       sf.distance
FROM similar_frames sf
LEFT JOIN frame_events fe USING (frame_id)
ORDER BY sf.distance;
```

This hybrid view surfaces “frames that look like FRAME-0001 and also triggered high-risk events”.
