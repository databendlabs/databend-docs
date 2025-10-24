---
title: 湖仓 ETL
---

> **场景：** EverDrive Smart Vision 的数据工程团队将每批路测数据导出为 Parquet 文件，以便统一工作负载在 Databend 中加载、查询并丰富同一份遥测数据。

EverDrive 的摄取链路非常简单：

```
对象存储导出（Parquet 为例）→ Stage → COPY INTO →（可选）Stream & Task
```

调整桶路径/凭证（如格式不同，把 Parquet 换成实际格式），然后粘贴下方命令。所有语法均与官方[加载数据指南](/guides/load-data/)保持一致。

---

## 1. Stage
EverDrive 的数据工程团队每批导出四个文件——会话、帧事件、检测载荷（含嵌套 JSON 字段）和帧向量——到 S3 桶。本指南以 Parquet 为例，但只需调整 `FILE_FORMAT` 子句即可使用 CSV、JSON 或其他支持的格式。一次性创建命名连接，即可在多个 Stage 中复用。

```sql
CREATE OR REPLACE CONNECTION everdrive_s3
  STORAGE_TYPE = 's3'
  ACCESS_KEY_ID = '<AWS_ACCESS_KEY_ID>'
  SECRET_ACCESS_KEY = '<AWS_SECRET_ACCESS_KEY>';

CREATE OR REPLACE STAGE drive_stage
  URL = 's3://everdrive-lakehouse/raw/'
  CONNECTION = (CONNECTION_NAME = 'everdrive_s3')
  FILE_FORMAT = (TYPE = 'PARQUET');
```

更多选项见[创建 Stage](/sql/sql-commands/ddl/stage/ddl-create-stage)。

列出导出文件夹（本示例为 Parquet）以确认可见：

```sql
LIST @drive_stage/sessions/;
LIST @drive_stage/frame-events/;
LIST @drive_stage/payloads/;
LIST @drive_stage/embeddings/;
```

---

## 2. 预览
加载前，先查看 Parquet 文件内部，验证 schema 并抽样记录。

```sql
SELECT *
FROM @drive_stage/sessions/session_2024_08_16.parquet
LIMIT 5;

SELECT *
FROM @drive_stage/frame-events/frame_events_2024_08_16.parquet
LIMIT 5;
```

按需对载荷和向量重复预览。Databend 会自动使用 Stage 上指定的文件格式。

---

## 3. COPY INTO
将各文件加载到指南使用的表中。通过内联 CAST 把输入列映射到表列；下方投影以 Parquet 为例，其他格式同理。

### Sessions
```sql
COPY INTO drive_sessions (session_id, vehicle_id, route_name, start_time, end_time, weather, camera_setup)
FROM (
  SELECT session_id::STRING,
         vehicle_id::STRING,
         route_name::STRING,
         start_time::TIMESTAMP,
         end_time::TIMESTAMP,
         weather::STRING,
         camera_setup::STRING
  FROM @drive_stage/sessions/
)
FILE_FORMAT = (TYPE = 'PARQUET');
```

### Frame Events
```sql
COPY INTO frame_events (frame_id, session_id, frame_index, captured_at, event_type, risk_score)
FROM (
  SELECT frame_id::STRING,
         session_id::STRING,
         frame_index::INT,
         captured_at::TIMESTAMP,
         event_type::STRING,
         risk_score::DOUBLE
  FROM @drive_stage/frame-events/
)
FILE_FORMAT = (TYPE = 'PARQUET');
```

### Detection Payloads
载荷文件含嵌套列（`payload` 列为 JSON 对象）。使用相同投影将其复制到 `frame_payloads` 表。

```sql
COPY INTO frame_payloads (frame_id, run_stage, payload, logged_at)
FROM (
  SELECT frame_id::STRING,
         run_stage::STRING,
         payload,
         logged_at::TIMESTAMP
  FROM @drive_stage/payloads/
)
FILE_FORMAT = (TYPE = 'PARQUET');
```

### Frame Embeddings
```sql
COPY INTO frame_embeddings (frame_id, session_id, embedding, model_version, created_at)
FROM (
  SELECT frame_id::STRING,
         session_id::STRING,
         embedding::VECTOR(4),     -- 将 4 替换为实际向量维度
         model_version::STRING,
         created_at::TIMESTAMP
  FROM @drive_stage/embeddings/
)
FILE_FORMAT = (TYPE = 'PARQUET');
```

下游所有指南（分析/搜索/向量/地理）均可看到本批次数据。

---

## 4. Stream（可选）
若希望下游作业在每次 `COPY INTO` 后响应新行，可在关键表（如 `frame_events`）上创建 Stream。用法参见[持续管道 → Stream](/guides/load-data/continuous-data-pipelines/stream)。

```sql
CREATE OR REPLACE STREAM frame_events_stream ON TABLE frame_events;

SELECT * FROM frame_events_stream;  -- 显示自上次消费后的新行
```

处理完 Stream 后，执行 `CONSUME STREAM frame_events_stream;`（或将行插入另一表）以推进偏移。

---

## 5. Task（可选）
Task 按调度执行**一条 SQL 语句**。可为每张表创建小 Task（或调用存储过程作为统一入口）。

```sql
CREATE OR REPLACE TASK task_load_sessions
  WAREHOUSE = 'default'
  SCHEDULE = 5 MINUTE
AS
  COPY INTO drive_sessions (session_id, vehicle_id, route_name, start_time, end_time, weather, camera_setup)
  FROM (
    SELECT session_id::STRING,
           vehicle_id::STRING,
           route_name::STRING,
           start_time::TIMESTAMP,
           end_time::TIMESTAMP,
           weather::STRING,
           camera_setup::STRING
    FROM @drive_stage/sessions/
  )
  FILE_FORMAT = (TYPE = 'PARQUET');

ALTER TASK task_load_sessions RESUME;

CREATE OR REPLACE TASK task_load_frame_events
  WAREHOUSE = 'default'
  SCHEDULE = 5 MINUTE
AS
  COPY INTO frame_events (frame_id, session_id, frame_index, captured_at, event_type, risk_score)
  FROM (
    SELECT frame_id::STRING,
           session_id::STRING,
           frame_index::INT,
           captured_at::TIMESTAMP,
           event_type::STRING,
           risk_score::DOUBLE
    FROM @drive_stage/frame-events/
  )
  FILE_FORMAT = (TYPE = 'PARQUET');

ALTER TASK task_load_frame_events RESUME;

-- 对 frame_payloads 和 frame_embeddings 重复
```

cron 语法、依赖与错误处理参见[持续管道 → Task](/guides/load-data/continuous-data-pipelines/task)。