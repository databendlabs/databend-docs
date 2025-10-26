---
title: 向量搜索
---

> **场景：** CityDrive 把每个帧的嵌入直接存放在 Databend,语义相似搜索（“找出和它看起来像的帧”）便可与传统 SQL 分析一同运行,无需再部署独立的向量服务。

`frame_embeddings` 表与 `frame_events`、`frame_payloads`、`frame_geo_points` 共用同一批 `frame_id`,让语义检索与常规 SQL 牢牢绑定在一起。

## 1. 准备嵌入表
生产模型通常输出 512–1536 维,本例使用 512 维方便直接复制到演示集群。

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

文档：[向量类型](/sql/sql-reference/data-types/vector)、[向量索引](/sql/sql-reference/data-types/vector#vector-indexing)。

---

## 2. 运行余弦搜索
先取出某一帧的嵌入,再让 HNSW 索引返回最近邻。

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

距离越小越相似。即便有数百万帧,`VECTOR INDEX` 也能让响应保持毫秒级。

继续叠加传统谓词（如路线、视频、传感器视角）,即可在向量比对前后收窄候选集。

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

优化器会在满足 `sensor_view` 过滤的同时继续走向量索引。

---

## 3. 丰富相似帧
把 Top-N 相似帧物化,再与 `frame_events` 连接,方便下游分析。

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

嵌入与关系表同库共存,调查人员可以立即从“视觉相似”跳转到“同时伴随 `hard_brake` 标签、特定天气或 JSON 检测”的线索,无需导出数据。
