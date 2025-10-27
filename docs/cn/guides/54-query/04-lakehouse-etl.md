---
title: 湖仓 ETL
---

> **场景：** CityDrive 的数据工程团队会把每一批行车录像导出成 Parquet（视频、帧事件、JSON 元数据、嵌入、GPS 轨迹、信号灯距离）,希望用一套 COPY 流程将共享表刷新到 Databend。

加载闭环非常直接：

```
对象存储 → STAGE → COPY INTO 表 → （可选）STREAMS / TASKS
```

根据自己的桶路径或格式进行调整,然后直接执行下面的 SQL。语法与[加载数据指南](/guides/load-data/)一致。

---

## 1. 创建 Stage
为 CityDrive 导出的桶创建可复用的 Stage。示例使用 Parquet,你可以改成任意受支持的格式。

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
> 请把示例中的 AWS 密钥与桶地址替换成真实值,否则 `LIST`、`SELECT ... FROM @citydrive_stage`、`COPY INTO` 都会因为 403/`InvalidAccessKeyId` 失败。

快速检查：

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
在装载前对 Stage 做一次 `SELECT`,确认 schema 与样例行。

```sql
SELECT *
FROM @citydrive_stage/videos/capture_date=2025-01-01/videos.parquet
LIMIT 5;

SELECT *
FROM @citydrive_stage/frame-events/batch_2025_01_01.parquet
LIMIT 5;
```

Databend 会沿用 Stage 定义的文件格式,因此无需额外参数。

---

## 3. COPY INTO 统一表
每份导出都对应指南里的一张共享表。内联的 `::TYPE` 转换可以保证上下游 schema 一致。

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
         embedding::VECTOR(768), -- 根据实际维度调整
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

完成后,SQL 分析、`QUERY()` 搜索、向量相似、地理过滤等所有负载都会读取完全相同的数据。

---

## 4. Streams（可选）
想让下游作业只消费最近一次批量新增的数据？给目标表创建 Stream。

```sql
CREATE OR REPLACE STREAM frame_events_stream ON TABLE frame_events;

SELECT * FROM frame_events_stream;   -- 查看刚 COPY 的新行
-- …处理…
SELECT * FROM frame_events_stream WITH CONSUME;  -- 推进游标
```

`WITH CONSUME` 会在你处理完行后向前推进 offset。参考：[Streams](/guides/load-data/continuous-data-pipelines/stream)。

---

## 5. Tasks（可选）
Task 会按计划运行**单条 SQL**。你可以为每张表建一个轻量 Task,或把逻辑写成存储过程后在 Task 中调用。

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

其余表可以按同样模式新增 Task。更多调度/依赖选项见：[Tasks](/guides/load-data/continuous-data-pipelines/task)。

---

当这些作业运行后,“统一工作负载”系列里的每个指南都读取相同的 CityDrive 表——无需额外 ETL,也不需要重复存储。
