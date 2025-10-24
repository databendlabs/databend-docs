---
title: 湖仓 ETL
---

> **场景：** EverDrive Smart Vision 的数据工程团队将每批道路测试数据导出为 Parquet 文件，以便统一工作负载可以在 Databend 中加载、查询和丰富相同的遥测数据。

EverDrive 的数据摄取流程非常简单：

```
对象存储导出（例如 Parquet） → Stage → COPY INTO → （可选）Stream 与 Task
```

调整存储桶路径/凭证（如果格式不同，将 Parquet 替换为实际格式），然后粘贴以下命令。所有语法均遵循官方 [加载数据指南](https://docs.databend.cn/guides/load-data/)。

---

## 1. Stage

EverDrive 的数据工程团队每批导出四个文件——会话（sessions）、帧事件（frame events）、检测负载（detection payloads，包含嵌套 JSON 字段）和帧嵌入（frame embeddings）——到 S3 存储桶。本指南以 Parquet 为例，但您可通过调整 `FILE_FORMAT` 子句，灵活使用 CSV、JSON 或其他支持的格式。只需创建一次命名连接（Connection），即可在多个 Stage 中复用。

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

更多选项请参阅 [Create Stage](https://docs.databend.cn/sql/sql-commands/ddl/stage/ddl-create-stage)。

列出导出文件夹（本示例中为 Parquet）以确认其可见性：

```sql
LIST @drive_stage/sessions/;
LIST @drive_stage/frame-events/;
LIST @drive_stage/payloads/;
LIST @drive_stage/embeddings/;
```

---

## 2. 预览

在加载数据前，先查看 Parquet 文件内容，验证其 Schema 与样本记录。

```sql
SELECT *
FROM @drive_stage/sessions/session_2024_08_16.parquet
LIMIT 5;

SELECT *
FROM @drive_stage/frame-events/frame_events_2024_08_16.parquet
LIMIT 5;
```

如有需要，可对 payloads 和 embeddings 重复上述预览操作。Databend 会自动使用 Stage 上指定的文件格式。

---

## 3. COPY INTO

将各文件加载至指南中使用的对应表中。通过内联类型转换（inline casts）将源列映射到目标表列；以下投影以 Parquet 为例，但相同结构也适用于其他格式。

### 会话（Sessions）

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

### 帧事件（Frame Events）

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

### 检测负载（Detection Payloads）

负载文件包含嵌套列（`payload` 为 JSON 对象）。使用相同投影将其复制至 `frame_payloads` 表。

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

### 帧嵌入（Frame Embeddings）

```sql
COPY INTO frame_embeddings (frame_id, session_id, embedding, model_version, created_at)
FROM (
  SELECT frame_id::STRING,
         session_id::STRING,
         embedding::VECTOR(4),     -- 将 4 替换为实际嵌入维度
         model_version::STRING,
         created_at::TIMESTAMP
  FROM @drive_stage/embeddings/
)
FILE_FORMAT = (TYPE = 'PARQUET');
```

此批次数据现已对所有下游指南（分析/搜索/向量/地理）可见。

---

## 4. Stream（可选）

若希望下游作业在每次 `COPY INTO` 后自动响应新增数据，可在关键表（如 `frame_events`）上创建 Stream。Stream 的使用方式详见 [Continuous Pipeline → Streams](https://docs.databend.cn/guides/load-data/continuous-data-pipelines/stream)。

```sql
CREATE OR REPLACE STREAM frame_events_stream ON TABLE frame_events;

SELECT * FROM frame_events_stream;  -- 显示自上次消费后新增的行
```

处理完 Stream 后，请调用 `CONSUME STREAM frame_events_stream;`（或将数据插入其他表），以推进消费偏移量。

---

## 5. Task（可选）

Task 可按计划执行**单条 SQL 语句**。建议为每个表创建独立 Task（也可通过存储过程统一调度）。

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

-- 对 frame_payloads 和 frame_embeddings 重复上述操作
```

有关 cron 表达式、任务依赖与错误处理，请参阅 [Continuous Pipeline → Tasks](https://docs.databend.cn/guides/load-data/continuous-data-pipelines/task)。