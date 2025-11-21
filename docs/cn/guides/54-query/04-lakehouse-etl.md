---
title: Lakehouse ETL
---

> **场景：** CityDrive 的数据工程团队将每一批行车记录仪数据导出为 Parquet 格式（包含视频、帧事件、元数据 JSON、向量嵌入、GPS 轨迹、交通信号灯距离），并希望通过一条 COPY 管道将这些数据更新到 Databend 的共享表中。

加载流程非常直观：

```
对象存储 -> STAGE -> COPY INTO 表 -> (可选) STREAMS/TASKS
```

请根据您的环境调整存储桶路径或文件格式，然后粘贴以下命令。语法与 [数据加载指南](/guides/load-data/) 保持一致。

---

## 1. 创建 Stage
创建一个可复用的 Stage，指向存储 CityDrive 导出数据的存储桶。请将凭证/URL 替换为您自己的账户信息；本例使用 Parquet 格式，但只要指定相应的 `FILE_FORMAT`，任何支持的格式均可使用。

```sql
CREATE OR REPLACE CONNECTION citydrive_s3
  STORAGE_TYPE = 's3'
  ACCESS_KEY_ID = '<AWS_ACCESS_KEY_ID>'
  SECRET_ACCESS_KEY = '<AWS_SECRET_ACCESS_KEY>';

CREATE OR REPLACE STAGE citydrive_stage
  URL = 's3://citydrive-lakehouse/raw/'
  CONNECTION = (CONNECTION_NAME = 'citydrive_s3')
  FILE_FORMAT = (TYPE = 'PARQUET');
```

> [!IMPORTANT]
> 请务必将占位符 AWS 密钥和存储桶 URL 替换为您环境中的真实值。如果没有有效的凭证，`LIST`、`SELECT ... FROM @citydrive_stage` 和 `COPY INTO` 语句将因 S3 返回 `InvalidAccessKeyId`/403 错误而失败。

快速完整性检查：

```sql
LIST @citydrive_stage/videos/;
LIST @citydrive_stage/frame-events/;
LIST @citydrive_stage/manifests/;
LIST @citydrive_stage/frame-embeddings/;
LIST @citydrive_stage/frame-locations/;
LIST @citydrive_stage/traffic-lights/;
```

---

## 2. 预览文件
在正式加载之前，使用 `SELECT` 查询 Stage 中的文件，以确认 Schema 和样本行数据。

```sql
SELECT *
FROM @citydrive_stage/videos/capture_date=2025-01-01/videos.parquet
LIMIT 5;

SELECT *
FROM @citydrive_stage/frame-events/batch_2025_01_01.parquet
LIMIT 5;
```

Databend 会根据 Stage 定义自动推断格式，因此此处无需指定额外选项。

---

## 3. COPY INTO 统一表
每个导出文件对应指南中使用的共享表之一。使用内联转换（Inline Casts）可以保持 Schema 的一致性，即使上游字段顺序发生变化也不受影响。

### `citydrive_videos`
```sql
COPY INTO citydrive_videos (video_id, vehicle_id, capture_date, route_name, weather, camera_source, duration_sec)
FROM (
  SELECT video_id::STRING,
         vehicle_id::STRING,
         capture_date::DATE,
         route_name::STRING,
         weather::STRING,
         camera_source::STRING,
         duration_sec::INT
  FROM @citydrive_stage/videos/
)
FILE_FORMAT = (TYPE = 'PARQUET');
```

### `frame_events`
```sql
COPY INTO frame_events (frame_id, video_id, frame_index, collected_at, event_tag, risk_score, speed_kmh)
FROM (
  SELECT frame_id::STRING,
         video_id::STRING,
         frame_index::INT,
         collected_at::TIMESTAMP,
         event_tag::STRING,
         risk_score::DOUBLE,
         speed_kmh::DOUBLE
  FROM @citydrive_stage/frame-events/
)
FILE_FORMAT = (TYPE = 'PARQUET');
```

### `frame_metadata_catalog`
```sql
COPY INTO frame_metadata_catalog (doc_id, meta_json, captured_at)
FROM (
  SELECT doc_id::STRING,
         meta_json::VARIANT,
         captured_at::TIMESTAMP
  FROM @citydrive_stage/manifests/
)
FILE_FORMAT = (TYPE = 'PARQUET');
```

### `frame_embeddings`
```sql
COPY INTO frame_embeddings (frame_id, video_id, sensor_view, embedding, encoder_build, created_at)
FROM (
  SELECT frame_id::STRING,
         video_id::STRING,
         sensor_view::STRING,
         embedding::VECTOR(768), -- 请替换为您的实际维度
         encoder_build::STRING,
         created_at::TIMESTAMP
  FROM @citydrive_stage/frame-embeddings/
)
FILE_FORMAT = (TYPE = 'PARQUET');
```

### `frame_geo_points`
```sql
COPY INTO frame_geo_points (video_id, frame_id, position_wgs84, solution_grade, source_system, created_at)
FROM (
  SELECT video_id::STRING,
         frame_id::STRING,
         position_wgs84::GEOMETRY,
         solution_grade::INT,
         source_system::STRING,
         created_at::TIMESTAMP
  FROM @citydrive_stage/frame-locations/
)
FILE_FORMAT = (TYPE = 'PARQUET');
```

### `signal_contact_points`
```sql
COPY INTO signal_contact_points (node_id, signal_position, video_id, frame_id, frame_position, distance_m, created_at)
FROM (
  SELECT node_id::STRING,
         signal_position::GEOMETRY,
         video_id::STRING,
         frame_id::STRING,
         frame_position::GEOMETRY,
         distance_m::DOUBLE,
         created_at::TIMESTAMP
  FROM @citydrive_stage/traffic-lights/
)
FILE_FORMAT = (TYPE = 'PARQUET');
```

在此步骤之后，每个下游工作负载——SQL 分析、Elasticsearch `QUERY()`、向量相似度、地理空间过滤——都将读取完全相同的数据。

---

## 4. 使用 Streams 进行增量处理（可选）
如果希望下游任务仅消费自上一批次以来新增的行，可以使用 Streams。

```sql
CREATE OR REPLACE STREAM frame_events_stream ON TABLE frame_events;

SELECT * FROM frame_events_stream;   -- 显示新复制的行
-- …处理行…
SELECT * FROM frame_events_stream WITH CONSUME;  -- 推进偏移量
```

`WITH CONSUME` 确保 Stream 游标在行被处理后向前移动。参考文档：[Streams](/guides/load-data/continuous-data-pipelines/stream)。

---

## 5. 使用 Tasks 进行定时加载（可选）
Task 可以按计划运行**一条 SQL 语句**。您可以为每个表创建轻量级的 Task，或者如果更喜欢单一入口，也可以将逻辑封装在存储过程中。

```sql
CREATE OR REPLACE TASK task_load_citydrive_videos
  WAREHOUSE = 'default'
  SCHEDULE = 10 MINUTE
AS
  COPY INTO citydrive_videos (video_id, vehicle_id, capture_date, route_name, weather, camera_source, duration_sec)
  FROM (
    SELECT video_id::STRING,
           vehicle_id::STRING,
           capture_date::DATE,
           route_name::STRING,
           weather::STRING,
           camera_source::STRING,
           duration_sec::INT
    FROM @citydrive_stage/videos/
  )
  FILE_FORMAT = (TYPE = 'PARQUET');

ALTER TASK task_load_citydrive_videos RESUME;

CREATE OR REPLACE TASK task_load_frame_events
  WAREHOUSE = 'default'
  SCHEDULE = 10 MINUTE
 AS
  COPY INTO frame_events (frame_id, video_id, frame_index, collected_at, event_tag, risk_score, speed_kmh)
  FROM (
    SELECT frame_id::STRING,
           video_id::STRING,
           frame_index::INT,
           collected_at::TIMESTAMP,
           event_tag::STRING,
           risk_score::DOUBLE,
           speed_kmh::DOUBLE
    FROM @citydrive_stage/frame-events/
  )
  FILE_FORMAT = (TYPE = 'PARQUET');

ALTER TASK task_load_frame_events RESUME;
```

使用相同的模式为 `frame_metadata_catalog`、嵌入或 GPS 数据添加更多 Task。完整选项请参考：[Tasks](/guides/load-data/continuous-data-pipelines/task)。

---

一旦这些任务运行起来，统一工作负载系列中的每个指南都将读取相同的 CityDrive 表——无需额外的 ETL 层，也无需重复存储数据。
