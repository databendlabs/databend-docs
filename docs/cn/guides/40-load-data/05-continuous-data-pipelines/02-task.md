---
title: 使用任务自动化数据加载
sidebar_label: 任务
---

任务就是一段可复用的 SQL。你可以设定它按固定频率运行、在其它任务完成后运行，或者在某个 Stream 有新数据时触发。Databend 的任务在数据增量加载、流式入湖、异常通知等场景中都非常有用。

## 任务构建模块

使用 [CREATE TASK](/sql/sql-commands/ddl/task/ddl-create_task) 即可定义任务，建议在创建前先明确以下要素：

1. **名称与计算集群** – 每个任务都运行在某个仓库（Warehouse）上，可随时调大/调小。
2. **触发方式** – 固定间隔、CRON、或 `AFTER <task>`（DAG）。
3. **执行条件** – 例如 `WHEN STREAM_STATUS('mystream') = TRUE`，只有当流里有增量时才运行。
4. **错误策略** – `SUSPEND_TASK_AFTER_NUM_FAILURES`、`ERROR_INTEGRATION` 等参数可让任务在多次失败后暂停并发通知。
5. **SQL 负载** – `AS` 后就是你要定期执行的 SQL，可以是一条 INSERT/COPY/MERGE，甚至多条语句包在 BEGIN/END 中。

```sql title="示例：每 2 分钟检查一次 Stream"
CREATE TASK sync_orders
WAREHOUSE = 'etl_wh'
SCHEDULE = 2 MINUTE
WHEN STREAM_STATUS('dim_orders_stream') = TRUE
AS
INSERT INTO ods_orders
SELECT * FROM dim_orders_stream;
```

## 示例 1：定时 COPY

这个示例持续生成 Parquet 文件并灌入表中。记得把 `'etl_wh_small'` 换成你自己的仓库。

### Step 1. 准备演示对象

```sql
CREATE DATABASE IF NOT EXISTS task_demo;
USE task_demo;

CREATE OR REPLACE TABLE sensor_events (
    event_time  TIMESTAMP,
    sensor_id   INT,
    temperature DOUBLE,
    humidity    DOUBLE
);

CREATE OR REPLACE STAGE sensor_events_stage;
```

### Step 2. 任务 1 —— 生成文件

```sql
CREATE OR REPLACE TASK task_generate_data
    WAREHOUSE = 'etl_wh_small' -- 换成你的仓库
    SCHEDULE = 1 MINUTE
AS
COPY INTO @sensor_events_stage
FROM (
    SELECT
        NOW()            AS event_time,
        number           AS sensor_id,
        20 + RAND() * 5  AS temperature,
        60 + RAND() * 10 AS humidity
    FROM numbers(100)
)
FILE_FORMAT = (TYPE = PARQUET);
```

### Step 3. 任务 2 —— COPY INTO 表

```sql
CREATE OR REPLACE TASK task_consume_data
    WAREHOUSE = 'etl_wh_small'
    SCHEDULE = 1 MINUTE
AS
COPY INTO sensor_events
FROM @sensor_events_stage
PATTERN = '.*[.]parquet'
FILE_FORMAT = (TYPE = PARQUET)
PURGE = TRUE;
```

### Step 4. 恢复任务

```sql
ALTER TASK task_generate_data RESUME;
ALTER TASK task_consume_data RESUME;
```

### Step 5. 监控运行情况

```sql
SHOW TASKS LIKE 'task_%';      -- 任务状态
LIST @sensor_events_stage;     -- Stage 中的文件
SELECT * FROM sensor_events
ORDER BY event_time DESC
LIMIT 5;                       -- 目标表增量

SELECT *
FROM task_history('task_consume_data', 5); -- 最近 5 次运行
```

### Step 6. 修改任务配置

```sql
ALTER TASK task_consume_data          -- 修改调度/仓库
    SET SCHEDULE = 30 SECOND,
        WAREHOUSE = 'etl_wh_medium';

ALTER TASK task_consume_data          -- 改写 SQL
    MODIFY AS
COPY INTO sensor_events
FROM @sensor_events_stage
FILE_FORMAT = (TYPE = PARQUET);

ALTER TASK task_consume_data RESUME;  -- SQL 改动后需重新 RESUME

SELECT *
FROM task_history('task_consume_data', 5)
ORDER BY completed_time DESC;
```

`task_history('<task_name>', <limit>)` 会返回运行时间、状态、查询 ID 等详细信息。

## 示例 2：基于 Stream 的条件任务

让任务只在 Stream 有增量时运行，避免“空跑”。依旧把仓库名称替换掉。

### Step 1. 准备 Stream 和目标表

```sql
CREATE OR REPLACE STREAM sensor_events_stream
    ON TABLE sensor_events
    APPEND_ONLY = false;

CREATE OR REPLACE TABLE sensor_events_latest AS
SELECT *
FROM sensor_events
WHERE 1 = 0;
```

### Step 2. 创建条件任务

```sql
CREATE OR REPLACE TASK task_stream_merge
    WAREHOUSE = 'etl_wh_small'
    SCHEDULE = 1 MINUTE
    WHEN STREAM_STATUS('task_demo.sensor_events_stream') = TRUE
AS
INSERT INTO sensor_events_latest
SELECT *
FROM sensor_events_stream;

ALTER TASK task_stream_merge RESUME;
```

### Step 3. 查看增量与历史

```sql
SELECT *
FROM sensor_events_latest
ORDER BY event_time DESC
LIMIT 5;

SELECT *
FROM task_history('task_stream_merge', 5);
```

只要 `STREAM_STATUS('<database>.<stream_name>')` 返回 TRUE，任务就会运行；否则保持暂停状态。

## 下一步怎么做？

- 继续阅读 [Stream 示例](01-stream.md) 了解如何产生增量。
- 在任务中添加 `WITH CONSUME` 或更多 SQL 逻辑，构建自己的 CDC/入湖流程。
