---
title: SQL 分析
---

> **场景：** EverDrive Smart Vision 分析师整理了一组共享的驾驶会话和关键帧，使每个下游工作负载都能查询相同的 ID，而无需在系统之间复制数据。

本教程构建了一个微型 **EverDrive Smart Vision** 数据集，并展示了 Databend 的单一优化器如何在其余指南中工作。您在此处创建的每个 ID（`SES-20240801-SEA01`、`FRAME-0001` …）都会在 JSON、向量、地理和 ETL 演练中重复出现，形成一致的自动驾驶故事。

## 1. 创建示例表
两个表捕获测试会话和从行车记录仪视频中提取的重要帧。

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

> 需要复习表 DDL？请参阅 [CREATE TABLE](/sql/sql-commands/ddl/table/ddl-create-table)。

---

## 2. 过滤最近的会话
将分析重点放在最近的驾驶上。

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

提前过滤可使后续的连接和聚合更快。文档：[WHERE & CASE](/sql/sql-commands/query-syntax/query-select#where-clause)。

---

## 3. JOIN（连接）
### INNER JOIN ... USING（内连接）
将会话元数据与帧级事件结合。

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

### NOT EXISTS（反连接）
查找会话元数据缺失的事件。

```sql
SELECT frame_id
FROM frame_events e
WHERE NOT EXISTS (
  SELECT 1
  FROM drive_sessions s
  WHERE s.session_id = e.session_id
);
```

### LATERAL FLATTEN（JSON 展开）
将事件与存储在 JSON 负载中的检测对象结合。

```sql
SELECT e.frame_id,
       obj.value['type']::STRING AS object_type
FROM frame_events e
JOIN frame_payloads p USING (frame_id),
     LATERAL FLATTEN(p.payload['objects']) AS obj;
```

更多模式：[JOIN 参考](/sql/sql-commands/query-syntax/query-join)。

---

## 4. GROUP BY（分组）
### GROUP BY route_name, event_type
标准 `GROUP BY` 用于比较路线和事件类型。

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
添加路线小计和总计。

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
生成路线和事件类型的所有组合。

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

## 5. WINDOW FUNCTION（窗口函数）
### SUM(...) OVER（累计总和）
使用累计 `SUM` 跟踪每次驾驶的累积风险。

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

### AVG(...) OVER（移动平均）
显示最近三个事件的风险移动平均值：

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

窗口函数（Window Function）允许您内联表达滚动总计或平均值。完整列表：[窗口函数](/sql/sql-functions/window-functions)。

---

## 6. 聚合索引加速
使用[聚合索引（Aggregating Index）](/guides/performance/aggregating-index)缓存繁重的汇总，使仪表盘（Dashboard）保持快速响应。

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

现在运行与之前相同的汇总查询（Query）——优化器将自动从索引中提取结果：

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

使用 `EXPLAIN` 查看该语句，可以看到 `AggregatingIndex` 节点而不是全表扫描。Databend 会在新帧到达时保持索引（Index）的新鲜度，无需额外的 ETL 作业即可提供亚秒级仪表盘。

---

## 7. 存储过程自动化
您还可以将报告逻辑包装在存储过程中，以便在计划作业期间按预期方式运行。

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

直接在笔记本、ETL 任务或自动警报中使用返回的结果集。了解更多：[存储过程脚本](/sql/stored-procedure-scripting)。

---

您现在拥有一个完整的循环：摄取会话数据、过滤、连接、聚合、加速繁重查询、随时间趋势分析并发布。交换过滤器或连接以将相同的方法应用于其他智能驾驶 KPI，如驾驶员评分、传感器退化或算法比较。