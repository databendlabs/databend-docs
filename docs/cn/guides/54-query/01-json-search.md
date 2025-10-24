---
title: JSON 与搜索
---

> **场景：** EverDrive Smart Vision 的感知服务为每个观测帧生成 JSON 负载，安全分析师需要在不将数据移出 Databend 的情况下搜索检测结果。

EverDrive 的感知流水线生成 JSON 负载，我们使用类似 Elasticsearch 的语法进行查询。通过将负载存储为 VARIANT 类型并在创建表时声明倒排索引（Inverted Index），Databend 允许您直接在数据上运行 Lucene `QUERY` 过滤器。

## 1. 创建示例表
每个帧携带来自感知模型的结构化元数据（边界框、速度、分类）。

```sql
CREATE OR REPLACE TABLE frame_payloads (
  frame_id   VARCHAR,
  run_stage  VARCHAR,
  payload    VARIANT,
  logged_at  TIMESTAMP,
  INVERTED INDEX idx_frame_payloads(payload)
);

INSERT INTO frame_payloads VALUES
  ('FRAME-0001', 'detection', PARSE_JSON('{
    "objects": [
      {"type":"vehicle","bbox":[545,220,630,380],"confidence":0.94},
      {"type":"pedestrian","bbox":[710,200,765,350],"confidence":0.88}
    ],
    "ego": {"speed_kmh": 32.5, "accel": -2.1}
  }'), '2024-08-01 09:32:16'),
  ('FRAME-0002', 'detection', PARSE_JSON('{
    "objects": [
      {"type":"pedestrian","bbox":[620,210,670,360],"confidence":0.91}
    ],
    "scene": {"lighting":"daytime","weather":"sunny"}
  }'), '2024-08-01 09:48:04'),
  ('FRAME-0003', 'tracking', PARSE_JSON('{
    "objects": [
      {"type":"vehicle","speed_kmh": 18.0,"distance_m": 6.2},
      {"type":"emergency_vehicle","sirens":true}
    ],
    "scene": {"lighting":"night","visibility":"low"}
  }'), '2024-08-02 20:29:42');
```

## 2. 选择 JSON 路径
查看负载以确认结构。

```sql
SELECT frame_id,
       payload['objects'][0]['type']::STRING      AS first_object,
       payload['ego']['speed_kmh']::DOUBLE        AS ego_speed,
       payload['scene']['lighting']::STRING       AS lighting
FROM frame_payloads
ORDER BY logged_at;
```

使用 `::STRING` / `::DOUBLE` 进行类型转换可将 JSON 值暴露给常规 SQL 过滤器。Databend 还通过 `QUERY` 函数支持在此数据之上进行类似 Elasticsearch 的搜索——通过在变体字段前加上列名来引用它们（例如 `payload.objects.type`）。更多提示：[半结构化数据](/guides/load-data/load-semistructured/load-ndjson)。

---

## 3. 类似 Elasticsearch 的搜索
`QUERY` 使用 Elasticsearch/Lucene 语法，因此您可以组合布尔逻辑、范围、权重提升和列表。以下是在 EverDrive 负载上的几种模式：

### 数组匹配
查找检测到行人的帧：

```sql
SELECT frame_id
FROM frame_payloads
WHERE QUERY('payload.objects.type:pedestrian')
ORDER BY logged_at DESC
LIMIT 10;
```

### 布尔 AND
车辆行驶速度超过 30 km/h **且**检测到行人：

```sql
SELECT frame_id,
       payload['ego']['speed_kmh']::DOUBLE AS ego_speed
FROM frame_payloads
WHERE QUERY('payload.objects.type:pedestrian AND payload.ego.speed_kmh:[30 TO *]')
ORDER BY ego_speed DESC;
```

### 布尔 OR / 列表
夜间驾驶遇到紧急车辆或骑行者：

```sql
SELECT frame_id
FROM frame_payloads
WHERE QUERY('payload.scene.lighting:night AND payload.objects.type:(emergency_vehicle OR cyclist)');
```

### 数值范围
速度在 10–25 km/h 之间（包含边界）或严格在 25–40 km/h 之间：

```sql
SELECT frame_id,
       payload['ego']['speed_kmh'] AS speed
FROM frame_payloads
WHERE QUERY('payload.ego.speed_kmh:[10 TO 25] OR payload.ego.speed_kmh:{25 TO 40}')
ORDER BY speed;
```

### 权重提升
优先处理同时出现行人和车辆的帧，但强调行人项：

```sql
SELECT frame_id,
       SCORE() AS relevance
FROM frame_payloads
WHERE QUERY('payload.objects.type:pedestrian^2 AND payload.objects.type:vehicle')
ORDER BY relevance DESC
LIMIT 10;
```

查看[搜索函数](/sql/sql-functions/search-functions)了解 `QUERY`、`SCORE()` 和相关辅助函数支持的完整 Elasticsearch 语法。

---

## 4. 交叉引用帧事件
将查询结果与分析指南中创建的帧级风险评分进行关联。

```sql
WITH risky_frames AS (
  SELECT frame_id,
         payload['ego']['speed_kmh']::DOUBLE AS ego_speed
  FROM frame_payloads
  WHERE QUERY('payload.objects.type:pedestrian AND payload.ego.speed_kmh:[30 TO *]')
)
SELECT r.frame_id,
       e.event_type,
       e.risk_score,
       r.ego_speed
FROM risky_frames r
JOIN frame_events e USING (frame_id)
ORDER BY e.risk_score DESC;
```

由于 `frame_id` 在表之间共享，您可以立即从原始负载跳转到精选分析。