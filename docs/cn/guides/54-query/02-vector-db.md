---
title: 向量搜索（Vector Search）
---

> **场景：** EverDrive Smart Vision 将紧凑的视觉嵌入（vision embeddings）附加到高风险帧，以便调查团队直接在 Databend 内检索相似场景。

每帧都附带视觉嵌入，感知工程师可借此发现相似情况。本指南演示如何插入这些向量，并在同一 EverDrive ID 上执行语义搜索。

## 1. 创建示例表
为便于阅读，示例使用四维向量。生产环境中可保存 CLIP 或自监督模型输出的 512 维或 1536 维嵌入。

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

文档：[向量数据类型（Vector data type）](/sql/sql-reference/data-types/vector) 与 [向量索引（Vector index）](/sql/sql-reference/data-types/vector#vector-indexing)。

---

## 2. COSINE_DISTANCE 搜索
查找与 `FRAME-0001` 最相似的帧。

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

余弦距离计算将利用先前创建的 HNSW 索引，优先返回最近邻帧。

---

## 3. WHERE 过滤 + 相似度
结合相似度搜索与传统谓词，缩小结果范围。

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

## 4. JOIN 语义 + 风险元数据
将语义结果与风险评分或检测载荷关联，丰富调查维度。

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

该混合视图呈现“外观类似 FRAME-0001 且触发高风险事件的帧”。