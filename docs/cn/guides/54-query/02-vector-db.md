---
title: 向量搜索（Vector Search）
---

> **场景：** EverDrive Smart Vision 为风险帧附加紧凑的视觉嵌入向量（Embedding），以便调查团队可以直接在 Databend 中检索相似情况。

每个提取的帧都附带视觉嵌入向量，方便感知工程师发现相似场景。本指南展示如何插入这些向量并在相同的 EverDrive ID 上执行语义搜索。

## 1. 创建示例表
为提升可读性，我们使用四维向量存储紧凑示例。在生产环境中，您可能需要保存来自 CLIP 或自监督模型的 512 维或 1536 维嵌入向量。

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

文档：[向量数据类型（Vector）](/sql/sql-reference/data-types/vector) 和 [向量索引（Vector Index）](/sql/sql-reference/data-types/vector#vector-indexing)。

---

## 2. COSINE_DISTANCE 搜索
搜索与 `FRAME-0001` 最相似的帧。

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

余弦距离计算利用先前创建的 HNSW 索引（Index），优先返回最相似的帧。

---

## 3. WHERE 过滤 + 相似度
将相似度搜索与传统谓词结合以缩小结果范围。

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

## 4. 连接（JOIN）语义 + 风险元数据
将语义搜索结果与风险评分或检测负载关联，以支持更深入的调查分析。

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

该混合视图（View）可呈现“视觉特征与 FRAME-0001 相似且触发了高风险事件”的帧。