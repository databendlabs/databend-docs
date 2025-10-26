---
title: SQL 分析
---

> **场景：** CityDrive 会把所有行车视频写入共享的关系表,分析师因此可以在同一批 `video_id` / `frame_id` 上做过滤、连接与聚合,供后续的 JSON、向量、地理和 ETL 负载共用。

本演练建模了 CityDrive 编目中的关系层,并串起常见的 SQL 积木。这里出现的示例 ID 会在其余指南中再次用到。

## 1. 创建基础表
`citydrive_videos` 保存视频级元数据,而 `frame_events` 记录每段视频里抽出的关键帧。

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

文档：[CREATE TABLE](/sql/sql-commands/ddl/table/ddl-create-table)、[INSERT](/sql/sql-commands/dml/dml-insert)。

---

## 2. 只看最新车次
把调查范围控制在最近 3 天的导航路线。

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

文档：[DATEADD](/sql/sql-functions/datetime-functions/date-add)、[GROUP BY](/sql/sql-commands/query-syntax/query-select#group-by-clause)。

---

## 3. 常见 JOIN 模式
### INNER JOIN：取帧上下文
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

### NOT EXISTS：做 QA
```sql
SELECT frame_id
FROM frame_events f
WHERE NOT EXISTS (
    SELECT 1
    FROM citydrive_videos v
    WHERE v.video_id = f.video_id
);
```

### LATERAL FLATTEN：展开 JSON 检测
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

文档：[JOIN](/sql/sql-commands/query-syntax/query-join)、[FLATTEN](/sql/sql-functions/table-functions/flatten)。

---

## 4. 车队 KPI 聚合
### 分路线的行为统计
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

### ROLLUP 总计
```sql
SELECT v.route_name,
       f.event_tag,
       COUNT(*) AS occurrences
FROM frame_events f
JOIN citydrive_videos v USING (video_id)
GROUP BY ROLLUP(v.route_name, f.event_tag)
ORDER BY v.route_name NULLS LAST, f.event_tag;
```

### CUBE：路线 × 天气 覆盖
```sql
SELECT v.route_name,
       v.weather,
       COUNT(DISTINCT v.video_id) AS videos
FROM citydrive_videos v
GROUP BY CUBE(v.route_name, v.weather)
ORDER BY v.route_name NULLS LAST, v.weather NULLS LAST;
```

---

## 5. 窗口函数
### 单次视频的风险累计
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

### 帧级滑动平均
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

窗口函数可以在 SQL 中直接表达滚动求和或滑动平均。完整列表见：[窗口函数](/sql/sql-functions/window-functions)。

---

## 6. 聚合索引提速
使用 [Aggregating Index](/guides/performance/aggregating-index) 缓存高频汇总,让仪表盘查询避开全表扫描。

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

当你再次运行相同的汇总（如路线事件分布）时,`EXPLAIN` 会显示 `AggregatingIndex` 节点,说明查询已经命中上面的摘要副本。索引会在新的帧写入后自动刷新,无须额外 ETL 即可保持秒级体验。
