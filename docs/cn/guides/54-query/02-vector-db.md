---
title: 向量搜索
---

> **场景：** CityDrive 将每一帧的向量嵌入（Embeddings）直接存储在 Databend 中。这样一来，语义相似度搜索（即“查找与此画面相似的帧”）就可以与传统的 SQL 分析任务并行运行，而无需部署额外的向量数据库服务。

`frame_embeddings` 表与 `frame_events`、`frame_metadata_catalog` 以及 `frame_geo_points` 表共用同一套 `frame_id` 主键，这使得语义搜索能够与经典 SQL 查询紧密结合，无缝衔接。

## 1. 准备向量表
生产环境中的模型通常会输出 512 到 1536 维的向量。为了方便您直接复制到演示集群中运行，本例将使用 512 维向量，无需修改 DDL。

```sql
CREATE OR REPLACE TABLE frame_embeddings (
    frame_id      STRING,
    video_id      STRING,
    sensor_view   STRING,
    embedding     VECTOR(512),
    encoder_build STRING,
    created_at    TIMESTAMP,
    VECTOR INDEX idx_frame_embeddings(embedding) distance='cosine'
);

-- SQL UDF：通过 ARRAY_AGG + 窗口函数构建 512 维向量；仅作为教程占位符。
CREATE OR REPLACE FUNCTION demo_random_vector(seed STRING)
RETURNS TABLE(embedding VECTOR(512))
AS $$
SELECT CAST(
         ARRAY_AGG(rand_val) OVER (
           PARTITION BY seed
           ORDER BY seq
           ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
         )
         AS VECTOR(512)
       ) AS embedding
FROM (
  SELECT seed,
         dims.number AS seq,
         (RAND() * 0.2 - 0.1)::FLOAT AS rand_val
  FROM numbers(512) AS dims
) vals
QUALIFY ROW_NUMBER() OVER (PARTITION BY seed ORDER BY seq) = 1;
$$;

INSERT INTO frame_embeddings (frame_id, video_id, sensor_view, embedding, encoder_build, created_at)
SELECT 'FRAME-0101', 'VID-20250101-001', 'roof_cam', embedding, 'clip-lite-v1', '2025-01-01 08:15:21'
FROM demo_random_vector('FRAME-0101')
UNION ALL
SELECT 'FRAME-0102', 'VID-20250101-001', 'roof_cam', embedding, 'clip-lite-v1', '2025-01-01 08:33:54'
FROM demo_random_vector('FRAME-0102')
UNION ALL
SELECT 'FRAME-0201', 'VID-20250101-002', 'front_cam', embedding, 'night-fusion-v2', '2025-01-01 11:12:02'
FROM demo_random_vector('FRAME-0201')
UNION ALL
SELECT 'FRAME-0401', 'VID-20250103-001', 'rear_cam', embedding, 'night-fusion-v2', '2025-01-03 21:18:07'
FROM demo_random_vector('FRAME-0401');
```

> 此数组生成器仅用于使教程自包含。在生产环境中，请将其替换为模型中的真实嵌入。

如果您尚未运行 SQL 分析指南，请创建支持的 `frame_events` 表并播种向量演练所连接的相同样本行：

```sql
CREATE OR REPLACE TABLE frame_events (
    frame_id     STRING,
    video_id     STRING,
    frame_index  INT,
    collected_at TIMESTAMP,
    event_tag    STRING,
    risk_score   DOUBLE,
    speed_kmh    DOUBLE
);

INSERT INTO frame_events VALUES
  ('FRAME-0101', 'VID-20250101-001', 125, '2025-01-01 08:15:21', 'hard_brake',      0.81, 32.4),
  ('FRAME-0102', 'VID-20250101-001', 416, '2025-01-01 08:33:54', 'pedestrian',      0.67, 24.8),
  ('FRAME-0201', 'VID-20250101-002', 298, '2025-01-01 11:12:02', 'lane_merge',      0.74, 48.1),
  ('FRAME-0301', 'VID-20250102-001', 188, '2025-01-02 09:44:18', 'hard_brake',      0.59, 52.6),
  ('FRAME-0401', 'VID-20250103-001', 522, '2025-01-03 21:18:07', 'night_lowlight',  0.63, 38.9),
  ('FRAME-0501', 'VID-MISSING-001', 10, '2025-01-04 10:00:00', 'sensor_fault',     0.25, 15.0);
```

文档：[Vector 类型](/sql/sql-reference/data-types/vector) 和 [Vector 索引](/sql/sql-reference/data-types/vector#vector-indexing)。

---

## 2. 运行余弦相似度搜索
提取某一帧的向量嵌入，并利用 HNSW 索引快速返回其最近邻（Nearest Neighbours）。

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

示例输出：

```
frame_id  | video_id         | distance
FRAME-0101| VID-20250101-001 | 0.0000
FRAME-0201| VID-20250101-002 | 0.9801
FRAME-0102| VID-20250101-001 | 0.9842
```

距离越小 = 越相似。即使有数百万帧，`VECTOR INDEX` 也能保持低延迟。

在向量比较之前或之后添加传统谓词（路线、视频、传感器视图）以缩小候选集。

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

示例输出：

```
frame_id  | sensor_view | distance
FRAME-0401| rear_cam    | 1.0537
```

优化器仍然使用向量索引，同时遵循 `sensor_view` 过滤器。

---

## 3. 丰富相似帧信息
将匹配度最高的 Top-N 帧物化（Materialize），然后关联 `frame_events` 表，为下游分析提供更多上下文信息。

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

示例输出：

```
frame_id  | video_id         | event_tag      | risk_score | distance
FRAME-0102| VID-20250101-001 | pedestrian     | 0.67       | 0.0000
FRAME-0201| VID-20250101-002 | lane_merge     | 0.74       | 0.9802
FRAME-0101| VID-20250101-001 | hard_brake     | 0.81       | 0.9842
FRAME-0401| VID-20250103-001 | night_lowlight | 0.63       | 1.0020
```

由于向量嵌入与关系型表存储在同一个库中，您可以轻松地从“查找相似画面”跳转到“查找同时包含急刹车标签、特定天气或 JSON 检测结果的帧”，而无需将数据导出到其他服务中进行处理。
