---
title: SQL 分析（SQL Analytics）
---

> **场景（Scenario）：** EverDrive Smart Vision 的分析师整理了一组共享的驾驶会话（drive sessions）和关键帧（key frames），使每个下游工作负载都能查询相同的 ID，而无需在系统之间复制数据。

本教程将构建一个微型的 **EverDrive Smart Vision** 数据集，并展示 Databend 的单一查询优化器（Query Optimizer）如何在其余指南中发挥作用。您在此处创建的每个 ID（`SES-20240801-SEA01`、`FRAME-0001` …）都会重新出现在 JSON、向量、地理和 ETL 演练中，形成一致的自动驾驶故事。

## 1. 创建示例表
两张表分别记录测试会话和从行车记录仪视频中提取的重要帧。

```sql
CREATE OR REPLACE TABLE drive_sessions (
  session_id   VARCHAR,
  vehicle_id   VARCHAR,
  route_name   VARCHAR,
  start_time   TIMESTAMP,
  end_time     TIMESTAMP,
  weather      VARCHAR,
  camera_setup VARCHAR
);

CREATE OR REPLACE TABLE frame_events (
  frame_id     VARCHAR,
  session_id   VARCHAR,
  frame_index  INT,
  captured_at  TIMESTAMP,
  event_type   VARCHAR,
  risk_score   DOUBLE
);

INSERT INTO drive_sessions VALUES
  ('SES-20240801-SEA01', 'VEH-01', 'Seattle → Bellevue → Seattle', '2024-08-01 09:00', '2024-08-01 10:10', 'Sunny',     'Dual 1080p'),
  ('SES-20240802-SEA02', 'VEH-02', 'Downtown Night Loop',          '2024-08-02 20:15', '2024-08-02 21:05', 'Light Rain','Night Vision'),
  ('SES-20240803-SEA03', 'VEH-03', 'Harbor Industrial Route',      '2024-08-03 14:05', '2024-08-03 15:30', 'Overcast',  'Thermal + RGB');

INSERT INTO frame_events VALUES
  ('FRAME-0001', 'SES-20240801-SEA01', 120, '2024-08-01 09:32:15', 'SuddenBrake',          0.82),
  ('FRAME-0002', 'SES-20240801-SEA01', 342, '2024-08-01 09:48:03', 'CrosswalkPedestrian',  0.67),
  ('FRAME-0003', 'SES-20240802-SEA02',  88, '2024-08-02 20:29:41', 'NightLowVisibility',   0.59),
  ('FRAME-0004', 'SES-20240802-SEA02', 214, '2024-08-02 20:48:12', 'EmergencyVehicle',     0.73),
  ('FRAME-0005', 'SES-20240803-SEA03', 305, '2024-08-03 15:02:44', 'CyclistOvertake',      0.64);
```

> 需要回顾表 DDL？请参阅 [CREATE TABLE](/sql/sql-commands/ddl/table/ddl-create-table)。

---

## 2. 过滤最近会话
让分析聚焦在最新的驾驶记录上。

```sql
WITH recent_sessions AS (
  SELECT *
  FROM drive_sessions
  WHERE start_time >= DATEADD('day', -7, CURRENT_TIMESTAMP)
)
SELECT *
FROM recent_sessions
ORDER BY start_time DESC;
```

尽早过滤可加快后续连接（JOIN）与聚合（GROUP BY）。文档：[WHERE & CASE](/sql/sql-commands/query-syntax/query-select#where-clause)。

---

## 3. 连接（JOIN）
### INNER JOIN ... USING
合并会话元数据与帧级事件。

```sql
WITH recent_events AS (
  SELECT *
  FROM frame_events
  WHERE captured_at >= DATEADD('day', -7, CURRENT_TIMESTAMP)
)
SELECT e.frame_id,
       e.captured_at,
       e.event_type,
       e.risk_score,
       s.vehicle_id,
       s.route_name,
       s.weather
FROM recent_events e
JOIN drive_sessions s USING (session_id)
ORDER BY e.captured_at;
```

### NOT EXISTS（反连接/Anti Join）
查找缺少会话元数据的事件。

```sql
SELECT frame_id
FROM frame_events e
WHERE NOT EXISTS (
  SELECT 1
  FROM drive_sessions s
  WHERE s.session_id = e.session_id
);
```

### LATERAL FLATTEN（JSON 展开/Unnest）
将事件与 JSON 载荷中的检测对象合并。

```sql
SELECT e.frame_id,
       obj.value['type']::STRING AS object_type
FROM frame_events e
JOIN frame_payloads p USING (frame_id),
     LATERAL FLATTEN(p.payload['objects']) AS obj;
```

更多模式：[JOIN 参考](/sql/sql-commands/query-syntax/query-join)。

---

## 4. 分组（GROUP BY）
### GROUP BY route_name, event_type
标准 `GROUP BY` 比较路线与事件类型。

```sql
WITH recent_events AS (
  SELECT *
  FROM frame_events
  WHERE captured_at >= DATEADD('week', -4, CURRENT_TIMESTAMP)
)
SELECT route_name,
       event_type,
       COUNT(*)              AS event_count,
       AVG(risk_score)       AS avg_risk
FROM recent_events
JOIN drive_sessions USING (session_id)
GROUP BY route_name, event_type
ORDER BY avg_risk DESC, event_count DESC;
```

### GROUP BY ROLLUP
增加路线小计及总计。

```sql
SELECT route_name,
       event_type,
       COUNT(*) AS event_count,
       AVG(risk_score) AS avg_risk
FROM frame_events
JOIN drive_sessions USING (session_id)
GROUP BY ROLLUP(route_name, event_type)
ORDER BY route_name NULLS LAST, event_type;
```

### GROUP BY CUBE
生成路线与事件类型的所有组合。

```sql
SELECT route_name,
       event_type,
       COUNT(*) AS event_count,
       AVG(risk_score) AS avg_risk
FROM frame_events
JOIN drive_sessions USING (session_id)
GROUP BY CUBE(route_name, event_type)
ORDER BY route_name NULLS LAST, event_type;
```

---

## 5. 窗口函数（WINDOW FUNCTION）
### SUM(...) OVER（运行总计/running total）
用运行 `SUM` 跟踪每次驾驶的累积风险。

```sql
WITH session_event_scores AS (
  SELECT session_id,
         captured_at,
         risk_score
  FROM frame_events
)
SELECT session_id,
       captured_at,
       risk_score,
       SUM(risk_score) OVER (
         PARTITION BY session_id
         ORDER BY captured_at
         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
       ) AS cumulative_risk
FROM session_event_scores
ORDER BY session_id, captured_at;
```

### AVG(...) OVER（移动平均/moving average）
显示最近三个事件的风险移动平均：

```sql
WITH session_event_scores AS (
  SELECT session_id,
         captured_at,
         risk_score
  FROM frame_events
)
SELECT session_id,
       captured_at,
       risk_score,
       AVG(risk_score) OVER (
         PARTITION BY session_id
         ORDER BY captured_at
         ROWS BETWEEN 3 PRECEDING AND CURRENT ROW
       ) AS moving_avg_risk
FROM session_event_scores
ORDER BY session_id, captured_at;
```

窗口函数（Window Functions）让你以内联方式表达滚动总计或平均值。完整列表：[窗口函数（Window Functions）](/sql/sql-functions/window-functions)。

---

## 6. 聚合索引加速（Aggregating Index Acceleration）
用[聚合索引（Aggregating Index）](/guides/performance/aggregating-index)缓存繁重汇总，让仪表盘保持秒级响应。

```sql
CREATE OR REPLACE AGGREGATING INDEX idx_route_event_summary ON frame_events
AS
SELECT session_id,
       event_type,
       COUNT(*)        AS event_count,
       AVG(risk_score) AS avg_risk
FROM frame_events
GROUP BY session_id, event_type;
```

再次运行相同的汇总查询——优化器将自动命中索引：

```sql
SELECT s.route_name,
       e.event_type,
       COUNT(*)        AS event_count,
       AVG(e.risk_score) AS avg_risk
FROM frame_events e
JOIN drive_sessions s USING (session_id)
WHERE s.start_time >= DATEADD('week', -8, CURRENT_TIMESTAMP)
GROUP BY s.route_name, e.event_type
ORDER BY avg_risk DESC;
```

`EXPLAIN` 该语句可看到 `AggregatingIndex` 节点而非全表扫描。Databend 在新帧到达时自动刷新索引，无需额外 ETL 即可实现亚秒级仪表盘体验。

---

## 7. 存储过程自动化（Stored Procedure Automation）
将报告逻辑封装到存储过程（Stored Procedure）中，确保在定时任务中按预期执行。

```sql
CREATE OR REPLACE PROCEDURE generate_weekly_route_report(days_back INT)
RETURNS TABLE(route_name VARCHAR, event_count BIGINT, avg_risk DOUBLE)
LANGUAGE SQL
AS
$$
BEGIN
  RETURN TABLE (
    SELECT s.route_name,
           COUNT(*)              AS event_count,
           AVG(e.risk_score)     AS avg_risk
    FROM frame_events e
    JOIN drive_sessions s USING (session_id)
    WHERE e.captured_at >= DATEADD('day', -days_back, CURRENT_TIMESTAMP)
    GROUP BY s.route_name
  );
END;
$$;

CALL PROCEDURE generate_weekly_route_report(28);
```

返回的结果集可直接用于笔记本、ETL 任务或自动告警。了解更多：[存储过程脚本（Stored Procedure Scripting）](/sql/stored-procedure-scripting)。

---

至此，您已拥有完整闭环：摄取会话数据、过滤、连接、聚合、加速重查询、趋势分析并发布。只需替换过滤条件或连接方式，即可将同一套方案应用于驾驶员评分、传感器退化或算法对比等其他智能驾驶 KPI。