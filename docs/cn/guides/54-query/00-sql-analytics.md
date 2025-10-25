---
title: SQL 分析（SQL Analytics）
---

> **场景：**CityDrive 将每一次行车记录仪运行结果加载到共享关系表中，以便分析人员能够针对所有下游工作负载筛选、关联并聚合相同的 `video_id` / `frame_id` 对。

本指南建模了该目录的关系部分，并突出展示实用的 SQL 构建块。这里的示例 ID 会在 JSON、向量、地理以及 ETL 指南中再次出现。

## 1. 创建基础表
`citydrive_videos` 存储片段元数据，而 `frame_events` 记录从每个片段中提取的关键帧。

```sql
CREATE OR REPLACE TABLE citydrive_videos (
    video_id       STRING,
    vehicle_id     STRING,
    capture_date   DATE,
    route_name     STRING,
    weather        STRING,
    camera_source  STRING,
    duration_sec   INT
);

CREATE OR REPLACE TABLE frame_events (
    frame_id     STRING,
    video_id     STRING,
    frame_index  INT,
    collected_at TIMESTAMP,
    event_tag    STRING,
    risk_score   DOUBLE,
    speed_kmh    DOUBLE
);

INSERT INTO citydrive_videos VALUES
  ('VID-20250101-001', 'VEH-21', '2025-01-01', 'Downtown Loop',       'Rain',     'roof_cam', 3580),
  ('VID-20250101-002', 'VEH-05', '2025-01-01', 'Port Perimeter',      'Overcast', 'front_cam',4020),
  ('VID-20250102-001', 'VEH-21', '2025-01-02', 'Airport Connector',   'Clear',    'front_cam',3655),
  ('VID-20250103-001', 'VEH-11', '2025-01-03', 'CBD Night Sweep',     'LightFog', 'rear_cam', 3310);

INSERT INTO frame_events VALUES
  ('FRAME-0101', 'VID-20250101-001', 125, '2025-01-01 08:15:21', 'hard_brake',      0.81, 32.4),
  ('FRAME-0102', 'VID-20250101-001', 416, '2025-01-01 08:33:54', 'pedestrian',      0.67, 24.8),
  ('FRAME-0201', 'VID-20250101-002', 298, '2025-01-01 11:12:02', 'lane_merge',      0.74, 48.1),
  ('FRAME-0301', 'VID-20250102-001', 188, '2025-01-02 09:44:18', 'hard_brake',      0.59, 52.6),
  ('FRAME-0401', 'VID-20250103-001', 522, '2025-01-03 21:18:07', 'night_lowlight',  0.63, 38.9);
```

文档： [CREATE TABLE](/sql/sql-commands/ddl/table/ddl-create-table)、[INSERT](/sql/sql-commands/dml/dml-insert)。

---

## 2. 筛选工作集
将调查重点放在最新的行驶记录上。

```sql
WITH recent_videos AS (
    SELECT *
    FROM citydrive_videos
    WHERE capture_date >= DATEADD('day', -3, TODAY())
)
SELECT v.video_id,
       v.route_name,
       v.weather,
       COUNT(f.frame_id) AS flagged_frames
FROM recent_videos v
LEFT JOIN frame_events f USING (video_id)
GROUP BY v.video_id, v.route_name, v.weather
ORDER BY flagged_frames DESC;
```

文档： [DATEADD](/sql/sql-functions/datetime-functions/date-add)、[GROUP BY](/sql/sql-commands/query-syntax/query-select#group-by-clause)。

---

## 3. JOIN 模式
### 用于帧上下文的内连接（INNER JOIN）
```sql
SELECT f.frame_id,
       f.event_tag,
       f.risk_score,
       v.route_name,
       v.camera_source
FROM frame_events AS f
JOIN citydrive_videos AS v USING (video_id)
ORDER BY f.collected_at;
```

### 反连接（Anti Join）质量检查
```sql
SELECT frame_id
FROM frame_events f
WHERE NOT EXISTS (
    SELECT 1
    FROM citydrive_videos v
    WHERE v.video_id = f.video_id
);
```

### 使用 LATERAL FLATTEN 处理嵌套检测
```sql
SELECT f.frame_id,
       obj.value['type']::STRING AS detected_type,
       obj.value['confidence']::DOUBLE AS confidence
FROM frame_events AS f
JOIN frame_payloads AS p ON f.frame_id = p.frame_id,
     LATERAL FLATTEN(input => p.payload['objects']) AS obj
WHERE f.event_tag = 'pedestrian'
ORDER BY confidence DESC;
```

文档： [JOIN](/sql/sql-commands/query-syntax/query-join)、[FLATTEN](/sql/sql-functions/table-functions/flatten)。

---

## 4. 车队 KPI 聚合
### 按路线划分的行为
```sql
SELECT v.route_name,
       f.event_tag,
       COUNT(*) AS occurrences,
       AVG(f.risk_score) AS avg_risk
FROM frame_events f
JOIN citydrive_videos v USING (video_id)
GROUP BY v.route_name, f.event_tag
ORDER BY avg_risk DESC, occurrences DESC;
```

### ROLLUP 汇总
```sql
SELECT v.route_name,
       f.event_tag,
       COUNT(*) AS occurrences
FROM frame_events f
JOIN citydrive_videos v USING (video_id)
GROUP BY ROLLUP(v.route_name, f.event_tag)
ORDER BY v.route_name NULLS LAST, f.event_tag;
```

### 针对路线 × 天气覆盖的 CUBE
```sql
SELECT v.route_name,
       v.weather,
       COUNT(DISTINCT v.video_id) AS videos
FROM citydrive_videos v
GROUP BY CUBE(v.route_name, v.weather)
ORDER BY v.route_name NULLS LAST, v.weather NULLS LAST;
```

---

## 5. 窗口函数（Window Functions）
### 按视频计算的风险累计
```sql
WITH ordered_events AS (
    SELECT video_id, collected_at, risk_score
    FROM frame_events
)
SELECT video_id,
       collected_at,
       risk_score,
       SUM(risk_score) OVER (
         PARTITION BY video_id
         ORDER BY collected_at
         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
       ) AS cumulative_risk
FROM ordered_events
ORDER BY video_id, collected_at;
```

### 最近帧的滚动平均
```sql
SELECT video_id,
       frame_id,
       frame_index,
       risk_score,
       AVG(risk_score) OVER (
         PARTITION BY video_id
         ORDER BY frame_index
         ROWS BETWEEN 3 PRECEDING AND CURRENT ROW
       ) AS rolling_avg_risk
FROM frame_events
ORDER BY video_id, frame_index;
```

文档： [窗口函数（Window functions）](/sql/sql-functions/window-functions)。

---

## 6. 聚合索引（Aggregating Index）加速
为仪表盘（Dashboard）持久保存常用汇总结果。

```sql
CREATE OR REPLACE AGGREGATING INDEX idx_video_event_summary
AS
SELECT video_id,
       event_tag,
       COUNT(*)        AS event_count,
       AVG(risk_score) AS avg_risk
FROM frame_events
GROUP BY video_id, event_tag;
```

当分析人员重复执行熟悉的 KPI 时，查询优化器（Query Optimizer）会直接从该索引提供结果：

```sql
SELECT v.route_name,
       e.event_tag,
       COUNT(*)        AS event_count,
       AVG(e.risk_score) AS avg_risk
FROM frame_events e
JOIN citydrive_videos v USING (video_id)
WHERE v.capture_date >= DATEADD('day', -14, TODAY())
GROUP BY v.route_name, e.event_tag
ORDER BY avg_risk DESC;
```

文档： [聚合索引（Aggregating Index）](/guides/performance/aggregating-index) 与 [EXPLAIN](/sql/sql-commands/explain-cmds/explain)。

---

## 7. 存储过程（Stored Procedure）自动化
封装逻辑，使计划任务始终生成一致的报告。

```sql
CREATE OR REPLACE PROCEDURE citydrive_route_report(days_back UINT8)
RETURNS TABLE(route_name STRING, event_tag STRING, event_count BIGINT, avg_risk DOUBLE)
LANGUAGE SQL
AS
$$
BEGIN
  RETURN TABLE (
    SELECT v.route_name,
           e.event_tag,
           COUNT(*)          AS event_count,
           AVG(e.risk_score) AS avg_risk
    FROM frame_events e
    JOIN citydrive_videos v USING (video_id)
    WHERE v.capture_date >= DATEADD('day', -:days_back, TODAY())
    GROUP BY v.route_name, e.event_tag
  );
END;
$$;

CALL PROCEDURE citydrive_route_report(30);
```

存储过程（Stored Procedure）可以手动触发，通过 [TASKS](/guides/load-data/continuous-data-pipelines/task) 触发，或由编排工具触发。

---

借助这些表和模式，CityDrive 其余指南可以引用完全相同的 `video_id` 主键——`frame_metadata_catalog` 用于 JSON 搜索，帧嵌入用于相似度分析，GPS 位置用于地理查询，以及单一的 ETL 流程保持它们之间的同步。