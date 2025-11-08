---
title: 使用任务（Task）自动化数据加载
sidebar_label: 任务（Task）
---

Task 是“把 SQL 交给 Databend 代跑”的方式。你可以让它按固定频率运行、在另一任务结束后运行，或者在某个 Stream 报告有增量时再运行。下面先看定义 Task 时需要关注的几个开关，再通过两个动手示例理解它如何和 Stream 配合。

## Task 构建要素

- **名称与计算仓库** – 每个 Task 都需要一个 Warehouse。
    ```sql
    CREATE TASK ingest_orders
    WAREHOUSE = 'etl_wh'
    AS SELECT 1;
    ```
- **触发方式** – `SCHEDULE = 2 MINUTE`、CRON，或 `AFTER <task>`（适用于 DAG）。
- **执行条件** – `WHEN STREAM_STATUS('mystream') = TRUE` 这类布尔表达式，只有条件满足才运行。
- **错误策略** – `SUSPEND_TASK_AFTER_NUM_FAILURES`、`ERROR_INTEGRATION` 等参数可在失败多次后暂停并发通知。
- **SQL 负载** – `AS` 后的内容就是 Task 要执行的语句，可以是一条 INSERT/COPY/MERGE，也可以是 BEGIN...END。

## 示例 1：定时 COPY

持续生成 Parquet 并导入表。记得把 `'etl_wh_small'` 换成你自己的 Warehouse。

### 步骤 1： 准备演示对象

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

### 步骤 2： Task 1 —— 生成文件

```sql
CREATE OR REPLACE TASK task_generate_data
    WAREHOUSE = 'etl_wh_small'
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

### 步骤 3： Task 2 —— 将文件导入表

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

### 步骤 4： 恢复 Task

```sql
ALTER TASK task_generate_data RESUME;
ALTER TASK task_consume_data RESUME;
```

### 步骤 5： 观察运行情况

```sql
SHOW TASKS LIKE 'task_%';
LIST @sensor_events_stage;
SELECT * FROM sensor_events ORDER BY event_time DESC LIMIT 5;
SELECT * FROM task_history('task_consume_data', 5);
```

### 步骤 6： 调整或改写 Task

```sql
ALTER TASK task_consume_data
    SET SCHEDULE = 30 SECOND,
        WAREHOUSE = 'etl_wh_medium';

ALTER TASK task_consume_data
    MODIFY AS
COPY INTO sensor_events
FROM @sensor_events_stage
FILE_FORMAT = (TYPE = PARQUET);

ALTER TASK task_consume_data RESUME;

SELECT *
FROM task_history('task_consume_data', 5)
ORDER BY completed_time DESC;
```

## 示例 2：Stream 条件 Task

只有当 Stream 报告“有增量”时才运行，避免空跑。

### 步骤 1： 创建 Stream 与结果表

```sql
CREATE OR REPLACE STREAM sensor_events_stream
    ON TABLE sensor_events
    APPEND_ONLY = false;

CREATE OR REPLACE TABLE sensor_events_latest AS
SELECT *
FROM sensor_events
WHERE 1 = 0;
```

### 步骤 2： 定义条件 Task

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

### 步骤 3： 查看增量与历史

```sql
SELECT *
FROM sensor_events_latest
ORDER BY event_time DESC
LIMIT 5;

SELECT *
FROM task_history('task_stream_merge', 5);
```

只要 `STREAM_STATUS('<database>.<stream_name>')` 返回 TRUE，Task 就会运行；否则保持暂停，直到下一批增量到达。
