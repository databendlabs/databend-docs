---
title: 湖仓 ETL
---

> **场景：** EverDrive Smart Vision 的数据工程团队将每批道路测试数据导出为 Parquet 文件，以便统一工作负载可以在 Databend 中加载、查询和丰富相同的遥测数据。

EverDrive 的数据摄取流程非常简单：

```
对象存储导出（例如 Parquet）→ 暂存区（Stage）→ COPY INTO → （可选）流（Stream）和任务（Task）
```

调整存储桶路径/凭证（如果格式不同，请将 Parquet 替换为实际格式），然后粘贴以下命令。所有语法与官方[加载数据指南](/cn/guides/load-data/)一致。

---

## 1. 暂存区（Stage）
EverDrive 的数据工程团队将每批四个文件——会话、帧事件、检测负载（包含嵌套 JSON 字段）和帧嵌入——导出到 S3 存储桶。本指南使用 Parquet 作为示例格式，但您可以通过调整 `FILE_FORMAT` 子句来使用 CSV、JSON 或其他支持的格式。创建一次命名连接，然后在各个暂存区中重复使用。

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

有关更多选项，请参阅[创建暂存区](/cn/sql/sql-commands/ddl/stage/ddl-create-stage)。

列出导出文件夹（本演练中为 Parquet）以确认它们可见：

```sql
LIST @drive_stage/sessions/;
LIST @drive_stage/frame-events/;
LIST @drive_stage/payloads/;
LIST @drive_stage/embeddings/;
```

---

## 2. 预览
在加载任何数据之前，查看 Parquet 文件内部以验证架构和样本记录。

```sql
SELECT *
FROM @drive_stage/sessions/session_2024_08_16.parquet
LIMIT 5;

SELECT *
FROM @drive_stage/frame-events/frame_events_2024_08_16.parquet
LIMIT 5;
```

根据需要对负载和嵌入重复预览。Databend 会自动使用暂存区上指定的文件格式。

---

## 3. COPY INTO
将每个文件加载到本指南中使用的表中。使用内联类型转换将传入列映射到表列；以下投影假定为 Parquet，但相同的结构适用于其他格式。

### 会话
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

### 帧事件
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

### 检测负载
负载文件包含嵌套列（`payload` 列是一个 JSON 对象）。使用相同的投影将它们复制到 `frame_payloads` 表中。

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

### 帧嵌入
```sql
COPY INTO frame_embeddings (frame_id, session_id, embedding, model_version, created_at)
FROM (
  SELECT frame_id::STRING,
         session_id::STRING,
         embedding::VECTOR(4),     -- 将 4 替换为您的实际嵌入维度
         model_version::STRING,
         created_at::TIMESTAMP
  FROM @drive_stage/embeddings/
)
FILE_FORMAT = (TYPE = 'PARQUET');
```

所有下游指南（分析/搜索/向量/地理）现在都可以看到此批次数据。

---

## 4. 流（Stream）（可选）
如果您希望下游作业在每次 `COPY INTO` 后对新行做出反应，请在关键表（例如 `frame_events`）上创建流。流的使用遵循[持续数据流水线 → 流](/cn/guides/load-data/continuous-data-pipelines/stream)指南。

```sql
CREATE OR REPLACE STREAM frame_events_stream ON TABLE frame_events;

SELECT * FROM frame_events_stream;  -- 显示自上次消费以来的新行
```

处理流后，调用 `CONSUME STREAM frame_events_stream;`（或将行插入另一个表）以推进偏移量。

---

## 5. 任务（Task）（可选）
任务按计划执行**一条 SQL 语句**。为每个表创建一个小任务（或者如果您更喜欢单个入口点，可以调用存储过程）。

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

-- 对 frame_payloads 和 frame_embeddings 重复此操作
```

有关 cron 语法、依赖项和错误处理，请参阅[持续数据流水线 → 任务](/cn/guides/load-data/continuous-data-pipelines/task)。