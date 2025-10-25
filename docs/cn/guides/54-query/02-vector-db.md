---
title: 向量搜索（Vector Search）
---

> **场景：** CityDrive 将每一帧的嵌入向量（Embedding）存储在 Databend 中，让语义相似性搜索（Semantic Similarity Search，“找到看起来像这样的帧”）与传统 SQL 分析并行运行——无需额外的向量服务。

`frame_embeddings` 表与 `frame_events`、`frame_payloads` 和 `frame_geo_points` 共享相同的 `frame_id` 键，从而将语义搜索与经典 SQL 紧密结合。

## 1. 准备嵌入向量（Embedding）表
生产模型通常会输出 512–1536 维。本示例使用 512 维，因此您可以直接将其复制到演示集群中而无需修改 DDL。

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

文档： [向量数据类型（Vector Type）](/sql/sql-reference/data-types/vector) 和 [向量索引（Vector Index）](/sql/sql-reference/data-types/vector#vector-indexing)。

---

## 2. 运行余弦相似度搜索（Cosine Search）
获取某一帧的嵌入向量（Embedding），让 HNSW 索引（HNSW Index）返回最接近的邻居。

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

距离越小表示越相似。`VECTOR INDEX` 向量索引（Vector Index）即使面对数百万帧也能保持低延迟。

在向量比较之前或之后添加传统谓词（Predicate）（路线、视频、传感器视角）可以缩小候选集合。

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

查询优化器（Query Optimizer）仍会在满足 `sensor_view` 过滤条件的同时使用向量索引（Vector Index）。

---

## 3. 丰富相似帧
将匹配度最高的结果物化，然后与 `frame_events` 结合，为后续分析提供更多信息。

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

由于嵌入向量（Embedding）与关系型表并存，您可以从“看起来相似的帧”无缝转向“同时具有 `hard_brake` 标签、特定天气或 JSON 检测的帧”，而无需将数据导出到其他服务。