---
title: 向量搜索（Vector Search）
---

> **场景（Scenario）：** CityDrive 在 Databend 中保存了每帧的嵌入（embeddings），因此语义相似性搜索（“查找看起来像这样的帧”）可以与传统的 SQL 分析并行运行——无需额外的向量服务。

`frame_embeddings` 表与 `frame_events`、`frame_payloads` 和 `frame_geo_points` 共享相同的 `frame_id` 键，这使得语义搜索和经典 SQL 紧密结合。

## 1. 准备嵌入表

生产模型通常会输出 512–1536 维的嵌入。下面的示例使用 512 维，因此您可以直接将其复制到演示集群中，而无需修改 DDL。

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

文档：[向量类型（Vector type）](/sql/sql-reference/data-types/vector) 和 [向量索引（Vector index）](/sql/sql-reference/data-types/vector#vector-indexing)。

---

## 2. 运行余弦搜索（Cosine Search）

从一帧中提取嵌入，让 HNSW 索引返回最近的邻居。

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

距离越低越相似。即使有数百万帧，`VECTOR INDEX` 也能保持低延迟。

在向量比较前后添加传统谓词（路线、视频、传感器视角）以缩小候选集。

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

优化器仍会在遵守 `sensor_view` 过滤条件的同时使用向量索引。

---

## 3. 丰富相似帧

将最匹配的帧物化，然后用 `frame_events` 丰富它们，以供下游分析。

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

由于嵌入与关系表并存，您可以从“看起来相似的帧”无缝切换到“同时带有 `hard_brake` 标签、特定天气或 JSON 检测结果”的帧，而无需将数据导出到其他服务。